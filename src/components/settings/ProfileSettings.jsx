import React from "react";
import { IoAddCircle } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";

const ProfileSettings = ({
  profileData,
  edited,
  isEditing,
  handleInputChange,
  uploadedImage,
  triggerFileInput,
  fileInputRef,
  handleImageUpload,
}) => {
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
            onChange={handleImageUpload}
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
