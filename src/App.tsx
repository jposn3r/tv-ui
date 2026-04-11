import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Shell } from './components/Shell';
import { GlobalStyles } from './components/GlobalStyles';
import { useInputNavigation } from './hooks/useInputNavigation';
import { useIsTvMode } from './hooks/useMode';
import { useCursorHide } from './hooks/useCursorHide';
import { setContent, setPageContent } from './state/slices/contentSlice';
import { generateMockContent } from './data/mockContent';
import { fetchTmdbContent, fetchLogosProgressive } from './data/tmdb';

function TvNavigation() {
  useInputNavigation();
  return null;
}

export default function App() {
  const dispatch = useDispatch();
  const isTv = useIsTvMode();
  useCursorHide();

  useEffect(() => {
    fetchTmdbContent()
      .then((rows) => {
        if (rows.length > 0) {
          dispatch(setContent(rows));
          dispatch(setPageContent({ page: 'home', rows }));
          fetchLogosProgressive(rows, (updated) => {
            dispatch(setContent(updated));
            dispatch(setPageContent({ page: 'home', rows: updated }));
          });
        } else {
          const mock = generateMockContent();
          dispatch(setContent(mock));
          dispatch(setPageContent({ page: 'home', rows: mock }));
        }
      })
      .catch(() => {
        const mock = generateMockContent();
        dispatch(setContent(mock));
        dispatch(setPageContent({ page: 'home', rows: mock }));
      });
  }, [dispatch]);

  return (
    <>
      <GlobalStyles />
      {isTv && <TvNavigation />}
      <Shell />
    </>
  );
}
