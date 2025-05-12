import React, { useState } from "react";
import "../styles/AppointmentDetail.css";
import { ApiClient } from "../config/api";

const AppointmentDetail = ({ appointment, onClose, onActionComplete }) => {
  const [loading, setLoading] = useState({
    accept: false,
    reject: false,
  });
  const [error, setError] = useState(null);

  console.log("AppointmentDetail props:", appointment);

  const api = ApiClient();
  const appointmentData = appointment;

  const handleAccept = async () => {
    try {
      setLoading({ accept: true, reject: false });
      setError(null);

      // Call the accept endpoint
      const response = await api.patch(
        `/api/posts/${appointmentData.id}/accept`
      );

      console.log("Accept response:", response);

      if (response && response.status === "success") {
        // Notify parent component that the action was successful
        if (onActionComplete) {
          onActionComplete("accept", appointmentData.id);
        } else {
          onClose();
        }
      } else {
        setError(response?.message || "Không thể chấp nhận yêu cầu");
      }
    } catch (err) {
      console.error("Error accepting appointment:", err);
      setError("Đã xảy ra lỗi khi chấp nhận yêu cầu");
    } finally {
      setLoading({ accept: false, reject: false });
    }
  };

  const handleDecline = async () => {
    try {
      setLoading({ accept: false, reject: true });
      setError(null);

      // Call the reject endpoint
      const response = await api.patch(
        `/api/posts/${appointmentData.id}/reject`
      );

      console.log("Reject response:", response);

      if (response && response.status === "success") {
        // Notify parent component that the action was successful
        if (onActionComplete) {
          onActionComplete("reject", appointmentData.id);
        } else {
          onClose();
        }
      } else {
        setError(response?.message || "Không thể từ chối yêu cầu");
      }
    } catch (err) {
      console.error("Error rejecting appointment:", err);
      setError("Đã xảy ra lỗi khi từ chối yêu cầu");
    } finally {
      setLoading({ accept: false, reject: false });
    }
  };

  return (
    <div className="appointment-detail-content">
      <button className="close-button" onClick={onClose}>
        ✕
      </button>

      <div className="appointment-header">
        <div className="student-avatar">
          <img
            src={appointmentData.studentInfo.avatar}
            alt={appointmentData.studentInfo.name}
          />
        </div>
        <h2>{appointmentData.studentInfo.name}</h2>
      </div>

      <div className="appointment-info">
        <div className="detail-item">
          <p>Môn học:</p> {appointmentData.scheduleDetails.subject}
        </div>
        <div className="detail-item">
          <p>Cấp độ học:</p> {appointmentData.scheduleDetails.level}
        </div>
        <div className="detail-item">
          <p>Ngày bắt đầu:</p> {appointmentData.scheduleDetails.startDate}
        </div>
        <div className="detail-item">
          <p> Ngày kết thúc:</p> {appointmentData.scheduleDetails.endDate}
        </div>
        <div className="detail-item">
          <p>Ngày trong tuần:</p>
          {appointmentData.scheduleDetails.sessions}
        </div>
        <div className="detail-item">
          <p>Thời gian:</p> {appointmentData.scheduleDetails.time}
        </div>
        <div className="note-item">
          <p>Ghi chú:</p> {appointmentData.scheduleDetails.notes}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="appointment-actions">
        <button
          className="action-button accept"
          onClick={handleAccept}
          disabled={loading.accept || loading.reject}
        >
          {loading.accept ? "Đang xử lý..." : "Đồng ý"}
        </button>

        <button
          className="action-button decline"
          onClick={handleDecline}
          disabled={loading.accept || loading.reject}
        >
          {loading.reject ? "Đang xử lý..." : "Từ chối"}
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetail;
