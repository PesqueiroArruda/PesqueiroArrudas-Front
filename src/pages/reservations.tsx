import { NextPage, GetServerSideProps } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { Reservations as ReservationsComponent } from 'pages-components/Reservations';

const Reservations: NextPage = () => <ReservationsComponent />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Reservations;
