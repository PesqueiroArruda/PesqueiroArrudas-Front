import { GetServerSideProps, NextPage } from 'next';
import { requireAdmin } from 'lib/pageGuards';
import { Users as UsersComponent } from 'pages-components/Users';

const Users: NextPage = () => <UsersComponent />;

export const getServerSideProps: GetServerSideProps = requireAdmin;

export default Users;
