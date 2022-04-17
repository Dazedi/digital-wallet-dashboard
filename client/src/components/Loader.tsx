import { Box, CircularProgress } from '@mui/material';

export const Loader = () => {
  return (
    <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <CircularProgress />
    </Box>
  )
}