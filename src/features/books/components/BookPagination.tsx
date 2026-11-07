import { Pagination } from 'antd';

type BookPaginationProps = Readonly<{
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}>;

export default function BookPagination(props: BookPaginationProps) {
  return (
    <Pagination
      {...props}
      showSizeChanger={false}
      showLessItems
      responsive
      showTotal={(total, range) => `${range[0]}–${range[1]} / ${total} đầu sách`}
    />
  );
}
