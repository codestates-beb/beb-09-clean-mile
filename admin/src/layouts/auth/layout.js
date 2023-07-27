import PropTypes from "prop-types";
import NextLink from "next/link";
import { Box } from "@mui/material";
import { Logo } from "src/components/logo";

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
      }}
    >
      {children}
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node,
};
