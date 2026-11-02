import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { AppShell } from 'components/AppShell';
import {
  ForecastEvent,
  ForecastEventInput,
  ForecastEventResults,
} from 'types/Forecast';
import { uploadFileToPresignedUrl } from 'utils/uploadFileToPresignedUrl';
import AgendaService from './services/AgendaService';
import { AgendaLayout } from './layout';

const ALLOWED_IMAGES = ['image/webp', 'image/jpeg', 'image/png'];

export const Agenda = () => {
  const [events, setEvents] = useState<ForecastEvent[]>([]);
  const [results, setResults] = useState<ForecastEventResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);

  const toast = useToast();

  const load = useCallback(async () => {
    const [eventList, resultData] = await Promise.all([
      AgendaService.getEvents(),
      AgendaService.getResults().catch(() => null),
    ]);
    setEvents(eventList);
    setResults(resultData);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await load();
      } catch {
        setHasFailed(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [load]);

  // A mutação já deu certo; se só a atualização da lista falhar, avisa sem
  // dizer que o salvamento falhou (reenviar duplicaria o evento).
  async function reload() {
    try {
      await load();
    } catch {
      toast({
        status: 'warning',
        title: 'Salvo, mas não consegui atualizar a lista. Recarregue a página.',
      });
    }
  }

  function showError(err: any, fallback: string) {
    toast({
      status: 'error',
      title: err?.response?.data?.message || fallback,
    });
  }

  async function handleSave(
    input: ForecastEventInput,
    { id, image }: { id?: string; image: File | null }
  ) {
    try {
      const payload = { ...input };
      if (image) {
        if (!ALLOWED_IMAGES.includes(image.type)) {
          toast({
            status: 'warning',
            title: 'Use uma imagem JPEG, PNG ou WebP.',
          });
          return false;
        }
        const { uploadUrl, imageKey } = await AgendaService.getImageUploadUrl(
          image.type
        );
        await uploadFileToPresignedUrl({
          uploadUrl,
          file: image,
          contentType: image.type,
        });
        payload.imageKey = imageKey;
      }
      if (id) await AgendaService.updateEvent(id, payload);
      else await AgendaService.createEvent(payload);
      toast({ status: 'success', title: 'Evento salvo', duration: 1500 });
      await reload();
      return true;
    } catch (err: any) {
      showError(err, 'Não foi possível salvar o evento.');
      return false;
    }
  }

  async function handleDelete(id: string) {
    try {
      await AgendaService.deleteEvent(id);
      await reload();
    } catch (err: any) {
      showError(err, 'Não foi possível remover o evento.');
    }
  }

  async function handleTogglePublished(event: ForecastEvent) {
    try {
      await AgendaService.updateEvent(event._id, {
        name: event.name,
        date: event.date,
        time: event.time,
        movementLevel: event.movementLevel,
        effectPercent: event.effectPercent,
        imageKey: event.imageKey,
        published: !event.published,
      });
      await reload();
    } catch (err: any) {
      showError(err, 'Não foi possível atualizar o evento.');
    }
  }

  return (
    <AppShell>
      <AgendaLayout
        events={events}
        results={results}
        isLoading={isLoading}
        hasFailed={hasFailed}
        onSave={handleSave}
        onDelete={handleDelete}
        onTogglePublished={handleTogglePublished}
      />
    </AppShell>
  );
};
