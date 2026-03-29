import { rowTitleStyles } from '../styles/componentStyles/rowTitleStyles';

interface RowTitleProps {
  title: string;
  isRowFocused: boolean;
}

export function RowTitle({ title, isRowFocused }: RowTitleProps) {
  return <div style={rowTitleStyles.title(isRowFocused)}>{title}</div>;
}
