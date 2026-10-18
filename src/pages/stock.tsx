import { NextPage, GetServerSideProps } from 'next';
import { requireStaff } from 'lib/pageGuards';
import { Stock as StockComponent } from 'pages-components/Stock';

const Stock: NextPage = () => <StockComponent />;

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Stock;
