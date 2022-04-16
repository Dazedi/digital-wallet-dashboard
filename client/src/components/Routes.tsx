import Dashboard from '@pages/Dashboard';
import Help from '@pages/Help';

export const routes = [
  {
    path: "/",
    label: "Dashboard",
    component: <Dashboard />,
  },
  {
    path: "/help",
    label: "Help",
    component: <Help />,
  },
];

