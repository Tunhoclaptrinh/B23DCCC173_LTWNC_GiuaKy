import { Card, Progress, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { useAppSelector } from '../app/hooks';
import { BORROW_LIMIT, type Category } from '../features/books/types';
import {
  selectBooks,
  selectBorrowedCount,
  selectCategoryStats,
  type CategoryStat,
} from '../features/books/selectors';
import { CATEGORY_PRESENTATION } from '../features/books/presentation';
import { SummaryCards } from '../components/SummaryCards';
import { LibraryStatus } from '../components/LibraryStatus';

const columns: TableColumnsType<CategoryStat> = [
  {
    title: 'Thể loại',
    dataIndex: 'category',
    key: 'category',
    render: (category: Category) => (
      <Tag color={CATEGORY_PRESENTATION[category].color}>{category}</Tag>
    ),
  },
  { title: 'Đầu sách', dataIndex: 'titles', key: 'titles', align: 'right' },
  { title: 'Bản còn lại', dataIndex: 'available', key: 'available', align: 'right' },
  { title: 'Bạn đang mượn', dataIndex: 'borrowed', key: 'borrowed', align: 'right' },
];

export default function StatsPage() {
  const items = useAppSelector(selectBooks);
  const stats = useAppSelector(selectCategoryStats);
  const totalBorrowed = useAppSelector(selectBorrowedCount);

  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span />
            THƯ VIỆN QUA NHỮNG CON SỐ
          </span>
          <h1>
            Một chút tổng quan<span>.</span>
          </h1>
          <p>Nhìn lại kho sách và hành trình đọc hiện tại của bạn.</p>
        </div>
      </section>
      <SummaryCards />
      <LibraryStatus>
        <div className="stats-grid">
          <Card className="stats-card" title="Đầu sách theo thể loại">
            <p className="panel-description">
              Mỗi đầu sách được tính một lần, không phụ thuộc số bản.
            </p>
            <div className="category-chart">
              {stats.map((stat) => (
                <div className="chart-row" key={stat.category}>
                  <div>
                    <span>
                      <i style={{ background: CATEGORY_PRESENTATION[stat.category].color }} />
                      {stat.category}
                    </span>
                    <strong>
                      {stat.titles} <small>đầu sách</small>
                    </strong>
                  </div>
                  <Progress
                    percent={items.length ? (stat.titles / items.length) * 100 : 0}
                    showInfo={false}
                    strokeColor={CATEGORY_PRESENTATION[stat.category].color}
                    railColor="var(--line)"
                  />
                </div>
              ))}
            </div>
          </Card>
          <Card className="stats-card loan-stat" title="Tình hình mượn sách">
            <Progress
              type="circle"
              percent={(totalBorrowed / BORROW_LIMIT) * 100}
              strokeColor="var(--accent)"
              railColor="var(--line)"
              format={() => (
                <span className="circle-value">
                  {totalBorrowed}
                  <small> / {BORROW_LIMIT} cuốn</small>
                </span>
              )}
            />
            <h3>
              {totalBorrowed === 0
                ? 'Sẵn sàng cho cuốn sách đầu tiên'
                : `Bạn đang khám phá ${totalBorrowed} cuốn sách`}
            </h3>
            <p>Hạn mức mượn của sinh viên</p>
          </Card>
        </div>
        <Card className="stats-table" title="Chi tiết theo thể loại">
          <Table<CategoryStat>
            columns={columns}
            dataSource={stats}
            rowKey="category"
            pagination={false}
            scroll={{ x: 440 }}
            summary={(data) => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <strong>Tổng cộng</strong>
                </Table.Summary.Cell>
                {(['titles', 'available', 'borrowed'] as const).map((key, index) => (
                  <Table.Summary.Cell index={index + 1} key={key} align="right">
                    <strong>{data.reduce((sum, row) => sum + row[key], 0)}</strong>
                  </Table.Summary.Cell>
                ))}
              </Table.Summary.Row>
            )}
          />
        </Card>
      </LibraryStatus>
    </>
  );
}
