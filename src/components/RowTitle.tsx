import { type CSSProperties } from 'react';
import { theme } from '../styles/theme';

interface RowTitleProps {
  title: string;
  isRowFocused: boolean;
}

export function RowTitle({ title, isRowFocused }: RowTitleProps) {
  const style: CSSProperties = {
    color: theme.colors.text,
    fontSize: theme.typography.rowTitle.fontSize,
    fontWeight: theme.typography.rowTitle.fontWeight,
    letterSpacing: theme.typography.rowTitle.letterSpacing,
    marginBottom: 12,
    paddingLeft: theme.spacing.edgePadding,
    opacity: isRowFocused ? 1 : 0.6,
    transition: 'opacity 200ms ease-out',
  };

  return <div style={style}>{title}</div>;
}
