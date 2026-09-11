import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';

import { AppShellLayout } from './layout';

interface Props {
  children: ReactNode;
  hasBackPageBtn?: boolean;
  handleBackPage?: () => void;
}

export const AppShell = ({ children, hasBackPageBtn, handleBackPage }: Props) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedUser, setLoggedUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setLoggedUser(localStorage.getItem('loggedUser') || '');

    if (!localStorage.getItem('loggedUser')) {
      router.push('/login');
    }
  }, [router]);

  function handleLinkToPage(path: string) {
    router.push(path);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('isAdmin');
    destroyCookie(null, 'isAuthorized');
    router.push('/login');
  }

  return (
    <AppShellLayout
      pathname={router.pathname}
      isAdmin={isAdmin}
      loggedUser={loggedUser}
      handleLinkToPage={handleLinkToPage}
      handleLogout={handleLogout}
      hasBackPageBtn={hasBackPageBtn}
      handleBackPage={handleBackPage}
      isSideMenuOpen={isSideMenuOpen}
      setIsSideMenuOpen={setIsSideMenuOpen}
    >
      {children}
    </AppShellLayout>
  );
};
