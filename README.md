# Home Kingdom Data Analyzer

Phân tích dữ liệu người chơi trong game Home Kingdom với các tính năng lọc và thống kê nâng cao.

## Tính năng

- Lọc người chơi có Power ≥ 30M
- Phân loại người chơi: Tank (V/D < 1.3) và DPS (V/D ≥ 1.3)
- Sắp xếp theo Kingdom → Tên → ID
- Tìm kiếm theo tên người chơi
- Lọc theo Kingdom và loại người chơi
- Thống kê tổng hợp: Kills, Dead, Healed, Win Rate
- Chuyển đổi các cột hiển thị
- Xuất dữ liệu đã lọc dưới dạng CSV
- Giao diện tối, tối ưu cho full màn hình

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt
2. Click "Chọn file CSV để phân tích"
3. Chọn file dữ liệu Home Kingdom (định dạng CSV)
4. Sử dụng các bộ lọc và tính năng phân tích

## Demo

Truy cập: https://[your-username].github.io/[repository-name]/

## Yêu cầu dữ liệu

File CSV cần có các cột sau:
- Home Server (Kingdom)
- Name, Lord Id
- Power, Highest Power
- Killcount T1-T5
- Units Dead, Units Healed
- Victories, Defeats

## Công nghệ

- HTML5/CSS3
- JavaScript (vanilla)
- Responsive design
- Dark theme

## Cài đặt

Không cần cài đặt - chỉ cần mở file `index.html` trong trình duyệt web.

## License

MIT License