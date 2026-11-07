import { Button, Result, Skeleton } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchBooks } from '../features/books/booksSlice';
import type { PropsWithChildren } from 'react';
import { selectBooksError, selectBooksStatus } from '../features/books/selectors';

export function LibraryStatus({ children }: PropsWithChildren) {
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);
  const dispatch = useAppDispatch();
  if (status === 'idle' || status === 'loading')
    return (
      <div className="loading-state" role="status" aria-live="polite">
        <span className="loading-label">Đang tải...</span>
        <div className="skeleton-grid">
          {['one', 'two', 'three', 'four', 'five', 'six'].map((key) => (
            <div className="skeleton-card" key={key}>
              <Skeleton.Node active style={{ width: '100%', height: 190 }} />
              <Skeleton active title paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      </div>
    );
  if (status === 'failed')
    return (
      <div role="alert">
        <Result
          status="warning"
          title="Thư viện đang cần một chút thời gian"
          subTitle={error}
          extra={
            <Button
              type="primary"
              icon={<ReloadOutlined aria-hidden="true" />}
              onClick={() => {
                void dispatch(fetchBooks(false));
              }}
            >
              Thử lại
            </Button>
          }
        />
      </div>
    );
  return children;
}
