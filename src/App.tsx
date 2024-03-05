import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import ProTip from '@/components/ProTip';
import TodoPage from '@/containers/TodoPage';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © Gianmarco Bado ('}
      <Link color="inherit" href="https://github.com/giammyisjammy">
        @giammyisjammy
      </Link>
      {') '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Todo List in TypeScript
        </Typography>
        <TodoPage />
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
