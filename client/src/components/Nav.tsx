import { Drawer, List, Box, Toolbar } from "@mui/material";
import { ListItemLink } from "./ListItemLink";
import { routes } from "./routes";

const drawerWidth = 200;

export const Nav = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {routes.map((route, idx) => (
            <ListItemLink key={idx} primary={route.label} to={route.path} />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
