import { createTheme, alpha } from '@mui/material/styles'

const SIDEBAR_WIDTH = 260

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0052CC',
      light: '#2684FF',
      dark: '#0747A6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6554C0',
      light: '#8777D9',
      dark: '#403294',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00875A',
      light: '#57D9A3',
      dark: '#006644',
    },
    warning: {
      main: '#FF991F',
      light: '#FFE380',
      dark: '#FF8B00',
    },
    error: {
      main: '#DE350B',
      light: '#FF5630',
      dark: '#BF2600',
    },
    info: {
      main: '#0065FF',
      light: '#4C9AFF',
      dark: '#0747A6',
    },
    background: {
      default: '#F0F2F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#172B4D',
      secondary: '#5E6C84',
      disabled: '#97A0AF',
    },
    divider: '#DFE1E6',
    sidebar: {
      bg: '#0A1929',
      text: '#B8C7E0',
      activeText: '#FFFFFF',
      activeBg: alpha('#0052CC', 0.85),
      hoverBg: alpha('#FFFFFF', 0.06),
      subText: '#6B8CAE',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontWeight: 600, fontSize: '0.8rem' },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5, fontSize: '0.875rem' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
    overline: { fontWeight: 600, letterSpacing: '0.08em', fontSize: '0.7rem' },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0px 1px 2px rgba(9,30,66,0.08)',
    '0px 1px 4px rgba(9,30,66,0.12)',
    '0px 2px 8px rgba(9,30,66,0.14)',
    '0px 4px 12px rgba(9,30,66,0.14)',
    '0px 6px 16px rgba(9,30,66,0.12)',
    '0px 8px 24px rgba(9,30,66,0.12)',
    '0px 10px 28px rgba(9,30,66,0.10)',
    '0px 12px 32px rgba(9,30,66,0.10)',
    '0px 14px 36px rgba(9,30,66,0.10)',
    '0px 16px 40px rgba(9,30,66,0.10)',
    '0px 18px 44px rgba(9,30,66,0.10)',
    '0px 20px 48px rgba(9,30,66,0.08)',
    '0px 22px 52px rgba(9,30,66,0.08)',
    '0px 24px 56px rgba(9,30,66,0.08)',
    '0px 26px 60px rgba(9,30,66,0.08)',
    '0px 28px 64px rgba(9,30,66,0.08)',
    '0px 30px 68px rgba(9,30,66,0.08)',
    '0px 32px 72px rgba(9,30,66,0.08)',
    '0px 34px 76px rgba(9,30,66,0.06)',
    '0px 36px 80px rgba(9,30,66,0.06)',
    '0px 38px 84px rgba(9,30,66,0.06)',
    '0px 40px 88px rgba(9,30,66,0.06)',
    '0px 42px 92px rgba(9,30,66,0.04)',
    '0px 44px 96px rgba(9,30,66,0.04)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 6, height: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: '#DFE1E6',
            borderRadius: 3,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '7px 16px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0 1px 3px rgba(9,30,66,0.2)',
          '&:hover': { boxShadow: '0 3px 8px rgba(9,30,66,0.2)' },
        },
        sizeSmall: { padding: '4px 10px', fontSize: '0.8rem' },
        sizeLarge: { padding: '10px 22px', fontSize: '0.95rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0px 1px 4px rgba(9,30,66,0.12)',
          border: '1px solid #DFE1E6',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 10 },
        elevation1: { boxShadow: '0px 1px 4px rgba(9,30,66,0.12)' },
        elevation2: { boxShadow: '0px 2px 8px rgba(9,30,66,0.14)' },
        elevation3: { boxShadow: '0px 4px 12px rgba(9,30,66,0.14)' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F4F5F7',
            color: '#5E6C84',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: '1px solid #DFE1E6',
            padding: '10px 16px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #EBECF0',
          padding: '12px 16px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#F4F5F7' },
          '&:last-child td': { borderBottom: 0 },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '& fieldset': { borderColor: '#DFE1E6' },
          '&:hover fieldset': { borderColor: '#B3BAC5' },
        },
        sizeSmall: { fontSize: '0.875rem' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.75rem', borderRadius: 4 },
        sizeSmall: { height: 22, fontSize: '0.7rem' },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { padding: '20px 24px 12px', fontWeight: 600, fontSize: '1.1rem' },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: '16px 24px' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: '12px 24px 20px', gap: 8 } },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 44,
          padding: '8px 16px',
          textTransform: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, borderRadius: '3px 3px 0 0' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 4, height: 6 } },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700, fontSize: '0.85rem' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#172B4D',
          fontSize: '0.75rem',
          borderRadius: 4,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 6, margin: '1px 8px', padding: '8px 12px' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
        standardInfo: { backgroundColor: '#E9F2FF', color: '#0052CC' },
        standardSuccess: { backgroundColor: '#E3FCEF', color: '#006644' },
        standardWarning: { backgroundColor: '#FFFAE6', color: '#FF8B00' },
        standardError: { backgroundColor: '#FFEBE6', color: '#BF2600' },
      },
    },
  },
})

export { SIDEBAR_WIDTH }
export default theme
