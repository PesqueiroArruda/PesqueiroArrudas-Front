import type { GetServerSideProps, NextPage } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { Home as HomeComponent } from '../pages-components/Home';

const Home: NextPage = () => <HomeComponent />;



export const getServerSideProps: GetServerSideProps = requireStaff;

export default Home;
