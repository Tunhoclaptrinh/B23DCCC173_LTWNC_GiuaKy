import { lazy, Suspense, useEffect } from 'react';
import { Button, Result, Spin } from 'antd';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchBooks } from './features/books/booksSlice';
import { AppShell } from './components/AppShell';
import LibraryPage from './pages/LibraryPage';
import BorrowedPage from './pages/BorrowedPage';
import { loadStatsPage } from './app/lazyRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { selectBooksStatus } from './features/books/selectors';

// Required code splitting: statistics are fetched only when this route is visited.
const StatsPage = lazy(loadStatsPage);

export default function App() {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const status = useAppSelector(selectBooksStatus);
  useEffect(() => {
    if (status === 'idle') {
      const simulateFailure = new URLSearchParams(window.location.search).get('apiError') === '1';
      void dispatch(fetchBooks(simulateFailure));
    }
  }, [dispatch, status]);

  return (
    <AppShell>
      <ErrorBoundary key={pathname}>
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              <Spin />
              <p>Đang tải trang...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/borrowed" element={<BorrowedPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route
              path="*"
              element={
                <Result
                  status="404"
                  title="Trang này chưa có trên kệ"
                  subTitle="Quay lại thư viện để tiếp tục khám phá nhé."
                  extra={
                    <Link to="/">
                      <Button type="primary">Về thư viện</Button>
                    </Link>
                  }
                />
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
