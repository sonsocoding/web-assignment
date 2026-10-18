/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------

const boDem = document.getElementById("bo-dem");
const oTimKiem = document.getElementById("o-tim-kiem");
const dsList = document.getElementById("list");
const khongThay = document.getElementById("khong-thay");
const oTieuDe = document.getElementById("tin-tieu-de");
const oNoiDung = document.getElementById("tin-noi-dung");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

// F1 + F2 + F3. Hàm lọc tin, thông báo không tìm thấy và cập nhật bộ đếm
function locTin() {
	const rawTuKhoa = oTimKiem.value;
	const tuKhoa = rawTuKhoa.toLowerCase();
	const cacMuc = Array.from(dsList.querySelectorAll("li"));

	let soHien = 0;
	for (const muc of cacMuc) {
		const h3Text = muc.querySelector("h3") ? muc.querySelector("h3").textContent : "";
		const pText = muc.querySelector("p") ? muc.querySelector("p").textContent : "";
		const vanBan = (h3Text + " " + pText).toLowerCase();

		if (tuKhoa === "" || vanBan.includes(tuKhoa)) {
			muc.classList.remove("an");
			soHien++;
		} else {
			muc.classList.add("an");
		}
	}

	// F1. Cập nhật bộ đếm
	boDem.textContent = `Đang hiển thị ${soHien}/${cacMuc.length} tin`;

	// F3. Thông báo không tìm thấy
	if (cacMuc.length > 0 && soHien === 0 && rawTuKhoa !== "") {
		khongThay.classList.remove("an");
		khongThay.textContent = `Không tìm thấy tin nào cho "${rawTuKhoa}"`;
	} else {
		khongThay.classList.add("an");
	}
}

// Sự kiện lọc tin khi gõ phím
oTimKiem.addEventListener("keyup", locTin);

// F4. Nút "Read more >>" / "Thu gọn <<" — MỘT trình lắng nghe đặt trên #list
dsList.addEventListener("click", (e) => {
	if (e.target.matches("button.more")) {
		const nut = e.target;
		const muc = nut.closest("li");
		if (!muc) return;
		const doan = muc.querySelector("p");
		if (!doan) return;

		if (doan.classList.contains("day-du")) {
			doan.classList.remove("day-du");
			nut.textContent = "Read more >>";
		} else {
			doan.classList.add("day-du");
			nut.textContent = "Thu gọn <<";
		}
	}
});

// F5. Nút #nut-dang: kiểm tra dữ liệu, tạo <li> mới, chèn vào đầu #list
nutDang.addEventListener("click", () => {
	const tieuDe = oTieuDe.value;
	const noiDung = oNoiDung.value;

	if (tieuDe.trim() === "" || noiDung.trim() === "") {
		baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
		return;
	}

	const li = document.createElement("li");

	const span = document.createElement("span");
	span.className = "time";
	span.textContent = homNay();

	const h3 = document.createElement("h3");
	h3.textContent = tieuDe;

	const p = document.createElement("p");
	p.textContent = noiDung;

	const nutMore = document.createElement("button");
	nutMore.type = "button";
	nutMore.className = "more";
	nutMore.textContent = "Read more >>";

	li.append(span, h3, p, nutMore);
	dsList.prepend(li);

	// Xóa trắng input và xóa báo lỗi
	oTieuDe.value = "";
	oNoiDung.value = "";
	baoLoi.textContent = "";

	// Cập nhật lại bộ lọc và bộ đếm
	locTin();
});

// Khởi tạo trạng thái ban đầu khi tải trang
locTin();
