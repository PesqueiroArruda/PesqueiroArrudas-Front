import { GetServerSideProps, NextPage } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { Admin as AdminComponent } from 'pages-components/Admin';

const Admin: NextPage = () => <AdminComponent />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Admin;
