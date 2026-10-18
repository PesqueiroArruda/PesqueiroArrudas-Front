import { NextPage, GetServerSideProps } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { Kitchen as KitchenComponent } from 'pages-components/Kitchen';

const Kitchen: NextPage = () => <KitchenComponent />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Kitchen;
