# ASM6 — Quản lý người dùng bằng React

Chạy `python3 -m http.server 8000` từ thư mục gốc của project rồi mở `http://localhost:8000/asm6/`. Khi thay đổi được push lên nhánh GitHub Pages đang phục vụ, mở `https://sonsocoding.duckdns.org/asm6/`. React, ReactDOM và Babel tải từ CDN. Danh sách ban đầu đến từ JSONPlaceholder. Các thao tác thêm, sửa và xóa cập nhật state trong phiên hiện tại và dữ liệu mẫu được tải lại khi mở lại trang.

## Prompt cho ChatGPT Work tạo báo cáo Word

Mở một cuộc trò chuyện trong ChatGPT Work, đính kèm `Ex. React-CRUD - 20261.pdf` và `asm6/app.jsx`, rồi dán toàn bộ prompt dưới đây. Có thể đính kèm thêm ảnh chụp giao diện nếu muốn đưa vào báo cáo. Nếu Work không nhận tệp `.jsx`, hãy đính kèm bản sao của tệp dưới dạng `asm6-app.txt`.

```text
Bạn hãy đọc đề bài PDF và mã React tôi đính kèm, rồi tạo và trả về file Word có thể tải xuống tên Bao-cao-ASM6.docx. Tiêu đề báo cáo là “Báo cáo ASM6 — Quản lý người dùng bằng React”. Viết bằng tiếng Việt, xưng “em” khi trình bày quá trình thực hiện bài tập. Người đọc là giảng viên chấm bài. Nếu cần thông tin cá nhân, để chỗ trống cho họ tên, MSSV và lớp. Nếu thiếu mã nguồn hoặc đề bài, hãy nêu rõ tệp cần tôi gửi thêm.

Dùng PDF để xác định yêu cầu và mã JSX để mô tả ứng dụng đã triển khai. Mở đầu bằng một đoạn ngắn về mục tiêu của bài tập. Nêu React 18, useState, useEffect và JSONPlaceholder, cùng bốn thao tác CRUD và tìm kiếm. Giải thích rằng các thao tác sửa đổi danh sách diễn ra trong state của phiên hiện tại. Dữ liệu mẫu được tải lại khi mở lại trang.

1. Sơ đồ cây component

Vẽ sơ đồ cây với App ở gốc và ba nhánh SearchForm, AddUser, ResultTable. Vẽ UserForm ở hai vị trí: dưới AddUser khi mở form thêm và dưới ResultTable khi mở form sửa. Chú thích rằng cả hai vị trí tái sử dụng cùng một định nghĩa UserForm. Bên dưới sơ đồ, mô tả ngắn vai trò của từng component. Chỉ đưa React component vào sơ đồ, các thẻ HTML như main, table và dialog có thể được nhắc đến trong mô tả giao diện.

2. Sơ đồ luồng dữ liệu và giải thích State Lifting

Vẽ hai luồng có mũi tên và ghi tên callback hoặc prop trên từng mũi tên.

- Tìm kiếm: người dùng nhập → SearchForm gọi onChangeValue với chuỗi nhập → App cập nhật kw qua setKeyword → ResultTable nhận keyword → lọc theo name hoặc username. Nêu rằng bảng bỏ khoảng trắng ở hai đầu từ khóa và so sánh không phân biệt hoa thường.
- Thêm: UserForm quản lý bản nháp và gửi dữ liệu đã kiểm tra qua onSave → AddUser gọi onAdd → App cập nhật newUser qua setNewUser → ResultTable nhận prop user → useEffect thêm bản ghi vào users → ResultTable gọi onAdded → App đặt lại newUser thành null.

Giải thích riêng cho từng state vì sao nó thuộc App: SearchForm phát sinh từ khóa còn ResultTable cần đọc từ khóa để lọc. AddUser phát sinh dữ liệu đã gửi còn ResultTable cần dữ liệu đó để cập nhật danh sách. App là cha chung, giữ giá trị cần chia sẻ và truyền dữ liệu xuống qua props. Component con gửi sự kiện lên bằng cách gọi callback được truyền xuống. Phân biệt newUser ở App với bản nháp nhập liệu ở UserForm, và phân biệt cả hai với danh sách users ở ResultTable. Nêu rõ lúc sửa, ResultTable lưu bản sao người dùng đang chỉnh sửa, gồm bản sao address, rồi cập nhật danh sách theo ID khi lưu.

3. Bảng props được truyền trực tiếp từ App

Tạo bảng với các cột “Component nhận”, “Prop”, “Kiểu dữ liệu hoặc chữ ký”, “Giá trị truyền từ App”, “Mục đích hoặc thời điểm sử dụng”. Bảng cần đủ năm dòng dưới đây, đối chiếu lại tên trong mã:

- SearchForm nhận onChangeValue, hàm (value: string) => void, giá trị setKeyword.
- AddUser nhận onAdd, hàm (user: UserDraft) => void, giá trị setNewUser.
- ResultTable nhận keyword, chuỗi, giá trị kw.
- ResultTable nhận user, UserDraft hoặc null, giá trị newUser.
- ResultTable nhận onAdded, hàm () => void, giá trị clearNewUser. Hàm đặt newUser về null sau khi bảng tiếp nhận bản ghi mới.

Chú thích UserDraft là tên mô tả kiểu dữ liệu trong báo cáo. Mã nguồn là JavaScript và không khai báo kiểu này. Có thể trình bày thêm props của UserForm trong phần mô tả component nếu cần, nhưng bảng trên chỉ liệt kê props truyền trực tiếp từ App.

4. Lỗi gặp trong quá trình triển khai và cách sửa

Dùng ca lỗi logic đã được tái hiện khi kiểm tra công thức cấp ID trong mã minh họa của đề. Trình bày theo thứ tự bước tái hiện, kết quả mong đợi, kết quả quan sát, nguyên nhân, ảnh hưởng, cách sửa và kết quả kiểm tra lại.

- Bắt đầu với các ID 1, 2, 3. Xóa người dùng ID 2, còn [1, 3]. Thêm một người dùng theo công thức prev.length + 1 thì ID mới là 3. Kết quả là [1, 3, 3]. Kiểm tra số ID riêng biệt mong đợi 3 nhưng nhận 2.
- Giải thích vì sao độ dài mảng sau khi xóa có thể không phản ánh ID lớn nhất. Liên hệ ID trùng với key của hàng trong React và thao tác sửa hoặc xóa dựa trên ID. Trình bày đây là hậu quả có thể xảy ra, không ghi như thể đã quan sát cảnh báo React trong console.
- Trích đoạn mã ngắn dùng crypto.randomUUID() cho bản ghi mới. Bản ghi mẫu giữ ID số từ API. Với UUID, bảng hiển thị 8 ký tự đầu và thao tác dùng ID đầy đủ. Kiểm tra lại trên cùng danh sách [1, 3] cho thấy sau khi thêm có 3 ID riêng biệt. JSX đã biên dịch và kiểm tra logic thêm, tìm, sửa, xóa đã đạt. Không khẳng định đã kiểm thử giao diện trên trình duyệt hoặc đã chụp màn hình nếu không có bằng chứng.

Trình bày theo thứ tự bốn phần trên, đánh số hình, dùng chú thích cho từng sơ đồ và đặt tên cho bảng. Chèn sơ đồ ngay trong Word dưới dạng hình đọc được khi mở tệp, với mũi tên và nhãn rõ. Dùng định dạng tiêu đề Word, bố cục A4 và phông chữ hỗ trợ tiếng Việt. Nếu tôi cung cấp ảnh chụp giao diện, có thể dùng ảnh thật để minh họa. Không tạo ảnh giả hoặc thêm dữ liệu kiểm thử chưa được cung cấp.

Trước khi trả file, mở hoặc render DOCX để kiểm tra sơ đồ, bảng props, dấu tiếng Việt và ngắt trang. Sau đó gửi liên kết tải Bao-cao-ASM6.docx trực tiếp trong cuộc trò chuyện.
```
