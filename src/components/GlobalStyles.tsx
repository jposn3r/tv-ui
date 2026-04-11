import { useMode } from '../hooks/useMode';

const BASE_STYLES = `
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body, #root {
    width: 100%;
    background: #141414;
    color: #fff;
    font-family: 'Helvetica Neue', Helvetica, Arial, system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
`;

const TV_STYLES = `
  html, body, #root {
    height: 100%;
    overflow: hidden;
    user-select: none;
    cursor: default;
  }
`;

const WEB_STYLES = `
  html, body {
    min-height: 100%;
  }
  #root {
    min-height: 100%;
  }
  /* Subtle scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.3);
  }
`;

export function GlobalStyles() {
  const mode = useMode();
  const modeStyles = mode === 'tv' ? TV_STYLES : WEB_STYLES;

  return (
    <style dangerouslySetInnerHTML={{ __html: BASE_STYLES + modeStyles }} />
  );
}
