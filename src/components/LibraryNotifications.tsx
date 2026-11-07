import { useEffect } from 'react';
import { Alert, App } from 'antd';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearNotice } from '../features/books/booksSlice';
import { selectLibraryNotice } from '../features/books/selectors';

/** Notification changes should not rerender the catalogue or the routing tree. */
export function LibraryNotifications() {
  const notice = useAppSelector(selectLibraryNotice);
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  useEffect(() => {
    if (notice)
      void message.open({
        key: 'library-notice',
        type: notice.type,
        content: notice.message,
        duration: notice.type === 'warning' ? 5 : 3,
      });
  }, [notice, message]);
  if (notice?.type !== 'warning') return null;
  return (
    <Alert
      className="borrow-warning"
      type="warning"
      showIcon
      title="Đã đạt giới hạn mượn sách"
      description={notice.message}
      closable={{
        onClose: () => {
          dispatch(clearNotice());
        },
      }}
    />
  );
}
