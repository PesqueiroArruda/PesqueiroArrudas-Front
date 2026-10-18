import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { requireStaff } from 'lib/pageGuards';

import { Command as CommandComponent } from 'pages-components/Command';

const Command: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  return <CommandComponent commandId={id} />;
};

export const getServerSideProps: GetServerSideProps = requireStaff;

export default Command;
