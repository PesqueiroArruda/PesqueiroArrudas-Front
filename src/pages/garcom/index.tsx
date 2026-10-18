import { GetServerSideProps, NextPage } from 'next';
import { requireLogin } from 'lib/pageGuards';
import { WaiterCommands } from 'pages-components/Waiter/Commands';

const Garcom: NextPage = () => <WaiterCommands />;

export const getServerSideProps: GetServerSideProps = requireLogin;

export default Garcom;
