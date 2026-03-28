import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Shell } from './components/Shell';
import { useInputNavigation } from './hooks/useInputNavigation';
import { setContent, setPageContent } from './state/slices/contentSlice';
import { generateMockContent } from './data/mockContent';
import { fetchTmdbContent, fetchLogosProgressive } from './data/tmdb';

export default function App() {
  const dispatch = useDispatch();

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

  useInputNavigation();

  return <Shell />;
}
