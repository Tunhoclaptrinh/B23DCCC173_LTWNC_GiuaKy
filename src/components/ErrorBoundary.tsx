import { Component, type PropsWithChildren, type ReactNode } from 'react';
import { Button, Result } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export class ErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render(): ReactNode {
    if (this.state.failed)
      return (
        <div role="alert" className="page-error">
          <Result
            status="warning"
            title="Trang chưa thể hiển thị"
            subTitle="Bạn có thể tải lại trang hoặc chọn một mục khác trong thư viện."
            extra={
              <Button
                type="primary"
                icon={<ReloadOutlined aria-hidden="true" />}
                onClick={() => window.location.reload()}
              >
                Tải lại trang
              </Button>
            }
          />
        </div>
      );
    return this.props.children;
  }
}
