import { NextPage, GetServerSideProps } from 'next';
import nookies from 'nookies';
import { SalesDashboard } from 'pages-components/SalesDashboard';

const Dashboard: NextPage = () => <SalesDashboard />;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = nookies.get(context);
  const { isAuthorized } = cookies;

  if (!isAuthorized) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Dashboard;
