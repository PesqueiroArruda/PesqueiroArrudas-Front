import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { requireLogin } from 'lib/pageGuards';
import { WaiterCommandPage } from 'pages-components/Waiter/Command';

const GarcomCommand: NextPage = () => {
  const { query } = useRouter();
  return <WaiterCommandPage commandId={query.id as string | undefined} />;
};

export const getServerSideProps: GetServerSideProps = requireLogin;

export default GarcomCommand;
