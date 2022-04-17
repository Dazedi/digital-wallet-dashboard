import Page from '@components/Page';
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

export const Help = () => {
  return (
    <Page>
      <Typography variant="h3">Information</Typography>
      <Divider />
      <Box sx={{ border: '1px solid #ccc', my: 2, p: 2 }}>
        <Typography variant="h5">Testable wallets</Typography>
        <List>
          <ListItem>0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae</ListItem>
          <ListItem>0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a</ListItem>
          <ListItem>0x63a9975ba31b0b9626b34300f7f627147df1f526</ListItem>
          <ListItem>0x198ef1ec325a96cc354c7266a038be8b5c558f67</ListItem>
        </List>
      </Box>
      <Box sx={{ border: '1px solid #ccc', my: 2, p: 2 }}>
        <Typography variant="h5">Client</Typography>
        <Typography variant="body1">
          Running on React 18, using Vite. UI components from Material UI. Makes
          requests to server with Axios.
        </Typography>
        <Typography variant="h5" sx={{ marginTop: 1 }}>
          Server
        </Typography>
        <Typography variant="body1">
          NodeJS + NestJS. Currency exchange data is stored in-memory. Wallet
          information is fetched from etherscan.io.
        </Typography>
        {/* <Table>
          <TableHead>
            <TableRow>
              <TableCell>a</TableCell>
              <TableCell>b</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>a</TableCell>
              <TableCell>b</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>a</TableCell>
              <TableCell>b</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <Typography variant="body1">Infrastructure etc</Typography>    */}
      </Box>
    </Page>
  );
};

export default Help;
