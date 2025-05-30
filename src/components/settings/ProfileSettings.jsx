import React, { useState, useEffect } from "react";
import { IoAddCircle } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { ApiClient } from "../../config/api";

const ProfileSettings = ({
  profileData,
  edited,
  isEditing,
  handleInputChange,
  uploadedImage,
  triggerFileInput,
  fileInputRef,
  handleImageUpload,
  onProfileUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = ApiClient();

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/tutors/profile");
      if (response && response.status === "success") {
        const tutorData = response.data;
        const transformedData = {
          fullName: tutorData.userId.name,
          email: tutorData.userId.email,
          phone: tutorData.userId.phone,
          profileImage: `http://localhost:3000${tutorData.userId.avatar}`,
          bio: tutorData.introduce,
          major: tutorData.specialized,
          education: tutorData.degree,
          certificates: tutorData.hasCertificate,
          experiences: tutorData.experiences,
          hourlyRate: tutorData.classPrice,
          teachingDetails: tutorData.subjects.map((subject) => ({
            subject: subject.name,
            levels: subject.grades.map((grade) => `Lớp ${grade}`),
          })),
        };

        if (onProfileUpdate) {
          onProfileUpdate(transformedData);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Không thể tải thông tin profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const response = await api.put("/api/tutors/profile", {
        phone: updatedData.phone,
        introduce: updatedData.bio,
        experiences: updatedData.experiences,
      });

      if (response && response.status === "success") {
        await fetchProfileData(); // Refresh data
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Không thể cập nhật thông tin");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", imageFile);

      const response = await api.post("/api/users/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.status === "success") {
        await fetchProfileData(); // Refresh data
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Không thể tải lên ảnh đại diện");
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.fullName) {
    return (
      <div className="settings-content">
        <div className="loading-state">Đang tải thông tin profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-content">
        <div className="error-state">
          {error}
          <button onClick={fetchProfileData}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-content">
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={uploadedImage || profileData.profileImage}
            alt="Ảnh đại diện"
            className="profile-image"
          />
          {isEditing && <IoAddCircle onClick={triggerFileInput} />}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={(e) => {
              handleImageUpload(e);
              if (e.target.files[0]) {
                uploadProfileImage(e.target.files[0]);
              }
            }}
          />
        </div>
        <div className="profile-info">
          <h2>{profileData.fullName}</h2>
          <div className="verified-badge">
            <MdOutlineVerified /> Đã xác thực
          </div>
        </div>
      </div>

      <div className="settings-form">
        {/* Thông tin cá nhân */}
        <div className="form-section">
          <h3>Thông tin cá nhân</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên</label>
              <div className="form-value">{profileData.fullName}</div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <div className="form-value">{profileData.email}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={edited.phone || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{profileData.phone}</div>
              )}
            </div>
            {/* <div className="form-group">
              <label>Địa chỉ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={edited.address || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{profileData.address}</div>
              )}
            </div> */}
          </div>
        </div>

        {/* Thông tin gia sư */}
        <div className="form-section">
          <h3>Giới thiệu</h3>
          <div className="form-group full-width">
            {isEditing ? (
              <textarea
                name="bio"
                value={edited.bio || ""}
                onChange={handleInputChange}
                rows="4"
                className="bio-textarea"
                placeholder="Viết giới thiệu về bản thân..."
              ></textarea>
            ) : (
              <div className="form-value bio">{profileData.bio}</div>
            )}
          </div>
        </div>

        {/* Chuyên ngành */}
        <div className="form-section">
          <h3>Chuyên ngành</h3>
          <div className="form-group full-width">
            <div className="form-value">{profileData.major}</div>
          </div>
        </div>

        {/* Trình độ */}
        <div className="form-section">
          <h3>Trình độ</h3>
          <div className="form-group full-width">
            <div className="form-value">{profileData.education}</div>
          </div>
        </div>

        {/* Khu vực dạy */}
        {/* <div className="form-section">
          <h3>Khu vực dạy</h3>
          <div className="form-group full-width">
            <div className="form-value">{profileData.teachingArea}</div>
          </div>
        </div> */}

        {/* Chứng chỉ */}
        <div className="form-section">
          <h3>Chứng chỉ</h3>
          <div className="form-group full-width">
            <div className="form-value">
              {profileData.certificates ? "Đã cung cấp" : "Chưa cung cấp"}
            </div>
          </div>
        </div>

        {/* Môn dạy và cấp độ */}
        <div className="form-section">
          <h3>Môn dạy và cấp độ</h3>
          <div className="subjects-grid">
            {profileData.teachingDetails.map((item, index) => (
              <div key={index} className="subject-item">
                <div className="subject-name">{item.subject}</div>
                <div className="subject-levels">
                  {Array.isArray(item.levels)
                    ? item.levels.join(", ")
                    : item.levels}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kinh nghiệm và thành tích */}
        <div className="form-section">
          <h3>Kinh nghiệm và thành tích</h3>
          <div className="experience-list">{profileData.experiences}</div>
        </div>

        {/* Học phí */}
        <div className="form-section">
          <h3>Học phí</h3>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Học phí theo giờ</label>
              <div className="form-value price">
                {profileData.hourlyRate?.toLocaleString("vi-VN") || "200,000"}{" "}
                VNĐ/giờ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
