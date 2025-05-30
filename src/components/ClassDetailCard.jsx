import React from "react";
import { CiCalendarDate } from "react-icons/ci";
import { IoIosTimer } from "react-icons/io";
// import { BsCashCoin } from "react-icons/bs";
import { PiMoneyThin, PiTimerLight } from "react-icons/pi";
import { CiStickyNote } from "react-icons/ci";

import "../styles/ClassDetailCard.css";

const formatVietnameseDate = (date) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const months = [
    "tháng 1",
    "tháng 2",
    "tháng 3",
    "tháng 4",
    "tháng 5",
    "tháng 6",
    "tháng 7",
    "tháng 8",
    "tháng 9",
    "tháng 10",
    "tháng 11",
    "tháng 12",
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month}, ${year}`;
};

const onJoinClass = (joinUrl) => {
  console.log("joinUrl: ", joinUrl);
  if (joinUrl) {
    window.open(joinUrl, "_blank");
  } else {
    alert("Chưa có link vào lớp học");
  }
};

const ClassDetailCard = ({ classData, onClose }) => {
  if (!classData) return null;

  console.log("classData: ", classData);
  console.log("Hello");

  return (
    <div className="class-detail-card">
      <div className="class-detail-header">
        <img src={classData.studentAvatar} alt="Student" />
        <div>
          <h3>{classData.studentName}</h3>
          <p>{classData.subject}</p>
        </div>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="class-detail-info">
        <div>
          <CiCalendarDate />
          <div>
            <p className="info-value">{formatVietnameseDate(classData.date)}</p>
            <p className="info-label">Ngày</p>
          </div>
        </div>

        <div>
          <PiTimerLight />
          <div>
            <p className="info-value">{classData.time}</p>
            <p className="info-label">Thời gian</p>
          </div>
        </div>

        <div>
          <PiMoneyThin />
          <div>
            <p className="info-value">{classData.price}</p>
            <p className="info-label">Giá</p>
          </div>
        </div>
        <div>
          <CiStickyNote />
          <div>
            <p className="info-value">{classData.notes}</p>
            <p className="info-label">Ghi chú</p>
          </div>
        </div>
      </div>

      <button
        className="join-class-btn"
        onClick={() => onJoinClass(classData?.joinUrl)}
      >
        Vào lớp học
      </button>
    </div>
  );
};

export default ClassDetailCard;
