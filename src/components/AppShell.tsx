import { useEffect, useState, type PropsWithChildren } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Drawer, Menu, Modal, Switch, Tooltip } from 'antd';
import {
  AppstoreOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  BookOutlined,
  BulbOutlined,
  CloseOutlined,
  MenuOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAppSelector } from '../app/hooks';
import { selectBorrowedCount } from '../features/books/selectors';
import { preloadStatsPage } from '../app/lazyRoutes';
import { LibraryNotifications } from './LibraryNotifications';

const pageNames: Record<string, string> = {
  '/': 'Khám phá',
  '/borrowed': 'Đang mượn',
  '/stats': 'Thống kê',
};

export function AppShell({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const { mode, toggleTheme } = useTheme();
  const total = useAppSelector(selectBorrowedCount);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = `${pageNames[pathname] ?? 'Không tìm thấy'} · Mini Library`;
  }, [pathname]);

  const navigation = (
    <>
      <Link
        to="/"
        className="brand"
        onClick={() => setDrawerOpen(false)}
        aria-label="Mini Library — Trang chủ"
      >
        <span className="brand-icon">
          <ReadOutlined />
        </span>
        <span>
          mini library<span className="brand-dot">.</span>
          <small>MỞ SÁCH, MỞ THẾ GIỚI</small>
        </span>
      </Link>
      <div className="sidebar-section-label">THƯ VIỆN</div>
      <nav aria-label="Điều hướng chính">
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          onClick={() => setDrawerOpen(false)}
          items={[
            {
              key: '/',
              icon: <AppstoreOutlined />,
              label: (
                <NavLink to="/" end>
                  Khám phá
                </NavLink>
              ),
            },
            {
              key: '/borrowed',
              icon: <BookOutlined />,
              label: (
                <NavLink to="/borrowed" className="borrowed-nav-label">
                  Đang mượn <Badge count={total} showZero color="var(--accent)" />
                </NavLink>
              ),
            },
            {
              key: '/stats',
              icon: <BarChartOutlined />,
              label: (
                <NavLink to="/stats" onPointerEnter={preloadStatsPage} onFocus={preloadStatsPage}>
                  Thống kê
                </NavLink>
              ),
            },
          ]}
        />
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card">
          <span className="help-icon">
            <BulbOutlined />
          </span>
          <h3>
            Đọc hôm nay,
            <br />
            vững bước ngày mai.
          </h3>
          <p>Mỗi cuốn sách là một khởi đầu.</p>
          <button
            onClick={() => {
              setHelpOpen(true);
              setDrawerOpen(false);
            }}
          >
            Hướng dẫn mượn sách <ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
        <div className="theme-control">
          <span>
            {mode === 'light' ? <SunOutlined /> : <MoonOutlined />}Giao diện{' '}
            {mode === 'light' ? 'sáng' : 'tối'}
          </span>
          <Switch
            aria-label="Chuyển giao diện sáng tối"
            checked={mode === 'dark'}
            onChange={toggleTheme}
            size="small"
          />
        </div>
        <div className="sidebar-signature">
          MINI LIBRARY <span>© 2026</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <aside className="sidebar">{navigation}</aside>
      <Drawer
        title="Thư viện của bạn"
        placement="left"
        size={270}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closeIcon={<CloseOutlined />}
        className="mobile-drawer"
      >
        <div className="drawer-navigation">{navigation}</div>
      </Drawer>
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <Button
              className="mobile-menu-button"
              type="text"
              icon={<MenuOutlined />}
              aria-label="Mở menu điều hướng"
              onClick={() => setDrawerOpen(true)}
            />
            <Breadcrumb
              items={[
                {
                  title: (
                    <span>
                      <ReadOutlined /> Thư viện
                    </span>
                  ),
                },
                { title: pageNames[pathname] ?? 'Không tìm thấy' },
              ]}
            />
          </div>
          <div className="topbar-right">
            <Tooltip title="Hướng dẫn mượn và trả sách">
              <Button
                type="text"
                shape="circle"
                icon={<QuestionCircleOutlined />}
                aria-label="Hướng dẫn mượn sách"
                onClick={() => setHelpOpen(true)}
              />
            </Tooltip>
            <span className="topbar-divider" />
            <div className="student-label">
              <strong>Sinh viên</strong>
              <span>D23DCCC173</span>
            </div>
            <Avatar className="student-avatar">SV</Avatar>
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          <LibraryNotifications />
          {children}
        </main>
        <footer className="main-footer">
          <span>Đọc. Khám phá. Trưởng thành.</span>
          <span>
            Mini Library <i /> Không gian tri thức của sinh viên
          </span>
        </footer>
      </div>
      <Modal
        title={
          <span>
            <ReadOutlined /> Một vài điều trước khi đọc
          </span>
        }
        open={helpOpen}
        onCancel={() => setHelpOpen(false)}
        footer={
          <Button type="primary" onClick={() => setHelpOpen(false)}>
            Mình đã hiểu
          </Button>
        }
      >
        <ol className="help-steps">
          <li>Tìm sách theo tên hoặc tác giả, hoặc chọn thể loại bạn yêu thích.</li>
          <li>
            Bấm <strong>Mượn</strong> khi sách còn bản. Bạn được mượn tối đa{' '}
            <strong>3 cuốn cùng lúc</strong>, kể cả nhiều bản của cùng một đầu sách.
          </li>
          <li>
            Vào <strong>Đang mượn</strong> hoặc tủ sách bên cạnh để trả từng cuốn. Số bản còn lại sẽ
            được cập nhật ngay.
          </li>
        </ol>
        <p className="help-note">
          Dữ liệu mượn/trả được giữ trong phiên sử dụng hiện tại. Tải lại trang sẽ bắt đầu phiên
          mới.
        </p>
      </Modal>
    </div>
  );
}
