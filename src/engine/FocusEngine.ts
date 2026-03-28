export type NavigationAction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'SELECT' | 'BACK';

export interface FocusPosition {
  rowIndex: number;
  tileIndex: number;
}

export interface RowDescriptor {
  id: string;
  tileCount: number;
}

export interface FocusEngineState {
  position: FocusPosition;
  rowMemory: Record<number, number>;
}

export type FocusChangeCallback = (
  prev: FocusPosition,
  next: FocusPosition,
  action: NavigationAction
) => void;

export class FocusEngine {
  private position: FocusPosition = { rowIndex: 0, tileIndex: 0 };
  private rowMemory: Record<number, number> = {};
  private rows: RowDescriptor[] = [];
  private listeners: FocusChangeCallback[] = [];
  private selectListeners: Array<(pos: FocusPosition) => void> = [];
  private backListeners: Array<() => void> = [];

  getPosition(): FocusPosition {
    return { ...this.position };
  }

  getState(): FocusEngineState {
    return {
      position: { ...this.position },
      rowMemory: { ...this.rowMemory },
    };
  }

  setRows(rows: RowDescriptor[]): void {
    this.rows = rows;
    // Clamp current position if rows changed
    if (this.position.rowIndex >= rows.length) {
      this.position.rowIndex = Math.max(0, rows.length - 1);
    }
    if (rows.length > 0) {
      const maxTile = rows[this.position.rowIndex].tileCount - 1;
      if (this.position.tileIndex > maxTile) {
        this.position.tileIndex = Math.max(0, maxTile);
      }
    }
  }

  onFocusChange(cb: FocusChangeCallback): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  onSelect(cb: (pos: FocusPosition) => void): () => void {
    this.selectListeners.push(cb);
    return () => {
      this.selectListeners = this.selectListeners.filter((l) => l !== cb);
    };
  }

  onBack(cb: () => void): () => void {
    this.backListeners.push(cb);
    return () => {
      this.backListeners = this.backListeners.filter((l) => l !== cb);
    };
  }

  navigate(action: NavigationAction): void {
    if (this.rows.length === 0) return;

    if (action === 'SELECT') {
      this.selectListeners.forEach((cb) => cb(this.getPosition()));
      return;
    }

    if (action === 'BACK') {
      this.backListeners.forEach((cb) => cb());
      return;
    }

    const prev = this.getPosition();
    const next = this.computeNext(action);

    if (next.rowIndex === prev.rowIndex && next.tileIndex === prev.tileIndex) {
      return; // No movement — at edge
    }

    this.position = next;
    this.listeners.forEach((cb) => cb(prev, next, action));
  }

  private computeNext(action: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): FocusPosition {
    const { rowIndex, tileIndex } = this.position;
    const currentRow = this.rows[rowIndex];

    switch (action) {
      case 'LEFT':
        return {
          rowIndex,
          tileIndex: Math.max(0, tileIndex - 1),
        };

      case 'RIGHT':
        return {
          rowIndex,
          tileIndex: Math.min(currentRow.tileCount - 1, tileIndex + 1),
        };

      case 'UP': {
        if (rowIndex === 0) return { rowIndex, tileIndex };
        // Save current tile position for this row
        this.rowMemory[rowIndex] = tileIndex;
        const newRow = rowIndex - 1;
        const targetRow = this.rows[newRow];
        // Restore remembered position, clamped to new row's length
        const remembered = this.rowMemory[newRow] ?? tileIndex;
        return {
          rowIndex: newRow,
          tileIndex: Math.min(remembered, targetRow.tileCount - 1),
        };
      }

      case 'DOWN': {
        if (rowIndex >= this.rows.length - 1) return { rowIndex, tileIndex };
        this.rowMemory[rowIndex] = tileIndex;
        const newRow = rowIndex + 1;
        const targetRow = this.rows[newRow];
        const remembered = this.rowMemory[newRow] ?? tileIndex;
        return {
          rowIndex: newRow,
          tileIndex: Math.min(remembered, targetRow.tileCount - 1),
        };
      }
    }
  }
}
