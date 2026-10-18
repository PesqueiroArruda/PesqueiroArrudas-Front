import { NextPage, GetServerSideProps } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { MenuUsers as MenuUsersComponent } from 'pages-components/MenuUsers';

const MenuUsersPage: NextPage = () => <MenuUsersComponent />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default MenuUsersPage;
