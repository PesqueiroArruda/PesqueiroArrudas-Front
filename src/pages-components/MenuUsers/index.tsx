import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { MenuUser, MenuUserFilters } from 'types/MenuUser';
import { MenuUsersLayout } from './layout';
import MenuUsersService from './services/MenuUsersService';

export const MenuUsers = () => {
  const router = useRouter();
  const toast = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [menuUsers, setMenuUsers] = useState<MenuUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MenuUserFilters>({});

  const reloadMenuUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await MenuUsersService.list(filters);
      setMenuUsers(data);
    } catch (error: any) {
      toast({
        status: 'error',
        title: 'Não foi possível carregar os usuários do cardápio.',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    reloadMenuUsers();
  }, [reloadMenuUsers]);

  useEffect(() => {
    const isAdminUse = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUse);

    if (!isAdminUse) {
      router.push('/commands');
    }
  }, [router]);

  function handleFilterChange(patch: Partial<MenuUserFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  if (isAdmin) {
    return <MenuUsersLayout menuUsers={menuUsers} isLoading={isLoading} filters={filters} handleFilterChange={handleFilterChange} />;
  }

  return null;
};
