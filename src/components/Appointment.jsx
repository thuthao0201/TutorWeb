import React, { useState } from "react";
import "./../styles/Appointment.css";
import AppointmentDetail from "./AppointmentDetail";
import { formatImageUrl } from "../utils/imageUtils";

export default function Appointment({ bookings, onActionComplete }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  console.log("Bookings:", bookings);

  // Fallback data if no bookings prop is provided
  const dummyData = [
    {
      id: 1,
      studentInfo: {
        name: "Nguyễn Phương Nhi",
        avatar:
          "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
      },
      scheduleDetails: {
        subject: "Toán",
        level: "Lớp 10",
        startDate: "20 tháng 04, 2025",
        endDate: "20 tháng 05, 2025",
        sessions: "Thứ 3, Thứ 4, Thứ 6",
        time: "09:00 - 11:00",
        notes: "Bé học trung bình 4-5đ, mục tiêu 7-8đ.",
      },
    },
    {
      id: 2,
      studentInfo: {
        name: "Lê Minh Ánh",
        avatar:
          "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
      },
      scheduleDetails: {
        subject: "Tiếng Anh",
        level: "Lớp 3",
        startDate: "22 tháng 04, 2025",
        endDate: "22 tháng 06, 2025",
        sessions: "Thứ 3, Thứ 5",
        time: "14:00 - 16:00",
        notes:
          "Con có khả năng đọc tốt, cần rèn luyện thêm kỹ năng nói và viết.",
      },
    },
    {
      id: 3,
      studentInfo: {
        name: "Trần Quốc Bảo",
        avatar:
          "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
      },
      scheduleDetails: {
        subject: "Vật lý",
        level: "Lớp 8",
        startDate: "25 tháng 04, 2025",
        endDate: "25 tháng 06, 2025",
        sessions: "Thứ 3, Thứ 4",
        time: "18:00 - 20:00",
        notes:
          "Con đang học khá, cần hướng dẫn thêm về bài tập và kỹ năng làm bài thi.",
      },
    },
    {
      id: 4,
      studentInfo: {
        name: "Nguyễn Văn Anh",
        avatar:
          "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
      },
      scheduleDetails: {
        subject: "Hóa học",
        level: "Lớp 11",
        startDate: "30 tháng 04, 2025",
        endDate: "30 tháng 05, 2025",
        sessions: "Thứ 3, Thứ 5",
        time: "15:00 - 17:00",
        notes: "Con cần ôn tập lại kiến thức cơ bản và làm bài tập nâng cao.",
      },
    },
    {
      id: 5,
      studentInfo: {
        name: "Nguyễn Thị Bích",
        avatar:
          "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg",
      },
      scheduleDetails: {
        subject: "Sinh học",
        level: "Lớp 12",
        startDate: "05 tháng 05, 2025",
        endDate: "05 tháng 06, 2025",
        sessions: "Thứ 3, Thứ 5",
        time: "10:00 - 12:00",
        notes: "Con cần ôn tập lại kiến thức cơ bản và làm bài tập nâng cao.",
      },
    },
  ];

  const translateDayToVietnamese = (englishDay) => {
    const dayMap = {
      Monday: "Thứ 2",
      Tuesday: "Thứ 3",
      Wednesday: "Thứ 4",
      Thursday: "Thứ 5",
      Friday: "Thứ 6",
      Saturday: "Thứ 7",
      Sunday: "Chủ nhật",
    };
    return dayMap[englishDay] || englishDay;
  };
  // Use the bookings prop if available, otherwise use dummy data
  const appointmentsToDisplay =
    bookings && bookings.length > 0
      ? bookings.map((booking) => ({
          id: booking._id,
          studentInfo: {
            name: booking.studentId.name || "Student",
            avatar: formatImageUrl(booking.studentId.avatar),
          },
          scheduleDetails: {
            subject: booking.subject,
            level: `Lớp ${booking.grade}`,
            startDate: new Date(booking.startDate).toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            endDate: new Date(booking.endDate).toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            sessions: translateDayToVietnamese(booking.day),
            time: booking.timeSlot,
            notes: booking.requirements,
          },
        }))
      : [];

  const handleOpenDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  // Handler to process completion of actions
  const handleActionComplete = (actionType, appointmentId) => {
    // Close the detail modal
    setShowDetail(false);

    // Pass the event up to the parent component
    if (onActionComplete) {
      onActionComplete(actionType, appointmentId);
    }
  };

  return (
    <div className="notification-list">
      {loading ? (
        <p>Đang tải thông tin</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : appointmentsToDisplay.length === 0 ? (
        <div className="empty-message">Không có thông báo nào</div>
      ) : (
        appointmentsToDisplay.map((appointment) => (
          <div key={appointment.id} className="notification-item">
            <div className="notification-content">
              <div className="student-avatar">
                <img
                  src={appointment.studentInfo.avatar}
                  alt={`${appointment.studentInfo.name} Avatar`}
                />
              </div>
              <div className="notification-details">
                <ul>
                  <li>
                    <span>Môn học:</span> {appointment.scheduleDetails.subject}
                  </li>
                  <li>
                    <span>Cấp độ học:</span> {appointment.scheduleDetails.level}
                  </li>
                  <li>
                    <span>Ngày bắt đầu học:</span>{" "}
                    {appointment.scheduleDetails.startDate}
                  </li>
                  <li>
                    <span>Thời gian:</span> {appointment.scheduleDetails.time}
                  </li>
                </ul>
              </div>
            </div>
            <div className="notification-actions">
              <button
                className="action-button detail-button"
                onClick={() => handleOpenDetail(appointment)}
              >
                Xem chi tiết
              </button>

              <button className="action-button decline-button">Từ chối</button>
            </div>
          </div>
        ))
      )}
      {showDetail && (
        <AppointmentDetail
          appointment={selectedAppointment}
          onClose={handleCloseDetail}
          onActionComplete={handleActionComplete}
        />
      )}
    </div>
  );
}
