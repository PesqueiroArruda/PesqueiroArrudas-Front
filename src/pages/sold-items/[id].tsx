import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { requireStaff } from 'lib/pageGuards';

import { SoldItems as SoldItemsComponent } from 'pages-components/SoldItems';

const Cashier: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  return <SoldItemsComponent cashierId={id as string} />;
};

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Cashier;
