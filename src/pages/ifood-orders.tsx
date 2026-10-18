import { NextPage, GetServerSideProps } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { IfoodOrders as IfoodOrdersComponent } from 'pages-components/IfoodOrders';

const IfoodOrders: NextPage = () => <IfoodOrdersComponent />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default IfoodOrders;
