import { Button, Empty, Progress } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { BORROW_LIMIT } from '../features/books/types';
import { selectBorrowedBooks, selectBorrowedCount } from '../features/books/selectors';
import { BookList } from '../features/books/components/BookList';
import { LibraryStatus } from '../components/LibraryStatus';

export default function BorrowedPage() {
  const total = useAppSelector(selectBorrowedCount);
  const borrowedBooks = useAppSelector(selectBorrowedBooks);
  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span />
            GÓC ĐỌC CÁ NHÂN
          </span>
          <h1>
            Tủ sách của bạn<span>.</span>
          </h1>
          <p>Giữ lại những điều hay. Trả sách khi bạn sẵn sàng cho một hành trình mới.</p>
        </div>
      </section>
      <div className="borrowing-banner">
        <div>
          <strong>
            {total}/{BORROW_LIMIT} cuốn đang mượn
          </strong>
          <p>
            {total === BORROW_LIMIT
              ? 'Tủ sách đã đầy. Trả một cuốn để đón thêm điều mới nhé.'
              : `Bạn có thể mượn thêm ${BORROW_LIMIT - total} cuốn nữa.`}
          </p>
        </div>
        <Progress
          percent={(total / BORROW_LIMIT) * 100}
          steps={BORROW_LIMIT}
          showInfo={false}
          strokeColor="var(--accent)"
        />
      </div>
      <LibraryStatus>
        {total === 0 ? (
          <div className="borrowed-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <>
                  <h2>Một tủ sách đang chờ bạn</h2>
                  <p>Khám phá thư viện và chọn cuốn sách đầu tiên của mình.</p>
                </>
              }
            >
              <Link to="/">
                <Button type="primary" icon={<ArrowRightOutlined />} iconPlacement="end">
                  Khám phá sách
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <div className="borrowed-page-grid">
            <BookList books={borrowedBooks} />
          </div>
        )}
      </LibraryStatus>
    </>
  );
}
