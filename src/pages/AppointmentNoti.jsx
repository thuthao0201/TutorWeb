import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Appointment from "../components/Appointment";
import { AiOutlineFileSearch } from "react-icons/ai";
import "./../styles/AppointmentNoti.css";
import { ApiClient } from "../config/api";

export default function AppointmentNoti() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);
  const api = ApiClient();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookingsResponse = await api.get("/api/posts");

        console.log("bookingsResponse", bookingsResponse);

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
        console.error("Error fetching bookings:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handler to remove a booking from the list after acceptance or rejection
  const handleBookingActionComplete = (actionType, bookingId) => {
    console.log(`Booking ${bookingId} was ${actionType}ed`);
    setPendingBookings((prevBookings) =>
      prevBookings.filter((booking) => booking._id !== bookingId)
    );
  };

  return (
    <div className="notifications-page">
      <Sidebar />
      <Header />
      <div className="notifications-content">
        <div className="appointment-list">
          <h2>Danh sách đặt lịch</h2>
          {loading ? (
            <p>Đang tải thông tin...</p>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <Appointment
              bookings={pendingBookings}
              onActionComplete={handleBookingActionComplete}
            />
          )}
        </div>
        <div className="appointment-details">
          <p>Hiển thị nội dung chi tiết ở đây</p>
          <AiOutlineFileSearch />
        </div>
      </div>
    </div>
  );
}
