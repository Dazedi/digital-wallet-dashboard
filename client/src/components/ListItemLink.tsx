import { forwardRef, ReactElement, useMemo } from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

interface ListItemLinkProps {
  icon?: ReactElement;
  primary: string;
  to: string;
}

export const ListItemLink = (props: ListItemLinkProps) => {
  const { icon, primary, to } = props;

  const renderLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(
        (itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />,
      ),
    [to],
  );

  return (
    <ListItem button component={renderLink}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText primary={primary} />
    </ListItem>
  );
};

export default ListItemLink;
