import { GetServerSideProps, NextPage } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { Commands as CommandsComponent } from 'pages-components/Commands';

const Commands: NextPage = () => <CommandsComponent />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Commands;
