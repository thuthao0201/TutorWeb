import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./../styles/Sidebar.css";
import { MdHomeFilled } from "react-icons/md";
import { PiNotificationBold } from "react-icons/pi";
import { BsCalendar2Check, BsWallet2 } from "react-icons/bs";
import { AiOutlineHistory, AiOutlineStar } from "react-icons/ai";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { RiWechat2Fill } from "react-icons/ri";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">{isCollapsed ? "ST" : "Smart-Tutor"}</h2>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isCollapsed ? ">" : "<"}
        </button>
      </div>
      <nav className="menu">
        <ul>
          <li>
            <NavLink to="/home" className="menu-item" activeClassName="active">
              <MdHomeFilled />
              {!isCollapsed && "Trang chủ"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/appointmentnoti"
              className="menu-item"
              activeClassName="active"
            >
              <PiNotificationBold />
              {!isCollapsed && "Thông báo đặt lịch"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/sessions"
              className="menu-item"
              activeClassName="active"
            >
              <FaChalkboardTeacher />
              {!isCollapsed && "Danh sách lớp học"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/schedule"
              className="menu-item"
              activeClassName="active"
            >
              <BsCalendar2Check />
              {!isCollapsed && "Lịch học"}
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/history"
              className="menu-item"
              activeClassName="active"
            >
              <AiOutlineHistory />
              {!isCollapsed && "Lịch sử buổi học"}
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/wallet"
              className="menu-item"
              activeClassName="active"
            >
              <BsWallet2 />
              {!isCollapsed && "Ví tiền"}
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/reviews"
              className="menu-item"
              activeClassName="active"
            >
              <AiOutlineStar />
              {!isCollapsed && "Đánh giá"}
            </NavLink>
          </li> */}
          {/* <li>
            <NavLink
              to="/chatbot"
              className="menu-item"
              activeClassName="active"
            >
              <RiWechat2Fill />
              {!isCollapsed && "Chatbot"}
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/settings"
              className="menu-item"
              activeClassName="active"
            >
              <FiSettings />
              {!isCollapsed && "Cài đặt"}
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/statistics"
              className="menu-item"
              activeClassName="active"
            >
              <FiBarChart2 />
              {!isCollapsed && "Thống kê"}
            </NavLink>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
}
