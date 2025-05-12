import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Calendar from "../components/Calendar";
import Appointment from "../components/Appointment";
import "./../styles/Home.css";
import { ApiClient } from "../config/api";
import { formatImageUrl } from "../utils/imageUtils";

export default function Home() {
  const api = ApiClient();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [tutorData, setTutorData] = React.useState(null);
  const [todayClasses, setTodayClasses] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [pendingBookings, setPendingBookings] = React.useState([]);

  // Function to check if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from all three APIs using the ApiClient
        const tutorResponse = await api.get("/api/tutors/me");
        const classesResponse = await api.get("/api/classes");
        const bookingsResponse = await api.get("/api/posts");

        console.log("tutorResponse", tutorResponse);
        console.log("classesResponse", classesResponse);
        console.log("bookingsResponse", bookingsResponse);

        setTutorData(tutorResponse.data);

        // Process classes for today's classes section
        if (classesResponse.status === "success") {
          // Make sure we're accessing the data array in the response
          const classesData = classesResponse.data;

          // Common function to format a class item
          const formatClassItem = (classItem) => ({
            id: classItem._id,
            studentInfo: {
              name: classItem.studentId?.name || "Student",
              avatar: formatImageUrl(
                classItem.studentId?.avatar || "/uploads/default-avatar.png"
              ),
            },
            day: classItem.day,
            timeSlot: classItem.timeSlot,
            startDate: classItem.startDate,
            endDate: classItem.endDate,
            subject: classItem.subject,
            grade: classItem.grade,
            classPrice: classItem.classPrice,
            scheduleDetails: {
              subject: classItem.subject,
              level: `Lớp ${classItem.grade}`,
              date: new Date(classItem.startDate),
              time: classItem.timeSlot,
              method: "Trực tuyến",
              location: "",
              contactPerson: classItem.studentId?.name || "Student",
              phone: "",
              notes: "",
              // Add additional fields needed for Calendar
              startDate: new Date(classItem.startDate).toLocaleDateString(
                "vi-VN",
                {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                }
              ),
              endDate: new Date(classItem.endDate).toLocaleDateString("vi-VN", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              }),
              sessions: classItem.day, // Pass the day directly for Calendar component
              price: `${classItem.classPrice}`,
            },
          });

          // Format all classes
          const formattedAllClasses = classesData.map(formatClassItem);
          console.log("formattedAllClasses", formattedAllClasses);
          setClasses(formattedAllClasses);

          // Filter for today's classes
          const todayClasses = formattedAllClasses.filter((classItem) =>
            isToday(classItem.scheduleDetails.date)
          );
          console.log("todayClasses", todayClasses);
          setTodayClasses(todayClasses);
        }

        // Process bookings for appointments section
        if (bookingsResponse.status === "success") {
          // Filter for submitted bookings only
          const submittedBookings = bookingsResponse.data.assignedPosts.filter(
            (booking) => booking.status === "waiting_tutor_confirmation"
          );
          console.log("submittedBookings", submittedBookings);

          setPendingBookings(submittedBookings);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use the fetched data or fallback to dummy data if not available
  const displayClasses = todayClasses.length > 0 ? todayClasses : [];

  return (
    <div className="home-container">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="overview">
          <h3>Tổng quan</h3>
          <div className="overview-row">
            <div className="overview-item">
              <h5>Học sinh đã học</h5>
              <p>{tutorData ? tutorData.completedClasses : 203}</p>
            </div>
            <div className="overview-item">
              <h5>Người theo dõi</h5>
              <p>{tutorData ? tutorData.favoriteCount : 163}</p>
            </div>
            <div className="overview-item">
              <h5>Doanh thu</h5>
              <p>
                {tutorData
                  ? `${tutorData.classPrice * tutorData.completedClasses}đ`
                  : "24,000,000đ"}
              </p>
            </div>
          </div>
        </section>
        <div className="include">
          <div className="content">
            <section className="today-classes">
              <h3>Lớp học hôm nay</h3>
              <div className="class-cards">
                {loading ? (
                  <p>Đang tải thông tin</p>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : displayClasses.length === 0 ? (
                  <div className="empty-message">
                    Hôm nay không có lớp học nào
                  </div>
                ) : (
                  displayClasses.map((UserData) => (
                    <div key={UserData.id} className="class-card">
                      <div className="student-info">
                        <img
                          src={UserData.studentInfo.avatar}
                          alt={`${UserData.studentInfo.name} Avatar`}
                        />
                        <h4>{UserData.studentInfo.name}</h4>
                      </div>
                      <ul className="class-details">
                        <li>
                          <span>Môn:</span>{" "}
                          <span className="highlight">
                            {UserData.scheduleDetails.subject}
                          </span>
                        </li>
                        <li>
                          <span>Khối:</span>{" "}
                          <span>{UserData.scheduleDetails.level}</span>
                        </li>
                        <li>
                          <span>
                            Thời gian: {UserData.scheduleDetails.time}{" "}
                          </span>
                        </li>
                      </ul>
                      <button className="view-details">
                        Xem chi tiết <span className="arrow">»</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="notifications">
              <div className="section-header">
                <h3>Thông báo đặt lịch</h3>
                <a href="/appointmentnoti" className="view-all">
                  Xem thêm <span className="arrow-right">»</span>
                </a>
              </div>
              <Appointment bookings={pendingBookings} />
            </section>
          </div>
          <div className="calendar-section">
            <Calendar
              showSelectDay={true}
              showUpcoming={true}
              classData={classes} // Pass all classes data to the Calendar component
            />
          </div>
        </div>
      </main>
    </div>
  );
}
