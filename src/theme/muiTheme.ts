import { createTheme } from '@mui/material/styles';
import { orgTheme } from '../theme';

export const muiTheme = createTheme({
  palette: {
    primary: { main: orgTheme.primary },
    secondary: { main: orgTheme.secondary },
    background: { default: orgTheme.background },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#fff',
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: orgTheme.primary },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: orgTheme.primary },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { '&.Mui-focused': { color: orgTheme.primary } },
      },
    },
  },
});
