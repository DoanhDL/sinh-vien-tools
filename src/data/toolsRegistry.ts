export type ToolCategory =
  | "hoc-tap"
  | "tinh-toan"
  | "nang-suat"
  | "tai-chinh"
  | "suc-khoe"
  | "giai-tri";

export interface ToolMeta {
  id: string;
  icon: string;
  title: string;
  desc: string;
  path: string;
  category: ToolCategory;
  isNew?: boolean;
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  "hoc-tap": "📚 Học tập",
  "tinh-toan": "🔢 Tính toán",
  "nang-suat": "⚡ Năng suất",
  "tai-chinh": "💰 Tài chính",
  "suc-khoe": "💪 Sức khỏe",
  "giai-tri": "🎮 Giải trí",
};

export const CORE_TOOLS: ToolMeta[] = [
  { id: "gpa", icon: "📊", title: "Tính GPA", desc: "Tính GPA hệ 4 và hệ 10", path: "/gpa", category: "tinh-toan" },
  { id: "grade-converter", icon: "🔄", title: "Quy đổi điểm chữ", desc: "A, B+, B, C+, C...", path: "/grade-converter", category: "tinh-toan" },
  { id: "cumulative-gpa", icon: "📈", title: "GPA Tích Lũy", desc: "Tính GPA nhiều học kỳ", path: "/cumulative-gpa", category: "tinh-toan" },
  { id: "graduation", icon: "🎓", title: "Tính điểm tốt nghiệp", desc: "Ước tính xếp loại tốt nghiệp", path: "/graduation-calculator", category: "tinh-toan" },
  { id: "credit", icon: "📚", title: "Tính tín chỉ", desc: "Kiểm tra số tín chỉ còn thiếu", path: "/credit-calculator", category: "tinh-toan" },
  { id: "toeic", icon: "🎯", title: "Luyện thi TOEIC", desc: "14 đề 2020–2026, 300+ từ vựng, audio", path: "/toeic", category: "hoc-tap" },
];

export const NEW_TOOLS: ToolMeta[] = [
  { id: "pomodoro", icon: "🍅", title: "Pomodoro Timer", desc: "Tập trung học với kỹ thuật Pomodoro", path: "/tools/pomodoro", category: "nang-suat" },
  { id: "study-schedule", icon: "📅", title: "Lịch học tuần", desc: "Lập thời khóa biểu cá nhân", path: "/tools/study-schedule", category: "nang-suat" },
  { id: "deadline-tracker", icon: "⏰", title: "Theo dõi deadline", desc: "Quản lý bài tập và deadline", path: "/tools/deadline-tracker", category: "nang-suat" },
  { id: "exam-countdown", icon: "🗓️", title: "Đếm ngược kỳ thi", desc: "Đếm ngược đến ngày thi", path: "/tools/exam-countdown", category: "nang-suat" },
  { id: "word-counter", icon: "📝", title: "Đếm từ văn bản", desc: "Đếm từ, ký tự cho bài luận", path: "/tools/word-counter", category: "hoc-tap" },
  { id: "reading-time", icon: "📖", title: "Thời gian đọc", desc: "Ước tính thời gian đọc tài liệu", path: "/tools/reading-time", category: "hoc-tap" },
  { id: "flashcard-maker", icon: "🃏", title: "Tạo flashcard", desc: "Tạo và ôn flashcard tùy chỉnh", path: "/tools/flashcard-maker", category: "hoc-tap" },
  { id: "markdown-preview", icon: "📄", title: "Xem Markdown", desc: "Soạn thảo và xem trước Markdown", path: "/tools/markdown-preview", category: "hoc-tap" },
  { id: "percentage", icon: "％", title: "Tính phần trăm", desc: "Tính % điểm, tỷ lệ hoàn thành", path: "/tools/percentage", category: "tinh-toan" },
  { id: "unit-converter", icon: "📐", title: "Chuyển đổi đơn vị", desc: "km, mile, kg, lb, °C, °F...", path: "/tools/unit-converter", category: "tinh-toan" },
  { id: "currency", icon: "💱", title: "Chuyển đổi tiền tệ", desc: "VND, USD, EUR, JPY...", path: "/tools/currency", category: "tai-chinh" },
  { id: "bmi", icon: "⚖️", title: "Tính BMI", desc: "Chỉ số khối cơ thể", path: "/tools/bmi", category: "suc-khoe" },
  { id: "attendance", icon: "✅", title: "Tính điểm danh", desc: "Tính số buổi được phép vắng", path: "/tools/attendance", category: "hoc-tap" },
  { id: "semester-cost", icon: "💸", title: "Chi phí học kỳ", desc: "Ước tính chi phí học tập", path: "/tools/semester-cost", category: "tai-chinh" },
  { id: "gpa-target", icon: "🎯", title: "GPA mục tiêu", desc: "Tính GPA cần đạt kỳ tới", path: "/tools/gpa-target", category: "tinh-toan" },
  { id: "group-generator", icon: "👥", title: "Tạo nhóm ngẫu nhiên", desc: "Chia nhóm cho bài tập nhóm", path: "/tools/group-generator", category: "hoc-tap" },
  { id: "citation", icon: "📚", title: "Trích dẫn APA", desc: "Tạo trích dẫn APA cơ bản", path: "/tools/citation", category: "hoc-tap" },
  { id: "scholarship", icon: "🏆", title: "Học bổng ước tính", desc: "Kiểm tra điều kiện học bổng", path: "/tools/scholarship", category: "tai-chinh" },
  { id: "calculator", icon: "🔢", title: "Máy tính", desc: "Máy tính khoa học cơ bản", path: "/tools/calculator", category: "tinh-toan" },
  { id: "quick-notes", icon: "📋", title: "Ghi chú nhanh", desc: "Ghi chú tự động lưu local", path: "/tools/quick-notes", category: "nang-suat" },
];

export const EXTRA_TOOLS: ToolMeta[] = [
  { id: "password-generator", icon: "🔐", title: "Tạo mật khẩu", desc: "Sinh mật khẩu mạnh ngẫu nhiên", path: "/tools/password-generator", category: "nang-suat", isNew: true },
  { id: "stopwatch", icon: "⏱️", title: "Bấm giờ", desc: "Đồng hồ bấm giờ và đếm ngược", path: "/tools/stopwatch", category: "nang-suat", isNew: true },
  { id: "random-picker", icon: "🎲", title: "Bốc thăm ngẫu nhiên", desc: "Chọn người trình bày, số may mắn", path: "/tools/random-picker", category: "hoc-tap", isNew: true },
  { id: "loan-calculator", icon: "🏦", title: "Tính lãi vay", desc: "Tính trả góp hàng tháng", path: "/tools/loan-calculator", category: "tai-chinh", isNew: true },
  { id: "split-bill", icon: "🧾", title: "Chia hóa đơn", desc: "Chia tiền ăn uống công bằng", path: "/tools/split-bill", category: "tai-chinh", isNew: true },
  { id: "age-calculator", icon: "🎂", title: "Tính tuổi", desc: "Tính tuổi chính xác đến ngày", path: "/tools/age-calculator", category: "tinh-toan", isNew: true },
  { id: "study-streak", icon: "🔥", title: "Chuỗi ngày học", desc: "Theo dõi streak học mỗi ngày", path: "/tools/study-streak", category: "nang-suat", isNew: true },
  { id: "habit-tracker", icon: "✨", title: "Theo dõi thói quen", desc: "Check-in thói quen hàng ngày", path: "/tools/habit-tracker", category: "suc-khoe", isNew: true },
  { id: "decision-wheel", icon: "🎡", title: "Vòng quay quyết định", desc: "Không biết chọn gì? Quay thử!", path: "/tools/decision-wheel", category: "giai-tri", isNew: true },
  { id: "roman-numeral", icon: "🏛️", title: "Số La Mã", desc: "Chuyển đổi số và số La Mã", path: "/tools/roman-numeral", category: "hoc-tap", isNew: true },
  { id: "tip-calculator", icon: "🍽️", title: "Tính tiền tip", desc: "Tính tip và chia bill nhà hàng", path: "/tools/tip-calculator", category: "tai-chinh", isNew: true },
  { id: "water-reminder", icon: "💧", title: "Uống nước", desc: "Theo dõi lượng nước uống hôm nay", path: "/tools/water-reminder", category: "suc-khoe", isNew: true },
  { id: "name-generator", icon: "✏️", title: "Đặt tên dự án", desc: "Sinh tên ngẫu nhiên cho đồ án", path: "/tools/name-generator", category: "hoc-tap", isNew: true },
  { id: "base-converter", icon: "🔣", title: "Chuyển hệ số", desc: "Nhị phân, thập phân, thập lục phân", path: "/tools/base-converter", category: "hoc-tap", isNew: true },
  { id: "sleep-calculator", icon: "😴", title: "Tính giờ ngủ", desc: "Tính giờ thức dậy tối ưu", path: "/tools/sleep-calculator", category: "suc-khoe", isNew: true },
];

export const GAME_TOOLS: ToolMeta[] = [
  { id: "game-memory", icon: "🧠", title: "Trò nhớ hình", desc: "Lật thẻ tìm cặp giống nhau", path: "/tools/game-memory", category: "giai-tri", isNew: true },
  { id: "game-snake", icon: "🐍", title: "Rắn săn mồi", desc: "Game Snake cổ điển", path: "/tools/game-snake", category: "giai-tri", isNew: true },
  { id: "game-2048", icon: "🔢", title: "2048", desc: "Ghép số đạt 2048", path: "/tools/game-2048", category: "giai-tri", isNew: true },
  { id: "game-tictactoe", icon: "❌", title: "Cờ caro 3x3", desc: "Đánh caro với máy", path: "/tools/game-tictactoe", category: "giai-tri", isNew: true },
  { id: "game-rps", icon: "✊", title: "Oẳn tù tì", desc: "Kéo búa bao với máy", path: "/tools/game-rps", category: "giai-tri", isNew: true },
  { id: "game-guess", icon: "🔮", title: "Đoán số", desc: "Máy nghĩ số 1–100, bạn đoán", path: "/tools/game-guess", category: "giai-tri", isNew: true },
  { id: "game-scramble", icon: "🔤", title: "Xếp chữ", desc: "Sắp xếp chữ cái thành từ", path: "/tools/game-scramble", category: "giai-tri", isNew: true },
  { id: "game-typing", icon: "⌨️", title: "Test gõ phím", desc: "Kiểm tra tốc độ gõ phím", path: "/tools/game-typing", category: "giai-tri", isNew: true },
  { id: "game-reaction", icon: "⚡", title: "Phản xạ nhanh", desc: "Bấm khi đổi màu xanh", path: "/tools/game-reaction", category: "giai-tri", isNew: true },
  { id: "game-lucky", icon: "🪙", title: "Xúc xắc & Tung đồng", desc: "Tung xúc xắc, đồng xu may mắn", path: "/tools/game-lucky", category: "giai-tri", isNew: true },
  { id: "game-minesweeper", icon: "💣", title: "Dò mìn", desc: "Minesweeper 8×8 cổ điển", path: "/tools/game-minesweeper", category: "giai-tri", isNew: true },
  { id: "game-sudoku", icon: "🧩", title: "Sudoku 4×4", desc: "Sudoku mini cho giải trí", path: "/tools/game-sudoku", category: "giai-tri", isNew: true },
  { id: "game-simon", icon: "🎨", title: "Simon Says", desc: "Nhớ thứ tự màu sắc", path: "/tools/game-simon", category: "giai-tri", isNew: true },
  { id: "game-whack", icon: "🔨", title: "Đập chuột", desc: "Whack-a-mole 30 giây", path: "/tools/game-whack", category: "giai-tri", isNew: true },
  { id: "game-trivia", icon: "❓", title: "Câu đố kiến thức", desc: "Quiz vui kiến thức phổ thông", path: "/tools/game-trivia", category: "giai-tri", isNew: true },
  { id: "game-bubble", icon: "🫧", title: "Bong bóng pop", desc: "Pop bong bóng giải stress", path: "/tools/game-bubble", category: "giai-tri", isNew: true },
];

export const ALL_TOOLS = [...CORE_TOOLS, ...NEW_TOOLS, ...EXTRA_TOOLS, ...GAME_TOOLS];

export function getToolById(id: string): ToolMeta | undefined {
  return ALL_TOOLS.find((t) => t.id === id);
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return ALL_TOOLS.filter((t) => t.category === category);
}
