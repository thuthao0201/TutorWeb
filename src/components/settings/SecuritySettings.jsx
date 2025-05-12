import React, { useState } from "react";
import { FiEdit, FiEye, FiEyeOff, FiX, FiCheck } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

const SecuritySettings = ({ securityData }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePasswords = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 1 chữ hoa";
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 1 số";
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      newErrors.newPassword =
        "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (validatePasswords()) {
      setIsSubmitting(true);

      // Giả lập API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Đặt lại các trường sau khi thành công
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccess(true);

        // Đóng modal sau 2 giây
        setTimeout(() => {
          setSuccess(false);
          setShowPasswordModal(false);
        }, 2000);
      } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        setErrors({ general: "Đã xảy ra lỗi khi thay đổi mật khẩu" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOpenModal = () => {
    setShowPasswordModal(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setSuccess(false);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowPasswordModal(false);
      setErrors({});
    }
  };

  return (
    <div className="settings-content">
      <div className="form-section">
        <h3>Bảo mật tài khoản</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Email đăng nhập</label>
            <div className="form-value">{securityData.email}</div>
          </div>
          <div className="form-group">
            <label>Số điện thoại liên kết</label>
            <div className="form-value">{securityData.phone}</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Mật khẩu</label>
            <div className="form-value password-field">
              ••••••••••••
              <button
                className="change-password-field"
                onClick={handleOpenModal}
              >
                <FiEdit /> Thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="password-modal">
            <div className="modal-header">
              <h3>Thay đổi mật khẩu</h3>
              <button
                className="close-button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleChangePassword}>
              {/* Thông báo lỗi chung */}
              {errors.general && (
                <div className="error-message general">{errors.general}</div>
              )}

              {/* Form đổi mật khẩu */}
              <div className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                  <div className="password-input-container">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isSubmitting || success}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="toggle-password-button"
                      disabled={isSubmitting || success}
                    >
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <div className="error-message">
                      {errors.currentPassword}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <div className="password-input-container">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isSubmitting || success}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="toggle-password-button"
                      disabled={isSubmitting || success}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <div className="error-message">{errors.newPassword}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isSubmitting || success}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="toggle-password-button"
                      disabled={isSubmitting || success}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="error-message">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="password-requirements">
                  <h4>Yêu cầu mật khẩu:</h4>
                  <ul>
                    <li className={newPassword.length >= 8 ? "valid" : ""}>
                      Ít nhất 8 ký tự
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? "valid" : ""}>
                      Ít nhất 1 chữ hoa
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? "valid" : ""}>
                      Ít nhất 1 số
                    </li>
                    <li
                      className={/[!@#$%^&*]/.test(newPassword) ? "valid" : ""}
                    >
                      Ít nhất 1 ký tự đặc biệt (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Thông báo thành công */}
              {success && (
                <div className="success-message">
                  <FiCheck /> Mật khẩu đã được thay đổi thành công!
                </div>
              )}

              {/* Nút xác nhận */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting || success}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="confirm-button"
                  disabled={isSubmitting || success}
                >
                  {isSubmitting ? (
                    <>
                      <CgSpinner className="spinner-icon" /> Đang xử lý...
                    </>
                  ) : success ? (
                    <>
                      <FiCheck /> Hoàn tất
                    </>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;
