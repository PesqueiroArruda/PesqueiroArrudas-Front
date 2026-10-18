import { NextPage, GetServerSideProps } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { MenuOrganization as MenuOrganizationComponent } from 'pages-components/MenuOrganization';

const MenuOrganization: NextPage = () => <MenuOrganizationComponent />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default MenuOrganization;
