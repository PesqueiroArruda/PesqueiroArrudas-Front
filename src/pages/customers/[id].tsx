import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import nookies from 'nookies';

import { Customers as CustomersComponent } from 'pages-components/Customers';

const Cashier: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  return <CustomersComponent cashierId={id as string} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = nookies.get(context);
  const { isAuthorized } = cookies;

  if (!isAuthorized) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Cashier;
