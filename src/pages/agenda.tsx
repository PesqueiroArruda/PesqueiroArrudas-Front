import { NextPage, GetServerSideProps } from 'next';
import { requireAdmin } from 'lib/pageGuards';
import { Agenda } from 'pages-components/Agenda';

const AgendaPage: NextPage = () => <Agenda />;

export const getServerSideProps: GetServerSideProps = requireAdmin;

export default AgendaPage;
