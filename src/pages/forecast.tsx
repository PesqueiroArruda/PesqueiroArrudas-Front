import { NextPage, GetServerSideProps } from 'next';
import { requireAdmin } from 'lib/pageGuards';
import { Forecast } from 'pages-components/Forecast';

const ForecastPage: NextPage = () => <Forecast />;

export const getServerSideProps: GetServerSideProps = requireAdmin;

export default ForecastPage;
