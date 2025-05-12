import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ClassDetailCard from "../components/ClassDetailCard";
import { AiOutlineSearch } from "react-icons/ai";
import { BsCalendarEvent } from "react-icons/bs";
import { RiMenuSearchLine } from "react-icons/ri";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import "../styles/Sessions.css";
import { ApiClient } from "../config/api";

const STATUS_TYPES = {
  ACTIVE: "active",
  COMPLETED: "completed",
  UPCOMING: "upcoming",
};

export default function Sessions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const api = ApiClient();

  const mapDayToVietnamese = (day) => {
    const dayMap = {
      Monday: "Thứ 2",
      Tuesday: "Thứ 3",
      Wednesday: "Thứ 4",
      Thursday: "Thứ 5",
      Friday: "Thứ 6",
      Saturday: "Thứ 7",
      Sunday: "Chủ nhật",
    };
    return dayMap[day] || day;
  };

  const predictNextSession = (day, timeSlot, startDate) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const targetDayIndex = daysOfWeek.indexOf(day);

    const today = new Date();
    const start = new Date(startDate);

    if (start > today) {
      return start;
    }

    let nextDate = new Date(today);
    const currentDayIndex = today.getDay();

    let daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;
    if (daysToAdd === 0) {
      const [startTime] = timeSlot.split("-");
      const [hours] = startTime.split(":").map(Number);
      const currentHour = today.getHours();

      if (currentHour >= hours) {
        daysToAdd = 7;
      }
    }

    nextDate.setDate(today.getDate() + daysToAdd);

    const [startTime] = timeSlot.split("-");
    const [hours, minutes] = startTime.split(":").map(Number);
    nextDate.setHours(hours, minutes || 0, 0, 0);

    return nextDate;
  };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/classes");

        if (response && response.status === "success" && response.data) {
          const transformedData = response.data.map((classData) => {
            const startDate = new Date(classData.startDate);
            const endDate = new Date(classData.endDate);
            const now = new Date();

            const totalWeeks = Math.ceil(
              (endDate - startDate) / (7 * 24 * 60 * 60 * 1000)
            );
            const passedWeeks = Math.max(
              0,
              Math.ceil((now - startDate) / (7 * 24 * 60 * 60 * 1000))
            );

            const totalSessions = totalWeeks;
            const completedSessions = Math.min(passedWeeks, totalWeeks);

            const nextSession =
              classData.status === STATUS_TYPES.COMPLETED
                ? null
                : predictNextSession(
                    classData.day,
                    classData.timeSlot,
                    classData.startDate
                  );

            let status = classData.status;
            if (status === "active") {
              if (startDate > now) {
                status = STATUS_TYPES.UPCOMING;
              } else if (endDate < now) {
                status = STATUS_TYPES.COMPLETED;
              }
            }

            return {
              id: classData._id,
              subject: classData.subject,
              level: `Lớp ${classData.grade}`,
              studentName: classData.studentId.name,
              studentAvatar: `http://localhost:3000${classData.studentId.avatar}`,
              daysOfWeek: [mapDayToVietnamese(classData.day)],
              startDate: classData.startDate,
              endDate: classData.endDate,
              time: classData.timeSlot,
              status: status,
              totalSessions: totalSessions,
              completedSessions: completedSessions,
              nextSession: nextSession ? nextSession.toISOString() : null,
              price: `${Math.round(
                classData.classPrice / totalSessions
              ).toLocaleString()}đ/buổi`,
              duration: `${classData.duration} phút`,
              notes: "Học sinh cần ôn tập định kỳ và làm bài tập",
              tutorInfo: {
                name: classData.tutorId.userId.name,
                avatar: `http://localhost:3000${classData.tutorId.userId.avatar}`,
                phone: classData.tutorId.userId.phone,
                email: classData.tutorId.userId.email,
                experience: classData.tutorId.experiences,
                introduce: classData.tutorId.introduce,
                specialized: classData.tutorId.specialized,
                degree: classData.tutorId.degree,
              },
            };
          });

          setSessions(transformedData);
          setFilteredSessions(transformedData);
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Không thể lấy dữ liệu lớp học");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    let result = sessions;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (session) =>
          session.studentName.toLowerCase().includes(searchLower) ||
          session.subject.toLowerCase().includes(searchLower) ||
          session.level.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((session) => session.status === statusFilter);
    }

    if (subjectFilter !== "all") {
      result = result.filter((session) => session.subject === subjectFilter);
    }

    setFilteredSessions(result);
  }, [searchText, statusFilter, subjectFilter, sessions]);

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleCloseDetail = () => {
    setSelectedSession(null);
  };

  const handleJoinClass = async (sessionId) => {
    console.log(`Joining class session: ${sessionId}`);
    try {
      // const response = await api.post(`/classes/${sessionId}/join`);
      // if (response && response.status === "success") {
      //   // Handle successful join
      // }
    } catch (error) {
      console.error("Error joining class:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "HH:mm - EEEE, dd/MM/yyyy", { locale: vi });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case STATUS_TYPES.ACTIVE:
        return "Đang diễn ra";
      case STATUS_TYPES.COMPLETED:
        return "Đã kết thúc";
      case STATUS_TYPES.UPCOMING:
        return "Sắp diễn ra";
      default:
        return "Không xác định";
    }
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const subjects = [
    "all",
    ...new Set(sessions.map((session) => session.subject)),
  ];

  return (
    <div className="sessions-container">
      <Sidebar />
      <Header />

      <div className="sessions-content">
        <div className="sessions-header">
          <h1>Danh sách lớp học</h1>
          <div className="sessions-filters">
            <div className="search-box">
              <AiOutlineSearch />
              <input
                type="text"
                placeholder="Tìm theo tên học sinh, môn học..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value={STATUS_TYPES.ACTIVE}>Đang diễn ra</option>
                <option value={STATUS_TYPES.UPCOMING}>Sắp diễn ra</option>
                <option value={STATUS_TYPES.COMPLETED}>Đã kết thúc</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="all">Tất cả môn học</option>
                {subjects
                  .filter((subject) => subject !== "all")
                  .map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="sessions-list-container">
          <div className="sessions-list">
            {loading ? (
              <div className="loading-state">Đang tải danh sách lớp học...</div>
            ) : error ? (
              <div className="error-state">
                Đã xảy ra lỗi: {error}. Vui lòng thử lại sau.
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy lớp học nào phù hợp với bộ lọc</p>
              </div>
            ) : (
              <div className="session-cards">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`session-card ${
                      selectedSession?.id === session.id ? "selected" : ""
                    }`}
                    onClick={() => handleSessionSelect(session)}
                  >
                    <div className="student-info">
                      <img
                        src={session.studentAvatar}
                        alt={session.studentName}
                      />
                      <div>
                        <h3>{session.studentName}</h3>
                        <p>
                          {session.subject} - {session.level}
                        </p>
                      </div>
                    </div>
                    <div className="session-details">
                      <div className="session-schedule">
                        <BsCalendarEvent />
                        <span>
                          {session.daysOfWeek.join(", ")} • {session.time}
                        </span>
                      </div>
                      <div className="session-duration">
                        <span>
                          {formatDate(session.startDate)} -{" "}
                          {formatDate(session.endDate)}
                        </span>
                      </div>
                      <div className="session-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${getProgressPercentage(
                                session.completedSessions,
                                session.totalSessions
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {session.completedSessions}/{session.totalSessions}{" "}
                          buổi
                        </span>
                      </div>
                      <div className="session-status">
                        <span className={`status-badge ${session.status}`}>
                          {getStatusLabel(session.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="session-detail-panel">
            {selectedSession ? (
              <div className="session-detail">
                <ClassDetailCard
                  classData={{
                    id: selectedSession.id,
                    studentName: selectedSession.studentName,
                    studentAvatar: selectedSession.studentAvatar,
                    subject: `${selectedSession.subject} - ${selectedSession.level}`,
                    date: selectedSession.nextSession,
                    time: selectedSession.time,
                    price: selectedSession.price,
                    notes: selectedSession.notes,
                    onJoinClass: () => handleJoinClass(selectedSession.id),
                  }}
                  onClose={handleCloseDetail}
                />
              </div>
            ) : (
              <div className="no-session-selected">
                <p>Hiển thị chi tiết lớp học ở đây</p>
                <RiMenuSearchLine />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
