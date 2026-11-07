import { useMemo } from 'react';
import { Button, Input, Segmented } from 'antd';
import { SearchOutlined, CloseOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useAppSelector } from '../app/hooks';
import { useFilterStore } from '../stores/filterStore';
import { useDebounce } from '../hooks/useDebounce';
import { CATEGORIES, type CategoryFilter } from '../features/books/types';
import { BookList } from '../features/books/components/BookList';
import { BorrowedShelf } from '../features/books/components/BorrowedShelf';
import { LibraryStatus } from '../components/LibraryStatus';
import { SummaryCards } from '../components/SummaryCards';
import { normalizeSearchText } from '../features/books/search';
import { selectBooks } from '../features/books/selectors';

const CATEGORY_OPTIONS = [
  { label: 'Tất cả', value: 'all' as const },
  ...CATEGORIES.map((value) => ({ label: value, value })),
];

export default function LibraryPage() {
  const books = useAppSelector(selectBooks);
  const keyword = useFilterStore((state) => state.keyword);
  const category = useFilterStore((state) => state.category);
  const setKeyword = useFilterStore((state) => state.setKeyword);
  const setCategory = useFilterStore((state) => state.setCategory);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const debouncedKeyword = useDebounce(keyword, 300);
  const searchIndex = useMemo(
    () =>
      books.map((book) => ({
        book,
        title: normalizeSearchText(book.title),
        author: normalizeSearchText(book.author),
      })),
    [books],
  );
  const filteredBooks = useMemo(() => {
    const query = normalizeSearchText(debouncedKeyword);
    return searchIndex
      .filter(
        ({ book, title, author }) =>
          (category === 'all' || book.category === category) &&
          (!query || title.includes(query) || author.includes(query)),
      )
      .map(({ book }) => book);
  }, [searchIndex, category, debouncedKeyword]);
  const isFiltered = keyword.trim() !== '' || category !== 'all';
  const searchPending = keyword !== debouncedKeyword;
  const filterKey = JSON.stringify([debouncedKeyword, category]);

  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span />
            KHÔNG GIAN ĐỌC CỦA BẠN
          </span>
          <h1>
            Khám phá một góc nhìn mới<span>.</span>
          </h1>
          <p>Những cuốn sách hay, những ý tưởng lớn. Tìm cuốn sách dành cho bạn.</p>
        </div>
        <div className="intro-mark" aria-hidden="true">
          <span>Đọc một chút,</span>
          <strong>biết thêm nhiều.</strong>
          <svg viewBox="0 0 110 52" fill="none">
            <path
              d="M8 42h92M16 35h71v7H16zM26 26h70v9H26zM20 17h64v9H20zM32 8h62v9H32z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M83 17v9M34 26v9M81 35v7M40 8v9" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </section>
      <SummaryCards />
      <div className="library-columns">
        <section className="catalog-section" aria-label="Danh mục sách">
          <div className="catalog-heading">
            <div className="section-title">
              <h2>Danh mục sách</h2>
              <span className="count-pill">{books.length}</span>
            </div>
            <span className="catalog-caption">
              <AppstoreOutlined /> Tuyển chọn cho bạn
            </span>
          </div>
          <Input
            className="search-input"
            size="large"
            placeholder="Tìm theo tên sách hoặc tác giả..."
            aria-label="Tìm theo tên sách hoặc tác giả"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            allowClear
          />
          <div className="filter-row">
            <Segmented<CategoryFilter>
              aria-label="Lọc theo thể loại"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
            />
            <span className="result-count" aria-live="polite">
              {searchPending ? 'Đang tìm...' : `${filteredBooks.length} đầu sách`}
            </span>
          </div>
          {isFiltered && (
            <div className="active-filter">
              <span>
                {debouncedKeyword.trim()
                  ? `Kết quả cho “${debouncedKeyword.trim()}”`
                  : 'Đang lọc theo thể loại'}
                {category !== 'all' ? ` · ${category}` : ''}
              </span>
              <Button type="text" size="small" icon={<CloseOutlined />} onClick={resetFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          )}
          <LibraryStatus>
            <BookList key={filterKey} books={filteredBooks} onReset={resetFilters} />
          </LibraryStatus>
          {filteredBooks.length > 0 && (
            <p className="catalog-end">
              {filteredBooks.length <= 12 ? 'Bạn đã xem hết' : 'Thư viện có'} {filteredBooks.length}{' '}
              đầu sách <span>✦</span> Một cuốn hay đang chờ được mở.
            </p>
          )}
        </section>
        <BorrowedShelf />
      </div>
    </>
  );
}
