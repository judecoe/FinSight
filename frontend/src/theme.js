import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
          "&:active": {
            outline: "none",
            boxShadow: "none",
          },
          "&.Mui-focusVisible": {
            outline: "2px solid rgba(0, 0, 0, 0.2)",
            outlineOffset: "2px",
          },
        },
      },
    },
  },
});

export default theme;
