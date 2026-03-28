import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Shell } from './components/Shell';
import { useInputNavigation } from './hooks/useInputNavigation';
import { setContent } from './state/slices/contentSlice';
import { generateMockContent } from './data/mockContent';
import { fetchTmdbContent, fetchLogosProgressive } from './data/tmdb';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTmdbContent()
      .then((rows) => {
        if (rows.length > 0) {
          // Show content immediately with backdrops
          dispatch(setContent(rows));
          // Stream logos in progressively
          fetchLogosProgressive(rows, (updated) => {
            dispatch(setContent(updated));
          });
        } else {
          dispatch(setContent(generateMockContent()));
        }
      })
      .catch(() => {
        dispatch(setContent(generateMockContent()));
      });
  }, [dispatch]);

  useInputNavigation();

  return <Shell />;
}
