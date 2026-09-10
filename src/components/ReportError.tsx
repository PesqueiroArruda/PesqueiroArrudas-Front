import { Alert, AlertIcon, Button, Stack } from '@chakra-ui/react';
import { Header } from './Header';
import { Layout } from './Layout';

interface Props {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}

export const ReportError = ({ message, onRetry, onBack }: Props) => (
  <Layout>
    <Header hasBackPageBtn handleBackPage={onBack} />
    <Stack align="start" spacing={4}>
      <Alert status="error">
        <AlertIcon />
        {message}
      </Alert>
      <Button onClick={onRetry}>Try again</Button>
    </Stack>
  </Layout>
);
