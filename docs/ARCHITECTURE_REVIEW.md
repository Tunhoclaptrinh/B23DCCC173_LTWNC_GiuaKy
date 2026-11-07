# Rà soát kiến trúc và hiệu năng

## Mức đáp ứng bài tập

Các yêu cầu chức năng và kỹ thuật đã có triển khai, được đối chiếu theo file trong README. Redux Toolkit tiếp tục quản lý sách và khoản mượn; middleware tự viết giữ giới hạn 3 cuốn; Zustand quản lý bộ lọc; Context quản lý theme. Các phần tối ưu bổ sung giữ nguyên các yêu cầu bắt buộc như useMemo cho danh sách lọc, useCallback cho handler và React.lazy + Suspense cho `/stats`.

Phần nộp bài GitHub chưa được thực hiện từ môi trường local này: cần tạo repository public đúng tên, push và kiểm tra mốc commit theo hạn giảng viên.

## Những điểm đã cải thiện

| Vấn đề khi rà soát                                                    | Thay đổi                                                                                                         | Lợi ích và giới hạn                                                                             |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Component theo dõi cả slice nên phản ứng với thay đổi không liên quan | Selector chọn đúng dữ liệu; tách thông báo khỏi cây route                                                        | Thay đổi thông báo không kéo theo việc cập nhật cả danh mục                                     |
| Tính lại số bản, số cuốn và thống kê ở nhiều component                | Selector có memoization trong `features/books/selectors.ts`                                                      | Dùng chung kết quả; test xác nhận giữ nguyên reference khi chỉ đổi thông báo                    |
| Duyệt `.find()` lặp lại khi ghép sách và khoản mượn                   | Lookup Map suy ra từ Redux state                                                                                 | Tra cứu trực tiếp; Map không nằm trong Redux state nên state vẫn serializable                   |
| Khi gõ, component danh sách vẫn được gọi dù đang debounce             | Memo hóa BookList, SummaryCards và BorrowedShelf                                                                 | Tránh xử lý lại các phần không đổi trong thời gian chờ debounce                                 |
| Vài trăm đầu sách tạo nhiều thẻ DOM cùng lúc                          | Phân trang 12 sách; chỉ tải component phân trang khi cần                                                         | Test với 240 sách xác nhận chỉ 12 thẻ được render, giảm 95% số thẻ so với render toàn bộ        |
| Chỉ tìm được tiếng Việt có dấu                                        | Chuẩn hóa Unicode, bỏ dấu khi so khớp và trim từ khóa                                                            | Gõ `tam ly hoc ve tien` tìm được `Tâm lý học về tiền`                                           |
| Tên/màu thể loại và hạn mức lặp lại                                   | Mapping thể loại dùng chung; dùng BORROW_LIMIT trong thống kê                                                    | Giảm khả năng các màn hình khác nhau hiển thị không nhất quán                                   |
| Lỗi render hoặc tải module có thể làm mất nội dung                    | ErrorBoundary quanh route, có nút tải lại                                                                        | Giữ sidebar và trạng thái Redux khi chuyển sang trang khác; chưa thay thế hệ thống giám sát lỗi |
| Chuyển trang thống kê phải bắt đầu tải sau thao tác                   | Preload module khi hover hoặc focus liên kết                                                                     | Bắt đầu tải khi người dùng có ý định truy cập; lỗi preload được xử lý                           |
| Theme tối có thể lóe giao diện sáng lúc tải lại                       | Khởi tạo theme trong head trước khi render React                                                                 | Context vẫn là nơi quản lý và cập nhật theme                                                    |
| Nút thao tác nhỏ trên điện thoại                                      | Nút mượn/trả 44 px, ô tìm kiếm 16 px, tương phản chữ tốt hơn                                                     | Dễ thao tác hơn; cỡ chữ input tránh cơ chế tự zoom thường gặp trên trình duyệt điện thoại       |
| Một stylesheet lớn, có khai báo bị ghi đè                             | Tách CSS thành token, shell, catalogue, reading, pages, responsive, usability; bỏ 65 khai báo không còn tác dụng | Dễ xác định vị trí chỉnh sửa; Vite gom CSS khi build                                            |
| Kiểu test bị đưa chung vào môi trường ứng dụng                        | Tách cấu hình TypeScript production và test                                                                      | `npm run typecheck` kiểm tra cả hai cấu hình; CI chạy typecheck riêng                           |

Các con số trên phản ánh hành vi đã kiểm thử, không phải cam kết về FPS, thời gian đáp ứng hay tải nhiều người dùng. Phân trang giới hạn số thẻ DOM nhưng API vẫn trả toàn bộ danh mục, đúng mô hình API giả lập của đề.

Sau khi tách stylesheet và xóa khai báo bị ghi đè, CSS production còn khoảng 33,7 kB (gzip 7,48 kB). Module phân trang được tải khi cần, tách khỏi lần hiển thị danh mục 12 sách ban đầu. Đây là số liệu build local; kích thước tải thực tế còn phụ thuộc nén và cache của nơi triển khai.

## Đánh giá mức enterprise

Đây là một frontend bài tập có cấu trúc rõ ràng, state tách đúng trách nhiệm, kiểm thử và CI. Để dùng như hệ thống thư viện nhiều sinh viên trong thực tế, cần một giai đoạn khác:

1. **Backend và dữ liệu bền vững:** cơ sở dữ liệu cho sách, bản sách và khoản mượn; tải lại trang không mất khoản mượn.
2. **Danh tính và phân quyền:** đăng nhập, xác định sinh viên và quyền quản trị; ID hiển thị trong ứng dụng hiện tại là dữ liệu giao diện.
3. **Giao dịch mượn/trả phía server:** kiểm tra hạn mức và tồn kho nguyên tử khi nhiều người mượn đồng thời. Middleware Redux thực thi hành vi frontend, không phải ranh giới bảo mật.
4. **API thực tế:** kiểm tra dữ liệu trả về lúc runtime, phân trang phía server, xử lý timeout/hủy yêu cầu và chính sách retry phù hợp.
5. **Vận hành:** giám sát lỗi, kiểm tra hiệu năng trên thiết bị mục tiêu, quản lý phiên bản/deploy và kiểm tra accessibility đầy đủ.

Các mục này vượt phạm vi API giả lập của đề nên không được thêm vào ứng dụng hiện tại. Việc dùng Ant Design, TypeScript hay memoization riêng lẻ không chứng minh một hệ thống đã sẵn sàng cho production nhiều người dùng.

## Quyết định giữ kiến trúc đơn giản

- Chưa dùng virtualization vì mỗi trang chỉ có 12 thẻ; cần đo và cân nhắc lại nếu đổi sang cuộn liên tục với danh sách rất lớn.
- Chưa thêm một thư viện lấy dữ liệu khác vì đề yêu cầu `createAsyncThunk` và API Promise giả lập.
- Chưa đưa khoản mượn vào localStorage để tránh coi dữ liệu client là nguồn dữ liệu chính cho một thư viện thực tế. Phạm vi phiên đã được ghi rõ trong hướng dẫn.

Tài liệu tham chiếu: [Redux selectors](https://redux.js.org/usage/deriving-data-selectors), [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary), [Ant Design Pagination](https://ant.design/components/pagination/).
