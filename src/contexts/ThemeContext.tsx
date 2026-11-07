import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { App as AntApp, ConfigProvider, theme as antTheme } from 'antd';
import viVN from 'antd/locale/vi_VN';

type ThemeMode = 'light' | 'dark';
interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): ThemeMode {
  try {
    return localStorage.getItem('mini-library-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
  const toggleTheme = useCallback(
    () => setMode((current) => (current === 'light' ? 'dark' : 'light')),
    [],
  );
  const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);
  const config = useMemo(
    () => ({
      algorithm: mode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      token: {
        colorPrimary: mode === 'dark' ? '#7eb49c' : '#236653',
        colorInfo: '#236653',
        colorSuccess: '#236653',
        colorText: mode === 'dark' ? '#e8e9e3' : '#28352e',
        colorTextSecondary: mode === 'dark' ? '#a5afa6' : '#667268',
        colorBgContainer: mode === 'dark' ? '#202923' : '#ffffff',
        colorBorder: mode === 'dark' ? '#3b463e' : '#e3e7e0',
        borderRadius: 9,
        fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
        fontSize: 13,
        controlHeight: 38,
        boxShadow: '0 5px 20px rgba(31, 52, 38, 0.06)',
      },
      components: {
        Button: { fontWeight: 500, primaryShadow: 'none' },
        Card: { paddingLG: 18 },
        Segmented: { trackBg: mode === 'dark' ? '#18211c' : '#f1f3ee' },
      },
    }),
    [mode],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    try {
      localStorage.setItem('mini-library-theme', mode);
    } catch {
      /* Storage may be disabled. */
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider locale={viVN} theme={config}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme phải được sử dụng bên trong ThemeProvider.');
  return context;
}
