import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Calendar from "../components/Calendar";
import { AiOutlineFileSearch } from "react-icons/ai";
import "../styles/Schedule.css";
import ClassDetailCard from "../components/ClassDetailCard";
import { ApiClient } from "../config/api";
import { formatImageUrl } from "../utils/imageUtils";

export default function Schedule() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);

  const api = ApiClient();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);

        // Fetch classes data using the ApiClient
        const classesResponse = await api.get("/api/classes");

        if (classesResponse.status === "success") {
          // Format class data for Calendar component
          const formattedClasses = classesResponse.data.map((classItem) => ({
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
              // Additional fields needed for Calendar
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
          }));

          setClasses(formattedClasses);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching classes data:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu lớp học");
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassSelect = (event) => {
    console.log(event);
    setSelectedClass(event);
  };

  const handleCloseDetail = () => {
    setSelectedClass(null);
  };

  return (
    <div className="schedule-container">
      <Sidebar />
      <Header />
      <div className="schedule-content">
        {loading ? (
          <div className="loading">Đang tải dữ liệu lịch học...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <Calendar
              showUpcoming={false}
              onEventClick={handleClassSelect}
              selectedEventId={selectedClass?.id}
              classData={classes}
            />

            <Calendar
              showSelectDay={false}
              showUpcoming={true}
              onEventClick={handleClassSelect}
              selectedEventId={selectedClass?.id}
              classData={classes}
            />
          </>
        )}
      </div>
      <div className="schedule-details">
        {selectedClass ? (
          <ClassDetailCard
            classData={selectedClass}
            onClose={handleCloseDetail}
          />
        ) : (
          <div className="no-class-selected">
            <p>Hiển thị nội dung chi tiết ở đây</p>
            <AiOutlineFileSearch />
          </div>
        )}
      </div>
    </div>
  );
}
