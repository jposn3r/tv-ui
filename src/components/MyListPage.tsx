import { type CSSProperties, memo } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { selectFocus, selectNavFocused } from '../state/selectors';

export const MyListPage = memo(function MyListPage() {
  const focus = useSelector(selectFocus);
  const navFocused = useSelector(selectNavFocused);
  const isFocused = !navFocused && focus.rowIndex === 0 && focus.tileIndex === 0;

  const containerStyle: CSSProperties = {
    paddingTop: theme.spacing.headerHeight + 60,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    fontFamily: theme.typography.fontFamily,
  };

  const iconStyle: CSSProperties = {
    marginBottom: 24,
    opacity: 0.4,
  };

  const titleStyle: CSSProperties = {
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: 12,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 32,
  };

  const buttonStyle: CSSProperties = {
    padding: '14px 32px',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: theme.typography.fontFamily,
    color: isFocused ? '#000' : '#fff',
    background: isFocused ? '#fff' : 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: 4,
    cursor: 'default',
    transition: 'all 200ms ease-out',
    transform: isFocused ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isFocused ? '0 4px 16px rgba(255,255,255,0.2)' : 'none',
  };

  return (
    <div style={containerStyle}>
      <svg style={iconStyle} width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      <div style={titleStyle}>Your list is empty</div>
      <div style={subtitleStyle}>Add movies and TV shows to keep track of what you want to watch</div>
      <div style={buttonStyle} role="button" aria-label="Browse content">
        Browse Content
      </div>
    </div>
  );
});
