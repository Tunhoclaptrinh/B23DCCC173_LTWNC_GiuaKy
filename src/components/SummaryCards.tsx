import { memo } from 'react';
import { BookOutlined, CheckCircleOutlined, ReadOutlined } from '@ant-design/icons';
import { useAppSelector } from '../app/hooks';
import { BORROW_LIMIT } from '../features/books/types';
import {
  selectAvailableCount,
  selectBooks,
  selectBooksStatus,
  selectBorrowedCount,
} from '../features/books/selectors';

export const SummaryCards = memo(function SummaryCards() {
  const items = useAppSelector(selectBooks);
  const status = useAppSelector(selectBooksStatus);
  const availableCount = useAppSelector(selectAvailableCount);
  const borrowedCount = useAppSelector(selectBorrowedCount);
  const ready = status === 'succeeded';
  const summary = [
    {
      icon: <BookOutlined />,
      title: 'Đầu sách trong thư viện',
      value: items.length,
      caption: '3 thể loại chuyên ngành',
      className: 'summary-books',
    },
    {
      icon: <CheckCircleOutlined />,
      title: 'Bản sách sẵn sàng',
      value: availableCount,
      caption: 'Sẵn sàng cho lần đọc tiếp theo',
      className: 'summary-available',
    },
    {
      icon: <ReadOutlined />,
      title: 'Sách bạn đang mượn',
      value: borrowedCount,
      caption: `Tối đa ${BORROW_LIMIT} cuốn cùng lúc`,
      className: 'summary-borrowed',
    },
  ];
  return (
    <section className="summary-grid" aria-label="Tổng quan thư viện">
      {summary.map((item) => (
        <div className={`summary-card ${item.className}`} key={item.title}>
          <div className="summary-icon">{item.icon}</div>
          <div>
            <span className="summary-label">{item.title}</span>
            <div className="summary-number">
              {ready ? item.value.toString().padStart(2, '0') : '—'}
              {item.className === 'summary-borrowed' && <span> / {BORROW_LIMIT}</span>}
            </div>
            <p>{item.caption}</p>
          </div>
        </div>
      ))}
    </section>
  );
});
