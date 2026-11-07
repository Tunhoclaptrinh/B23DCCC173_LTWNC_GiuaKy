# Kiểm thử và rà soát giao diện

## Các lớp kiểm thử

**Jest + React Testing Library:** 39 test trong 10 suite.

| Nhóm                          | Số test | Nội dung                                                                                                                                                                    |
| ----------------------------- | ------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| booksSlice reducer            |      13 | State ban đầu, 3 trạng thái API, lỗi dự phòng, mượn/trả, nhiều bản cùng đầu sách, ID không hợp lệ, hết bản, không sửa state cũ, đồng bộ tồn kho khi nhận danh mục, cảnh báo |
| BookCard + userEvent          |       4 | Hiển thị thông tin, mượn đúng ID, disabled khi hết bản, trả đúng ID                                                                                                         |
| useDebounce + fake timers     |       3 | Mốc 299/300 ms, gõ tiếp khởi động lại thời gian, generic object và cleanup khi unmount                                                                                      |
| Middleware + Redux store thật |       3 | Chặn cuốn thứ tư, đếm nhiều bản cùng đầu sách, mượn lại sau khi trả                                                                                                         |
| API giả lập                   |       3 | Chờ đúng 500 ms, trường hợp lỗi, phản hồi độc lập giữa các lần gọi                                                                                                          |
| Async thunk + API thật        |       3 | Pending → fulfilled, rejected → thử lại, chống request trùng                                                                                                                |
| Selectors có memoization      |       2 | Đếm đầu sách và số bản đúng; tái sử dụng kết quả khi chỉ cập nhật thông báo                                                                                                 |
| Tìm kiếm tiếng Việt           |       5 | Không dấu, chữ Đ/đ, Unicode tổ hợp, hoa/thường và khoảng trắng                                                                                                              |
| Phân trang BookList           |       2 | Chỉ render 12/240 thẻ; chuyển trang, đổi bộ lọc và danh mục nhỏ                                                                                                             |
| ErrorBoundary                 |       1 | Hiển thị phục hồi khi lỗi và reset khi đổi route                                                                                                                            |

**Playwright + Chrome:** 13 test tương tác trên trình duyệt, tách khỏi test jsdom.

1. Tải đủ danh mục, sách hết bản bị khóa, không có lỗi JavaScript hoặc tràn ngang.
2. Tìm theo tác giả không phân biệt hoa thường, kết hợp thể loại, trạng thái rỗng và xóa bộ lọc.
3. Mượn đủ 3 bản cùng đầu sách; cuốn thứ tư bị chặn; trả một cuốn rồi mượn đầu sách khác.
4. Chuyển route thống kê và đang mượn; kiểm tra số đầu sách, tồn kho và số cuốn mượn; trả hết về trạng thái rỗng.
5. Hiển thị lỗi API, trạng thái đang tải và phục hồi qua nút thử lại.
6. Theme tối được giữ sau reload; truy cập trực tiếp `/stats`.
7. Menu, modal hướng dẫn và thống kê trên màn hình điện thoại.
8. Chụp giao diện desktop sáng/tối, đang mượn, thống kê, điện thoại và tablet.
9. Mượn hết bản cuối làm nút Mượn bị khóa; trả một bản làm nút hoạt động lại.
10. Kiểm tra thẻ đang mượn, nút Trả và hiện tượng tràn ngang ở các chiều rộng 320, 375, 600, 768, 1024, 1280, 1440 và 1920 px.
11. Tìm sách bằng tiếng Việt không dấu, viết hoa và khoảng trắng.
12. Dùng bàn phím bỏ qua điều hướng, kiểm tra focus, aria-current và tiêu đề trang.
13. Chủ động chặn module thống kê để kiểm tra màn hình phục hồi và điều hướng về thư viện.

## Lệnh chạy

```bash
npm test
npm run test:coverage
npm run typecheck
npm run build
npm run test:e2e
```

Trên Bash, sau khi build, kiểm tra bản production với `E2E_PREVIEW=1 npm run test:e2e`. Bộ 13 luồng cũng được chạy trên bản build; CI cấu hình thêm ba kiểm tra production cho danh mục, thống kê và phục hồi lỗi module.

Báo cáo coverage nằm trong `coverage/lcov-report/index.html`. Phạm vi coverage được cấu hình cho API, type guard, reducer, middleware, selectors, tìm kiếm, BookCard và useDebounce; không đại diện cho toàn bộ giao diện. Jest chặn khi coverage thấp hơn ngưỡng: 95% statements/lines, 90% functions, 85% branches.

Playwright tự chạy Vite, dùng Chrome có sẵn hoặc Chromium được cài bằng `npx playwright install chromium`. Khi thất bại, ảnh và trace nằm trong `test-results/`; mở trace bằng `npx playwright show-trace <đường-dẫn-trace.zip>`.

## Rà soát giao diện

Ảnh được tạo từ ứng dụng đang chạy, không phải mockup. Kiểm tra bố cục, tương phản sáng/tối, tên sách, tồn kho, thao tác mượn/trả, trạng thái rỗng, menu điện thoại và bảng thống kê. Sau lượt chụp đầu, tăng kích thước nội dung thẻ sách, vùng bấm và đổi tablet sang hai cột để cải thiện khả năng đọc.

| Ảnh                    | Kích thước viewport | Trạng thái                                           |
| ---------------------- | ------------------- | ---------------------------------------------------- |
| `desktop-light.png`    | 1440 × 1000         | Danh mục, theme sáng                                 |
| `desktop-dark.png`     | 1440 × 1000         | Danh mục, theme tối                                  |
| `desktop-borrowed.png` | 1440 × 1000         | Có hai cuốn đang mượn                                |
| `statistics.png`       | 1440 × 1000         | Thống kê phản ánh hai cuốn đang mượn                 |
| `mobile-light.png`     | 390 × 844           | Danh mục hai cột, menu thu gọn                       |
| `tablet-light.png`     | 768 × 1024          | Sidebar và danh mục hai cột                          |
| `page-error.png`       | 1440 × 1000         | Chủ động chặn module thống kê; sidebar vẫn hoạt động |

Ảnh chụp toàn trang nên chiều cao file ảnh có thể lớn hơn chiều cao viewport.

## Kiểm tra thủ công trước khi trình bày

- Mượn sách còn đúng một bản: số bản về 0 và nút Mượn bị vô hiệu hóa.
- Trả sách đang hết bản: số bản tăng lên và nút Mượn hoạt động lại.
- Chuyển giữa các route: bộ lọc và các khoản mượn không bị mất.
- Tìm kiếm có khoảng trắng đầu/cuối hoặc chỉ có khoảng trắng.
- Thử bàn phím, focus, liên kết bỏ qua điều hướng và theme trong menu điện thoại.
- Dùng `/?apiError=1` để trình bày nhánh lỗi và nút thử lại.
