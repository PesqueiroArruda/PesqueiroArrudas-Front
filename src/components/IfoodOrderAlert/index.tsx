import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { BellRing, X } from 'lucide-react';

import { SocketContext } from 'pages/_app';

const ALARM_SRC = '/kitchenalarm.mp3';
const REPEAT_EVERY_MS = 12000;
const TITLE_BLINK_MS = 1000;
const ALERT_TITLE = '🔔 Novo pedido iFood!';

// Alerta global de pedido novo do iFood: toca o alarme e mostra um aviso fixo
// em qualquer tela (não só em /ifood-orders), repetindo o som até alguém
// abrir o pedido ou dispensar o aviso. Só vale pra admin, igual à tela.
export const IfoodOrderAlert = () => {
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const [pendingCount, setPendingCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isOnIfoodPage = router.pathname === '/ifood-orders';

  const playAlarm = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    // O navegador bloqueia som antes de qualquer toque na página; nesse caso
    // o aviso visual continua aparecendo.
    audio.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(ALARM_SRC);

    // Destrava o áudio no primeiro toque/clique, senão o navegador não deixa
    // o som tocar quando o pedido chegar sozinho.
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.muted = true;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {
          audio.muted = false;
        });
    };
    document.addEventListener('pointerdown', unlock, { once: true });

    return () => {
      document.removeEventListener('pointerdown', unlock);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!socket?.on) return undefined;

    const onReceived = () => {
      if (localStorage.getItem('isAdmin') !== 'true') return;
      setPendingCount((prev) => prev + 1);
      playAlarm();
    };

    socket.on('ifood-order-received', onReceived);
    return () => {
      socket.off('ifood-order-received', onReceived);
    };
  }, [socket, playAlarm]);

  // Quem abre a tela de pedidos já está vendo o pedido: some o aviso.
  useEffect(() => {
    if (isOnIfoodPage) setPendingCount(0);
  }, [isOnIfoodPage]);

  // Enquanto o aviso estiver aberto: repete o som e pisca o título da aba.
  useEffect(() => {
    if (pendingCount === 0) return undefined;

    const originalTitle = document.title;
    let showAlert = true;
    document.title = ALERT_TITLE;

    const soundTimer = setInterval(playAlarm, REPEAT_EVERY_MS);
    const titleTimer = setInterval(() => {
      showAlert = !showAlert;
      document.title = showAlert ? ALERT_TITLE : originalTitle;
    }, TITLE_BLINK_MS);

    return () => {
      clearInterval(soundTimer);
      clearInterval(titleTimer);
      document.title = originalTitle;
    };
  }, [pendingCount, playAlarm]);

  if (pendingCount === 0) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-3 top-3 z-[100] mx-auto flex max-w-md items-center gap-3 rounded-(--radius) border-2 border-gold bg-navy p-3 text-white shadow-2xl animate-pulse"
    >
      <BellRing className="h-6 w-6 shrink-0 text-gold" />
      <div className="min-w-0 flex-1">
        <p className="font-bold">
          {pendingCount === 1
            ? 'Chegou um pedido do iFood'
            : `Chegaram ${pendingCount} pedidos do iFood`}
        </p>
        <button
          type="button"
          onClick={() => (isOnIfoodPage ? setPendingCount(0) : router.push('/ifood-orders'))}
          className="text-sm font-semibold text-gold underline"
        >
          {isOnIfoodPage ? 'Parar o alarme' : 'Abrir pedidos'}
        </button>
      </div>
      <button
        type="button"
        aria-label="Dispensar aviso"
        onClick={() => setPendingCount(0)}
        className="shrink-0 rounded p-1 hover:bg-white/10"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};
