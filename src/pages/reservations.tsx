import { NextPage, GetServerSideProps } from 'next';
import nookies from 'nookies';
import { Reservations as ReservationsComponent } from 'pages-components/Reservations';

const Reservations: NextPage = () => <ReservationsComponent />;

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

export default Reservations;
