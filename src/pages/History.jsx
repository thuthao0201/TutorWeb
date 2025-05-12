import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  AiOutlineSearch,
  AiOutlineCalendar,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BiSort, BiFilterAlt } from "react-icons/bi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import "../styles/History.css";

export default function History() {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // Giả lập API call
    setLoading(true);
    setTimeout(() => {
      try {
        const mockData = [
          {
            id: 1,
            studentName: "Nguyễn Phương Nhi",
            studentAvatar:
              "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
            subject: "Toán học",
            level: "Lớp 10",
            date: "2025-04-15T14:00:00",
            duration: 120,
            topics: "Phương trình bậc 2, Hệ phương trình",
            homework: "Bài tập 1-5 trang 45",
            notes:
              "Học sinh đã nắm được cách giải phương trình, cần luyện tập thêm về điều kiện nghiệm",
            payment: {
              status: "completed",
              amount: 200000,
              date: "2025-04-15T18:30:00",
            },
            rating: {
              score: 4.5,
              comment:
                "Giảng dạy rõ ràng, dễ hiểu. Cần thêm bài tập khó hơn một chút.",
            },
          },
          {
            id: 2,
            studentName: "Trần Quốc Bảo",
            studentAvatar:
              "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
            subject: "Vật lý",
            level: "Lớp 8",
            date: "2025-04-10T18:00:00",
            duration: 120,
            topics: "Chuyển động cơ học, Vận tốc",
            homework: "Bài tập 7-10 trang 32",
            notes:
              "Học sinh cần cải thiện phần tính toán, hiểu khái niệm vật lý tốt",
            payment: {
              status: "pending",
              amount: 250000,
              date: null,
            },
            rating: null,
          },
          {
            id: 3,
            studentName: "Lê Minh Ánh",
            studentAvatar:
              "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
            subject: "Tiếng Anh",
            level: "Lớp 3",
            date: "2025-04-08T14:00:00",
            duration: 120,
            topics: "Thì hiện tại đơn, Từ vựng về gia đình",
            homework: "Làm bài tập trên workbook trang 20-21",
            notes: "Học sinh phát âm tốt, cần luyện tập thêm về ngữ pháp",
            payment: {
              status: "completed",
              amount: 150000,
              date: "2025-04-08T17:30:00",
            },
            rating: {
              score: 5,
              comment: "Giáo viên rất tận tình, con tôi đã tiến bộ rõ rệt",
            },
          },
          {
            id: 4,
            studentName: "Phạm Thu Hà",
            studentAvatar:
              "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
            subject: "Hóa học",
            level: "Lớp 12",
            date: "2025-03-30T16:00:00",
            duration: 120,
            topics: "Hóa hữu cơ, Ancol",
            homework: "Ôn tập câu hỏi trắc nghiệm chương 3",
            notes: "Học sinh nắm kiến thức khá tốt, cần luyện đề nhiều hơn",
            payment: {
              status: "cancelled",
              amount: 280000,
              date: null,
            },
            rating: null,
          },
          {
            id: 5,
            studentName: "Nguyễn Phương Nhi",
            studentAvatar:
              "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
            subject: "Toán học",
            level: "Lớp 10",
            date: "2025-03-18T14:00:00",
            duration: 120,
            topics: "Hàm số lượng giác, Đạo hàm",
            homework: "Bài tập 1-5 trang 65",
            notes: "Học sinh cần ôn lại kiến thức về lượng giác",
            payment: {
              status: "completed",
              amount: 200000,
              date: "2025-03-18T17:45:00",
            },
            rating: {
              score: 4,
              comment: "Buổi học khá tốt, nhưng cần nhiều ví dụ hơn",
            },
          },
        ];

        setLessons(mockData);
        setFilteredLessons(mockData);
        setLoading(false);
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        setLoading(false);
      }
    }, 800);
  }, []);

  useEffect(() => {
    let result = [...lessons];

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lesson) =>
          lesson.studentName.toLowerCase().includes(query) ||
          lesson.subject.toLowerCase().includes(query) ||
          lesson.level.toLowerCase().includes(query)
      );
    }

    // Lọc theo trạng thái thanh toán
    if (paymentFilter !== "all") {
      result = result.filter(
        (lesson) => lesson.payment.status === paymentFilter
      );
    }

    // Lọc theo tháng
    if (monthFilter !== "all") {
      const [month, year] = monthFilter.split("-");
      result = result.filter((lesson) => {
        const lessonDate = new Date(lesson.date);
        return (
          lessonDate.getMonth() + 1 === parseInt(month) &&
          lessonDate.getFullYear() === parseInt(year)
        );
      });
    }

    // Sắp xếp
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredLessons(result);
  }, [lessons, searchQuery, paymentFilter, monthFilter, sortOrder]);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return format(new Date(dateString), "EEEE, dd/MM/yyyy", { locale: vi });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "HH:mm", { locale: vi });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "";
    }
  };

  const handleViewDetails = (lesson) => {
    setSelectedLesson(lesson);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setTimeout(() => setSelectedLesson(null), 300);
  };

  // Lấy danh sách các tháng từ dữ liệu buổi học
  const getMonthsOptions = () => {
    const months = new Set();
    lessons.forEach((lesson) => {
      const date = new Date(lesson.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      months.add(monthYear);
    });

    return Array.from(months).sort().reverse();
  };

  return (
    <div className="history-container">
      <Sidebar />
      <Header />

      <div className="history-content">
        <div className="history-header">
          <h1>Lịch sử buổi học</h1>

          <div className="filters-container">
            <div className="search-box">
              <AiOutlineSearch />
              <input
                type="text"
                placeholder="Tìm theo tên học sinh, môn học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <BiFilterAlt />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="all">Tất cả thanh toán</option>
                  <option value="completed">Đã thanh toán</option>
                  <option value="pending">Chờ thanh toán</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="filter-group">
                <AiOutlineCalendar />
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                >
                  <option value="all">Tất cả thời gian</option>
                  {getMonthsOptions().map((monthYear) => {
                    const [month, year] = monthYear.split("-");
                    return (
                      <option key={monthYear} value={monthYear}>
                        Tháng {month}/{year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="filter-group">
                <BiSort />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Mới nhất trước</option>
                  <option value="oldest">Cũ nhất trước</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="history-table-container">
          {loading ? (
            <div className="loading-state">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : filteredLessons.length === 0 ? (
            <div className="empty-state">
              <FaChalkboardTeacher />
              <p>Không tìm thấy buổi học nào</p>
            </div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Học sinh</th>
                  <th>Môn học</th>
                  <th>Ngày</th>
                  <th>Thời gian</th>
                  <th>Thanh toán</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <td className="student-cell">
                      <div className="student-info">
                        <img
                          src={lesson.studentAvatar}
                          alt={lesson.studentName}
                        />
                        <span>{lesson.studentName}</span>
                      </div>
                    </td>
                    <td>
                      {lesson.subject} - {lesson.level}
                    </td>
                    <td>{formatDate(lesson.date)}</td>
                    <td>
                      {formatTime(lesson.date)} - {lesson.duration} phút
                    </td>
                    <td>
                      <span
                        className={`payment-status ${getPaymentStatusClass(
                          lesson.payment.status
                        )}`}
                      >
                        {getPaymentStatusLabel(lesson.payment.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => handleViewDetails(lesson)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {detailsOpen && (
          <div className="lesson-details-overlay" onClick={closeDetails}>
            <div
              className={`lesson-details-modal ${
                detailsOpen ? "open" : "closing"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-details" onClick={closeDetails}>
                ×
              </button>

              <div className="lesson-details-header">
                <div className="student-profile">
                  <img
                    src={selectedLesson.studentAvatar}
                    alt={selectedLesson.studentName}
                  />
                  <div>
                    <h3>{selectedLesson.studentName}</h3>
                    <p>
                      {selectedLesson.subject} - {selectedLesson.level}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lesson-info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <AiOutlineCalendar />
                    <p>Ngày học</p>
                  </div>
                  <div className="info-value">
                    {formatDate(selectedLesson.date)}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <AiOutlineClockCircle />
                    <p>Thời gian</p>
                  </div>
                  <div className="info-value">
                    {formatTime(selectedLesson.date)} -{" "}
                    {(lesson) => {
                      const startTime = new Date(selectedLesson.date);
                      const endTime = new Date(
                        startTime.getTime() + selectedLesson.duration * 60000
                      );
                      return formatTime(endTime);
                    }}
                    ({selectedLesson.duration} phút)
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <RiMoneyDollarCircleLine />
                    <p>Thanh toán</p>
                  </div>
                  <div className="info-value">
                    <div
                      className={`payment-info ${getPaymentStatusClass(
                        selectedLesson.payment.status
                      )}`}
                    >
                      <div className="payment-status-badge">
                        {getPaymentStatusLabel(selectedLesson.payment.status)}
                      </div>
                      <div className="payment-amount">
                        {formatCurrency(selectedLesson.payment.amount)}
                      </div>
                      {selectedLesson.payment.date && (
                        <div className="payment-date">
                          Thanh toán lúc:{" "}
                          {formatTime(selectedLesson.payment.date)}{" "}
                          {formatDate(selectedLesson.payment.date)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lesson-content">
                <div>
                  <h4>Nội dung bài học</h4>
                  <p>{selectedLesson.topics}</p>
                </div>

                <div>
                  <h4>Bài tập về nhà</h4>
                  <p>{selectedLesson.homework}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
