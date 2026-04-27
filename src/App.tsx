import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Shell } from './components/Shell';
import { GlobalStyles } from './components/GlobalStyles';
import { TvHintToast } from './components/TvHintToast';
import { AuthScreen } from './components/auth/AuthScreen';
import { ProfileSelectScreen } from './components/profile/ProfileSelectScreen';
import { useInputNavigation } from './hooks/useInputNavigation';
import { useIsTvMode } from './hooks/useMode';
import { useCursorHide } from './hooks/useCursorHide';
import { useIsAuthenticated } from './hooks/useAuth';
import { useCurrentProfile } from './hooks/useProfile';
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
  const isAuthed = useIsAuthenticated();
  const currentProfile = useCurrentProfile();
  useCursorHide();

  // Only fetch home content once a profile is selected (deferring saves API calls when on auth screens)
  useEffect(() => {
    if (!isAuthed || !currentProfile) return;
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
  }, [dispatch, isAuthed, currentProfile?.id]);

  // Decide which screen to render
  let screen;
  if (!isAuthed) {
    screen = <AuthScreen />;
  } else if (!currentProfile) {
    screen = <ProfileSelectScreen />;
  } else {
    screen = <Shell />;
  }

  return (
    <>
      <GlobalStyles />
      {/* TV input navigation only runs when on the main Shell — auth/profile screens have their own keyboard handlers */}
      {isTv && isAuthed && currentProfile && <TvNavigation />}
      {screen}
      {isTv && isAuthed && currentProfile && <TvHintToast />}
    </>
  );
}
