import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FocusEngine } from '../engine/FocusEngine';
import { InputManager } from '../engine/InputManager';
import { setFocus } from '../state/slices/focusSlice';
import {
  openDetail,
  closeDetail,
  setDetailButtonIndex,
} from '../state/slices/uiSlice';
import { selectRows, selectDetailOverlay, selectFocusedTile } from '../state/selectors';
import { DETAIL_BUTTON_COUNT } from '../utils/constants';
import type { RootState } from '../state/store';

export function useInputNavigation() {
  const dispatch = useDispatch();
  const rows = useSelector(selectRows);
  const overlay = useSelector(selectDetailOverlay);
  const focusedTile = useSelector(selectFocusedTile);

  // Use refs so the callback always has fresh state without re-subscribing
  const overlayRef = useRef(overlay);
  overlayRef.current = overlay;
  const focusedTileRef = useRef(focusedTile);
  focusedTileRef.current = focusedTile;

  const engineRef = useRef<FocusEngine | null>(null);
  const inputRef = useRef<InputManager | null>(null);

  useEffect(() => {
    const engine = new FocusEngine();
    const input = new InputManager();
    engineRef.current = engine;
    inputRef.current = input;

    engine.setRows(
      rows.map((r) => ({ id: r.id, tileCount: r.tiles.length }))
    );

    engine.onFocusChange((_prev, next) => {
      dispatch(setFocus({ rowIndex: next.rowIndex, tileIndex: next.tileIndex }));
    });

    engine.onSelect((pos) => {
      const ov = overlayRef.current;
      if (ov.open) return; // buttons in overlay handled separately
      const row = rows[pos.rowIndex];
      const tile = row?.tiles[pos.tileIndex];
      if (tile) dispatch(openDetail(tile));
    });

    engine.onBack(() => {
      if (overlayRef.current.open) {
        dispatch(closeDetail());
      }
    });

    input.start((action) => {
      const ov = overlayRef.current;
      if (ov.open) {
        // Navigate overlay buttons
        if (action === 'LEFT') {
          dispatch(
            setDetailButtonIndex(Math.max(0, ov.buttonIndex - 1))
          );
        } else if (action === 'RIGHT') {
          dispatch(
            setDetailButtonIndex(
              Math.min(DETAIL_BUTTON_COUNT - 1, ov.buttonIndex + 1)
            )
          );
        } else if (action === 'BACK') {
          dispatch(closeDetail());
        }
        // SELECT on overlay button — no-op for now
        return;
      }

      // Toggle perf HUD handled at window level in App
      engine.navigate(action);
    });

    return () => {
      input.dispose();
    };
  }, [rows, dispatch]);

  return engineRef;
}
