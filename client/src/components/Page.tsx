import { Box, BoxProps, Toolbar } from "@mui/material";

interface PageProps {
  children: React.ReactNode;
  sx?: BoxProps['sx'];
}

export const Page = ({ children, sx }: PageProps) => {
  console.log("sx", sx)
  return (
    <Box
      component={"main"}
      sx={{ 
        flexGrow: 1,
      }}
    >
      <Toolbar />
      <Box sx={{ p: 3, flexGrow: 1, ...(sx ? sx : {})}}>
        { children }
      </Box>
    </Box>
  )
}

export default Page;