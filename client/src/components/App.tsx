import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import Router from "./Router";

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6">Digital Wallet Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Router />
    </Box>
  );
}

export default App;
