import { GetServerSideProps } from 'next';
import nookies from 'nookies';

const toLogin = { redirect: { destination: '/login', permanent: false } };

// Páginas do balcão: precisa estar logado e, se for garçom, vai pra tela dele.
// O cookie só decide o redirecionamento; o backend recusa o garçom de qualquer
// forma nas rotas que ele não pode usar.
export const requireStaff: GetServerSideProps = async (context) => {
  const { isAuthorized, role } = nookies.get(context);

  if (!isAuthorized) return toLogin;

  if (role === 'waiter') {
    return { redirect: { destination: '/garcom', permanent: false } };
  }

  return { props: {} };
};

// Telas do garçom (também abertas ao admin, que usa o mesmo fluxo no celular).
export const requireLogin: GetServerSideProps = async (context) => {
  const { isAuthorized } = nookies.get(context);

  if (!isAuthorized) return toLogin;

  return { props: {} };
};

// Gestão de usuários e segurança: só admin.
export const requireAdmin: GetServerSideProps = async (context) => {
  const { isAuthorized, role } = nookies.get(context);

  if (!isAuthorized) return toLogin;

  if (role === 'waiter') {
    return { redirect: { destination: '/garcom', permanent: false } };
  }

  if (role === 'user') {
    return { redirect: { destination: '/commands', permanent: false } };
  }

  // Sessões antigas não têm o cookie de perfil: pedem novo login em vez de
  // serem tratadas como admin.
  if (role !== 'admin') return toLogin;

  return { props: {} };
};
