import { NextPage, GetServerSideProps } from 'next';
import nookies from 'nookies';
import { IfoodOrders as IfoodOrdersComponent } from 'pages-components/IfoodOrders';

const IfoodOrders: NextPage = () => <IfoodOrdersComponent />;

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

export default IfoodOrders;
