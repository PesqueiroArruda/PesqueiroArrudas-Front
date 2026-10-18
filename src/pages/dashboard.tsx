import { NextPage, GetServerSideProps } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { SalesDashboard } from 'pages-components/SalesDashboard';

const Dashboard: NextPage = () => <SalesDashboard />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Dashboard;
