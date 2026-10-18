import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { requireStaff } from 'lib/pageGuards';

import { Customers as CustomersComponent } from 'pages-components/Customers';

const Cashier: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  return <CustomersComponent cashierId={id as string} />;
};

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Cashier;
