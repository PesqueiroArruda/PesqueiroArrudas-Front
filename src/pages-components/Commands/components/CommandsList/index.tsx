import { useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { CommandsContext } from 'pages-components/Commands';
import { Command } from 'types/Command';
import { parseCommandLocation } from 'utils/commandLocation';
import { normalizeSearch } from 'utils/normalizeSearch';
import { CommandsListLayout } from './layout';
import { EditCommandModal } from '../EditCommandModal';
import { DeleteCommandModal } from '../DeleteCommandModal';

const AddProductsModal = dynamic(
  () => import('../AddProductsModal').then((mod) => mod.AddProductsModal),
  { ssr: false }
);

export const CommandsList = () => {
  const [commandIdToAddProducts, setCommandIdToAddProducts] = useState('');

  const [isAddProductsModalOpen, setIsAddProductsOpen] = useState(false);
  const [allSalesVisible, setAllSalesVisible] = useState(false);

  const [commandToEdit, setCommandToEdit] = useState<Command>({} as Command);
  const [isEditCommandModalOpen, setIsEditCommandModalOpen] = useState(false);

  const [commandIdToDelete, setCommandIdToDelete] = useState('');
  const [isDeleteCommandModalOpen, setIsDeleteCommandModalOpen] =
    useState(false);

  const router = useRouter();
  const {
    searchContent,
    locationFilter,
    allCommands,
    commandStatusFilter,
  } = useContext(CommandsContext);

  const handleToggleAllSalesVisible = () => {
    setAllSalesVisible((prev) => !prev);
  }

  const handleGoToCommandPage = useCallback(
    ({ commandId }: { commandId: string }) => {
      router.push(`/command/${commandId}`);
    },
    [router]
  );

  const handleOpenAddProductsModal = useCallback((commandId: string) => {
    setCommandIdToAddProducts(commandId);
    setIsAddProductsOpen(true);
  }, []);

  const handleOpenEditCommandModal = useCallback((command: Command) => {
    setCommandToEdit(command);
    setIsEditCommandModalOpen(true);
  }, []);

  const handleOpenDeleteCommandModal = useCallback((commandId: string) => {
    setCommandIdToDelete(commandId);
    setIsDeleteCommandModalOpen(true);
  }, []);

  const filteredByStatus = useMemo(
    () =>
      allCommands.filter((command) =>
        commandStatusFilter === 'Ativas' ? command?.isActive : !command?.isActive
      ),
    [allCommands, commandStatusFilter]
  );

  const filteredByLocation = useMemo(() => {
    if (!locationFilter) {
      return filteredByStatus;
    }

    return filteredByStatus.filter(
      (command) =>
        parseCommandLocation(command?.table).location === locationFilter
    );
  }, [filteredByStatus, locationFilter]);

  const filteredBySearch = useMemo(() => {
    const normalizedSearch = normalizeSearch(searchContent);

    return filteredByLocation.filter((command) =>
      normalizeSearch(Object?.values(command)?.join('')).includes(
        normalizedSearch
      )
    );
  }, [searchContent, filteredByLocation]);

  const allSalesWorth = useMemo(
    () =>
      allCommands.reduce((acc: number, command) => {
        if (!command.total) {
          return acc;
        }

        return command.total - (command.discount || 0) + acc;
      }, 0),
    [allCommands]
  );


  return (
    <>
      <CommandsListLayout
        allSalesWorth={allSalesWorth}
        items={filteredBySearch}
        allSalesVisible={allSalesVisible}
        handleToggleAllSalesVisible={handleToggleAllSalesVisible}
        handleGoToCommandPage={handleGoToCommandPage}
        handleOpenAddProductsModal={handleOpenAddProductsModal}
        handleOpenEditCommandModal={handleOpenEditCommandModal}
        handleOpenDeleteCommandModal={handleOpenDeleteCommandModal}
      />
      <AddProductsModal
        isModalOpen={isAddProductsModalOpen}
        setIsModalOpen={setIsAddProductsOpen}
        commandId={commandIdToAddProducts}
      />
      <EditCommandModal
        isModalOpen={isEditCommandModalOpen}
        setIsModalOpen={setIsEditCommandModalOpen}
        command={commandToEdit}
      />
      <DeleteCommandModal
        commandId={commandIdToDelete}
        isModalOpen={isDeleteCommandModalOpen}
        setIsModalOpen={setIsDeleteCommandModalOpen}
      />
    </>
  );
};
