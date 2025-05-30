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
  const [gradeFilter, setGradeFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [timeSlotFilter, setTimeSlotFilter] = useState("all");

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

  const calculateTotalSessions = (startDate, endDate, day) => {
    const daysOfWeek = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const targetDayIndex = daysOfWeek[day];
    const start = new Date(startDate);
    const end = new Date(endDate);

    let count = 0;
    let current = new Date(start);

    // Find the first occurrence of the target day from start date
    while (current.getDay() !== targetDayIndex && current <= end) {
      current.setDate(current.getDate() + 1);
    }

    // Count all occurrences of the target day between start and end
    while (current <= end) {
      count++;
      current.setDate(current.getDate() + 7); // Move to next week
    }

    return count;
  };

  const calculateCompletedSessions = (startDate, day, totalSessions) => {
    const daysOfWeek = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const targetDayIndex = daysOfWeek[day];
    const start = new Date(startDate);
    const now = new Date();

    let count = 0;
    let current = new Date(start);

    // Find the first occurrence of the target day from start date
    while (current.getDay() !== targetDayIndex && current <= now) {
      current.setDate(current.getDate() + 1);
    }

    // Count completed sessions (past occurrences of the target day)
    while (current <= now) {
      count++;
      current.setDate(current.getDate() + 7); // Move to next week
    }

    return Math.min(count, totalSessions);
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

            const totalSessions = calculateTotalSessions(
              classData.startDate,
              classData.endDate,
              classData.day
            );
            const completedSessions = calculateCompletedSessions(
              classData.startDate,
              classData.day,
              totalSessions
            );

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
            console.log("Class Data 2:", classData);

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
                classData.classPrice
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
              joinUrl: classData.joinUrl,
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

    // Search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (session) =>
          session.studentName.toLowerCase().includes(searchLower) ||
          session.subject.toLowerCase().includes(searchLower) ||
          session.level.toLowerCase().includes(searchLower) ||
          session.tutorInfo?.name.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((session) => session.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== "all") {
      result = result.filter((session) => session.subject === subjectFilter);
    }

    // Grade filter
    if (gradeFilter !== "all") {
      result = result.filter((session) => session.level.includes(gradeFilter));
    }

    // Day filter
    if (dayFilter !== "all") {
      result = result.filter((session) =>
        session.daysOfWeek.some((day) =>
          day.toLowerCase().includes(dayFilter.toLowerCase())
        )
      );
    }

    // Time slot filter
    if (timeSlotFilter !== "all") {
      result = result.filter((session) => {
        const [sessionStart] = session.time.split("-");
        const [filterStart] = timeSlotFilter.split("-");
        return sessionStart === filterStart;
      });
    }

    setFilteredSessions(result);
  }, [
    searchText,
    statusFilter,
    subjectFilter,
    gradeFilter,
    dayFilter,
    timeSlotFilter,
    sessions,
  ]);

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

  // Extract unique values for filters
  const subjects = [
    "all",
    ...new Set(sessions.map((session) => session.subject)),
  ];
  const grades = [
    "all",
    ...new Set(sessions.map((session) => session.level.replace("Lớp ", ""))),
  ];
  const days = [
    "all",
    ...new Set(sessions.flatMap((session) => session.daysOfWeek)),
  ];
  const timeSlots = [
    "all",
    ...new Set(sessions.map((session) => session.time)),
  ];

  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setSubjectFilter("all");
    setGradeFilter("all");
    setDayFilter("all");
    setTimeSlotFilter("all");
  };

  const getFilterCount = () => {
    let count = 0;
    if (searchText) count++;
    if (statusFilter !== "all") count++;
    if (subjectFilter !== "all") count++;
    if (gradeFilter !== "all") count++;
    if (dayFilter !== "all") count++;
    if (timeSlotFilter !== "all") count++;
    return count;
  };

  return (
    <div className="sessions-container">
      <Sidebar />
      <Header />

      <div className="sessions-content">
        <div className="sessions-header">
          <div className="sessions-title-section">
            <h1>Danh sách lớp học</h1>
            {/* <div className="filter-summary">
              {getFilterCount() > 0 && (
                <button className="reset-filters-btn" onClick={resetFilters}>
                  Xóa bộ lọc ({getFilterCount()})
                </button>
              )}
            </div> */}
          </div>

          <div className="sessions-filters">
            {/* <div className="filter-row"> */}
            <div className="search-box">
              <AiOutlineSearch />
              <input
                type="text"
                placeholder="Tìm theo tên học sinh, môn học, gia sư..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            {/* </div> */}

            <div className="filter-row">
              <div className="filter-group">
                {/* <label>Trạng thái:</label> */}
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
                {/* <label>Môn học:</label> */}
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

              {/* <div className="filter-group">
                <label>Khối:</label>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                >
                  <option value="all">Tất cả </option>
                  {grades
                    .filter((grade) => grade !== "all")
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map((grade) => (
                      <option key={grade} value={grade}>
                        Lớp {grade}
                      </option>
                    ))}
                </select>
              </div> */}
            </div>

            {/* <div className="filter-row">
              <div className="filter-group">
                <label>Ngày học:</label>
                <select
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {days
                    .filter((day) => day !== "all")
                    .map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Ca học:</label>
                <select
                  value={timeSlotFilter}
                  onChange={(e) => setTimeSlotFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {timeSlots
                    .filter((slot) => slot !== "all")
                    .sort()
                    .map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                </select>
              </div>
            </div> */}
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
                    joinUrl: selectedSession.joinUrl,
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
