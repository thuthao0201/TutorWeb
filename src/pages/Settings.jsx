import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  FiUser,
  FiLock,
  FiDollarSign,
  FiBell,
  FiSave,
  FiLogOut,
  FiEdit,
} from "react-icons/fi";
import "../styles/Settings.css";
import { ApiClient } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Import các component con
import ProfileSettings from "../components/settings/ProfileSettings";
import SecuritySettings from "../components/settings/SecuritySettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
    bio: "",
    major: "",
    education: "",
    teachingArea: "",
    certificates: false,
    teachingDetails: [],
    experiences: "",
    hourlyRate: 0,
  });

  const [securityData, setSecurityData] = useState({
    email: "",
    phone: "",
    twoFactorEnabled: false,
  });

  const [paymentData, setPaymentData] = useState({
    defaultBank: "",
    accountName: "",
    accountNumber: "",
    autoWithdraw: false,
    withdrawThreshold: 2000000,
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    paymentNotifications: true,
    studentReviews: true,
    marketingEmails: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = ApiClient();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch tutor data from API
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/tutors/me");

        if (response && response.status === "success" && response.data) {
          const tutorData = response.data;

          // Format teaching details from subjects array
          const teachingDetails = tutorData.subjects.map((subject) => ({
            subject: subject.name,
            levels: subject.grades.map((grade) => `Lớp ${grade}`),
          }));

          // Update profile data with API response
          setProfileData({
            fullName: tutorData.userId.name,
            email: tutorData.userId.email,
            phone: tutorData.userId.phone || "",
            address: "", // Address not provided in API response
            profileImage: `http://localhost:3000${tutorData.userId.avatar}`,
            bio: tutorData.introduce,
            major: tutorData.specialized,
            education: tutorData.degree,
            teachingArea: "", // Teaching area not provided in API response
            certificates: tutorData.hasCertificate,
            teachingDetails: teachingDetails,
            experiences: tutorData.experiences,
            hourlyRate: tutorData.classPrice,
          });

          // Update security data
          setSecurityData({
            email: tutorData.userId.email,
            phone: tutorData.userId.phone || "",
            twoFactorEnabled: false, // Not provided in API response
          });

          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching tutor data:", err);
        setError("Không thể tải thông tin người dùng");
        setLoading(false);
      }
    };

    fetchTutorData();
  }, []);

  // Chỉ có thể chỉnh sửa khi đang ở tab profile
  const canEdit = activeTab === "profile";

  useEffect(() => {
    // Cài đặt lại trạng thái lưu thành công sau 3 giây
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Nếu đang chỉnh sửa và chuyển tab, hủy chỉnh sửa
    if (isEditing) {
      setIsEditing(false);
      setEdited({});
    }
  };

  const handleEditToggle = () => {
    if (!canEdit) return;

    if (isEditing) {
      // Nếu đang chỉnh sửa, lưu thay đổi
      handleSaveChanges();
    } else {
      // Bắt đầu chỉnh sửa
      setIsEditing(true);
      // Khởi tạo trạng thái chỉnh sửa
      setEdited({
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Chỉ cho phép thay đổi các trường được chỉ định
    if (["phone", "address", "bio"].includes(name)) {
      setEdited((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    // Chỉ lưu thay đổi cho tab profile
    if (activeTab === "profile") {
      // Chỉ cập nhật các trường được phép chỉnh sửa
      const allowedFields = ["phone", "address", "bio"];
      const updatedData = {};

      allowedFields.forEach((field) => {
        if (edited[field] !== undefined) {
          updatedData[field] = edited[field];
        }
      });

      // In a real app, you would make an API call here to update the data
      // try {
      //   const response = await api.patch('/api/tutors/me', {
      //     introduce: updatedData.bio,
      //     userId: {
      //       phone: updatedData.phone
      //     }
      //   });
      // } catch (error) {
      //   console.error("Error updating profile:", error);
      // }

      setProfileData((prev) => ({
        ...prev,
        ...updatedData,
      }));

      // Xử lý cập nhật ảnh đại diện
      if (uploadedImage) {
        setProfileData((prev) => ({
          ...prev,
          profileImage: uploadedImage,
        }));
        setUploadedImage(null);
      }
    }

    // Thoát chế độ chỉnh sửa và hiển thị thông báo thành công
    setIsEditing(false);
    setSaveSuccess(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    // Use the logout function from AuthContext
    logout();
    // Navigate to login page
    navigate("/login");
  };

  const renderActiveTabContent = () => {
    if (loading) {
      return <div className="loading-indicator">Đang tải thông tin...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    switch (activeTab) {
      case "profile":
        return (
          <ProfileSettings
            profileData={profileData}
            edited={edited}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            uploadedImage={uploadedImage}
            triggerFileInput={triggerFileInput}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
          />
        );
      case "security":
        return <SecuritySettings securityData={securityData} />;

      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <Sidebar />
      <Header />

      <div className="settings-content-wrapper">
        <div className="settings-header">
          <h1>Cài đặt tài khoản</h1>
          {saveSuccess && (
            <div className="save-success-message">Lưu thành công!</div>
          )}
          {canEdit && (
            <button
              className={`edit-button ${isEditing ? "save-mode" : ""}`}
              onClick={handleEditToggle}
            >
              {isEditing ? (
                <>
                  <FiSave /> Lưu thay đổi
                </>
              ) : (
                <>
                  <FiEdit /> Chỉnh sửa
                </>
              )}
            </button>
          )}
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <div className="settings-menu">
              <button
                className={`settings-menu-item ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => handleTabChange("profile")}
              >
                <FiUser /> Hồ sơ
              </button>
              <button
                className={`settings-menu-item ${
                  activeTab === "security" ? "active" : ""
                }`}
                onClick={() => handleTabChange("security")}
              >
                <FiLock /> Bảo mật
              </button>
            </div>
            <div className="settings-footer">
              <button
                className="settings-menu-item danger"
                onClick={handleLogout}
              >
                <FiLogOut /> Đăng xuất
              </button>
            </div>
          </div>

          <div className="settings-main">{renderActiveTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
