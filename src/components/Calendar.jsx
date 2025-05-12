import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format, addDays, isAfter, isBefore, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";
import { formatImageUrl } from "../utils/imageUtils";

// Utility function to parse Vietnamese date string
const parseVietnameseDate = (dateStr) => {
  // Format: "20 tháng 04, 2025"
  const parts = dateStr.split(" ");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[2], 10) - 1; // Months are 0-indexed in JS
  const year = parseInt(parts[3].replace(",", ""), 10);
  return new Date(year, month, day);
};

// Convert Vietnamese day names to day numbers (0 = Sunday, 1 = Monday, etc.)
const parseDaySessions = (sessionsStr) => {
  if (!sessionsStr) return [];

  const dayMap = {
    CN: 0,
    "Chủ nhật": 0,
    "Thứ 2": 1,
    "Thứ hai": 1,
    "Thứ 3": 2,
    "Thứ ba": 2,
    "Thứ 4": 3,
    "Thứ tư": 3,
    "Thứ 5": 4,
    "Thứ năm": 4,
    "Thứ 6": 5,
    "Thứ sáu": 5,
    "Thứ 7": 6,
    "Thứ bảy": 6,
  };

  return sessionsStr
    .split(", ")
    .map((day) => dayMap[day.trim()])
    .filter((day) => day !== undefined);
};

// Parse time string into hours and minutes
const parseTimeRange = (timeStr) => {
  if (!timeStr)
    return { startHour: 9, startMinute: 0, endHour: 11, endMinute: 0 };

  const [start, end] = timeStr.split(" - ");
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  return { startHour, startMinute, endHour, endMinute };
};

// Generate all session dates between start and end date based on session days
const generateSessionDates = (appointmentData) => {
  const { scheduleDetails } = appointmentData;

  if (!scheduleDetails.startDate || !scheduleDetails.endDate) {
    return [];
  }

  const startDate = parseVietnameseDate(scheduleDetails.startDate);
  const endDate = parseVietnameseDate(scheduleDetails.endDate);
  const sessionDays = parseDaySessions(scheduleDetails.sessions);
  const { startHour, startMinute } = parseTimeRange(scheduleDetails.time);

  const sessionDates = [];
  let currentDate = new Date(startDate);

  while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
    const dayOfWeek = currentDate.getDay();

    if (sessionDays.includes(dayOfWeek)) {
      const sessionDate = new Date(currentDate);
      sessionDate.setHours(startHour, startMinute, 0);

      sessionDates.push({
        id: `${appointmentData.id}-${sessionDate.getTime()}`,
        studentName: appointmentData.studentInfo.name,
        studentAvatar: appointmentData.studentInfo.avatar,
        subject: scheduleDetails.subject,
        level: scheduleDetails.level,
        date: sessionDate,
        time: scheduleDetails.time,
        notes: scheduleDetails.notes,
        price: scheduleDetails.price,
      });
    }

    currentDate = addDays(currentDate, 1);
  }

  return sessionDates;
};

const ClassCalendar = ({
  showSelectDay = true,
  showUpcoming = true,
  onEventClick,
  selectedEventId,
  classData = [], // Add prop to accept class data from API
}) => {
  const [value, onChange] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("Class data from API:", classData);

    // If we have class data from API, use it instead of dummy data
    if (classData && classData.length > 0) {
      // Transform API class data to the format expected by the calendar
      const transformedEvents = [];

      classData.forEach((classItem) => {
        // Convert day name to day number
        const dayMap = {
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
          Sunday: 0,
          "Thứ 2": 1,
          "Thứ 3": 2,
          "Thứ 4": 3,
          "Thứ 5": 4,
          "Thứ 6": 5,
          "Thứ 7": 6,
          "Chủ nhật": 0,
        };

        // Get the day number (0-6) from the day name
        const dayNumber = dayMap[classItem.day];

        if (dayNumber !== undefined) {
          // Parse time slot (e.g., "7:00-9:00")
          const timeSlot =
            classItem.timeSlot || classItem.scheduleDetails?.time;
          const [startTime] = timeSlot.split("-");
          const [hours, minutes] = startTime.split(":").map(Number);

          // Get start and end dates
          const startDate = new Date(classItem.startDate);
          const endDate = new Date(classItem.endDate);

          // Generate all session dates between start and end dates
          let currentDate = new Date(startDate);

          while (currentDate <= endDate) {
            if (currentDate.getDay() === dayNumber) {
              const sessionDate = new Date(currentDate);
              sessionDate.setHours(hours, minutes, 0);

              transformedEvents.push({
                id: `${classItem.id}-${sessionDate.getTime()}`,
                studentName: classItem.studentInfo.name,
                studentAvatar: classItem.studentInfo.avatar,
                subject: classItem.subject,
                level: `Lớp ${classItem.grade}`,
                date: sessionDate,
                time: timeSlot,
                notes: classItem.scheduleDetails?.notes || "",
                price: `${classItem.classPrice}`,
              });
            }

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      });

      setEvents(transformedEvents);
      return;
    }
  }, [classData]); // Re-run when classData changes

  // Chọn các sự kiện cho ngày đã chọn
  const selectedDayEvents = events.filter((event) =>
    isSameDay(event.date, value)
  );

  // Sự kiện cho ngày hiện tại và tương lai
  const upcomingEvents = events
    .filter(
      (event) =>
        isAfter(event.date, new Date()) || isSameDay(event.date, new Date())
    )
    .sort((a, b) => a.date - b.date)
    .slice(0, 3); // Chỉ lấy 3 sự kiện sắp tới

  // Kiểm tra xem một ngày có sự kiện hay không
  const hasEvent = (date) => {
    return events.some((event) => isSameDay(event.date, date));
  };

  // Custom rendering cho các ô ngày trong lịch
  const tileContent = ({ date, view }) => {
    if (view === "month" && hasEvent(date)) {
      return <div className="event-dot"></div>;
    }
  };

  // Format ngày tháng theo tiếng Việt
  const formatShortWeekday = (locale, date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };
  // const [selectedEventId, setSelectedEventId] = useState(null);
  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
    setSelectedEventId(event.id);
  };

  return (
    <div className="schedule-space">
      {showSelectDay && (
        <div className="calendar-header">
          <h3>Lịch học</h3>
          <div className="calendar-container">
            <Calendar
              onChange={onChange}
              value={value}
              locale="vi"
              formatShortWeekday={formatShortWeekday}
              tileContent={tileContent}
              prevLabel="‹"
              nextLabel="›"
              prev2Label={null}
              next2Label={null}
              showNeighboringMonth={true}
            />
            {selectedDayEvents.length > 0 && (
              <div className="selected-day-events">
                <h4>Lịch học ngày {format(value, "dd/MM/yyyy")}</h4>
                <div className="event-list">
                  {selectedDayEvents.map((event) => (
                    <div
                      className={`event-item ${
                        selectedEventId === event.id ? "selected" : ""
                      }`}
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="event-info">
                        <h5 className="student-name">{event.studentName}</h5>
                        <p>
                          <strong>{event.subject}</strong> - {event.level}
                        </p>
                        <p className="event-time">
                          <i className="far fa-clock"></i>{" "}
                          {format(event.date, "HH:mm", { locale: vi })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showUpcoming && (
        <div className="upcoming-events">
          <h4>Sự kiện sắp tới</h4>

          <div className="event-list">
            {upcomingEvents.length === 0 ? (
              <p className="no-events">Không có sự kiện sắp tới</p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  className={`event-item ${
                    selectedEventId === event.id ? "selected" : ""
                  }`}
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="event-info">
                    <h5 className="student-name">{event.studentName}</h5>
                    <p className="event-subject">
                      <strong>{event.subject}</strong> - {event.level}
                    </p>
                    <p className="event-time">
                      <i className="far fa-calendar-alt"></i>{" "}
                      {format(event.date, "HH:mm dd 'Th' M, yyyy", {
                        locale: vi,
                      })}
                    </p>
                  </div>
                  <div className="event-day">
                    {format(event.date, "EEEE", { locale: vi })
                      .charAt(0)
                      .toUpperCase() +
                      format(event.date, "EEEE", { locale: vi }).slice(1)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassCalendar;
