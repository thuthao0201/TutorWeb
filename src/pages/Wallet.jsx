import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineAccountBalanceWallet, MdHistory } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import "../styles/Wallet.css";
import { ApiClient } from "../config/api";

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("overview");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
  const [userError, setUserError] = useState(null);

  const api = ApiClient();

  // Fetch user information including balance data
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoadingUserInfo(true);
      try {
        const response = await api.get("/api/users/information");

        if (response && response.status === "success") {
          setUserInfo(response.data);
        } else {
          setUserError("Không thể tải thông tin người dùng");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
        setUserError("Đã xảy ra lỗi khi tải thông tin người dùng");
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Mock data for wallet balance and transactions - using real balance data when available
  const [walletData, setWalletData] = useState({
    balance: 2450000,
    pendingWithdrawal: 0,
    transactions: [
      {
        id: "TRX-001",
        type: "deposit",
        amount: 750000,
        date: "2025-04-25T10:30:00",
        status: "pending",
        description: "Thanh toán lớp Toán - Nguyễn Phương Nhi",
      },
      {
        id: "TRX-002",
        type: "deposit",
        amount: 1200000,
        date: "2025-04-20T15:45:00",
        status: "completed",
        description: "Thanh toán lớp Tiếng Anh - Lê Minh Ánh",
      },
      {
        id: "TRX-003",
        type: "withdraw",
        amount: 500000,
        date: "2025-04-15T09:00:00",
        status: "completed",
        description: "Rút tiền về tài khoản ngân hàng",
      },
      {
        id: "TRX-004",
        type: "deposit",
        amount: 1000000,
        date: "2025-04-10T14:20:00",
        status: "completed",
        description: "Thanh toán lớp Vật lý - Trần Quốc Bảo",
      },
      {
        id: "TRX-005",
        type: "withdraw",
        amount: 200000,
        date: "2025-04-05T11:15:00",
        status: "completed",
        description: "Rút tiền về tài khoản ngân hàng",
      },
      {
        id: "TRX-006",
        type: "deposit",
        amount: 500000,
        date: "2025-04-01T13:30:00",
        status: "completed",
        description: "Thanh toán lớp Hóa học - Nguyễn Văn A",
      },
      {
        id: "TRX-007",
        type: "deposit",
        amount: 300000,
        date: "2025-03-28T16:00:00",
        status: "completed",
        description: "Thanh toán lớp Sinh học - Trần Thị B",
      },
      {
        id: "TRX-008",
        type: "withdraw",
        amount: 1000000,
        date: "2025-03-25T12:00:00",
        status: "completed",
        description: "Rút tiền về tài khoản ngân hàng",
      },
    ],
  });

  // Update wallet data when user info is loaded
  useEffect(() => {
    if (userInfo) {
      setWalletData((prev) => ({
        ...prev,
        balance: userInfo.balance || 0,
        pendingWithdrawal: userInfo.pendingBalance || 0,
      }));
    }
  }, [userInfo]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    // Validate form
    if (!withdrawAmount || !bankAccount || !bankName || !accountName) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const amount = parseInt(withdrawAmount.replace(/\D/g, ""));
    if (isNaN(amount) || amount <= 0) {
      alert("Số tiền không hợp lệ");
      return;
    }

    if (amount > walletData.balance) {
      alert("Số dư không đủ để thực hiện giao dịch này");
      return;
    }

    // Process withdrawal
    setLoading(true);

    // In a real app, you would make an API call here
    try {
      // Simulate API call for now
      // const response = await api.post('/withdraw', {
      //   amount,
      //   bankAccount,
      //   bankName,
      //   accountName
      // });

      setTimeout(() => {
        const newTransaction = {
          id: `TRX-${Math.floor(Math.random() * 1000)}`,
          type: "withdraw",
          amount: amount,
          date: new Date().toISOString(),
          status: "pending",
          description: `Rút tiền về tài khoản ${bankAccount}`,
        };

        setWalletData((prev) => ({
          ...prev,
          balance: prev.balance - amount,
          pendingWithdrawal: prev.pendingWithdrawal + amount,
          transactions: [newTransaction, ...prev.transactions],
        }));

        setLoading(false);
        setSuccessMessage(
          `Yêu cầu rút ${formatCurrency(amount)} đã được gửi và đang được xử lý`
        );
        setShowWithdrawForm(false);

        // Clear form
        setWithdrawAmount("");
        setBankAccount("");
        setBankName("");
        setAccountName("");

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }, 1500);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      alert("Đã xảy ra lỗi khi xử lý yêu cầu rút tiền. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const handleWithdrawAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and format as currency
    const numericValue = value.replace(/\D/g, "");
    if (numericValue) {
      setWithdrawAmount(formatCurrency(parseInt(numericValue)));
    } else {
      setWithdrawAmount("");
    }
  };

  return (
    <div className="wallet-container">
      <Sidebar />
      <Header />

      <div className="wallet-content">
        <div className="wallet-header">
          <h1>
            <IoWalletOutline /> Ví tiền của tôi
          </h1>
          <button
            className="withdraw-button"
            onClick={() => setShowWithdrawForm(true)}
          >
            <FiDownload /> Rút tiền
          </button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="wallet-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <MdOutlineAccountBalanceWallet /> Tổng quan
          </button>
          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => setActiveTab("transactions")}
          >
            <MdHistory /> Lịch sử giao dịch
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="wallet-overview">
            {isLoadingUserInfo ? (
              <div className="loading">Đang tải thông tin ví...</div>
            ) : userError ? (
              <div className="error">{userError}</div>
            ) : (
              <div className="balance-card">
                <div className="balance-header">Số dư hiện tại</div>
                <div className="balance-amount">
                  {formatCurrency(walletData.balance)}
                </div>
                <div className="balance-info">
                  {walletData.pendingWithdrawal > 0 && (
                    <p>
                      Đang chờ xử lý:{" "}
                      {formatCurrency(walletData.pendingWithdrawal)}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="recent-transactions">
              <h3>Giao dịch gần đây</h3>
              <ul className="transaction-list">
                {walletData.transactions.slice(0, 3).map((transaction) => (
                  <li key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.type === "deposit" ? "+" : "-"}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-description">
                        {transaction.description}
                      </div>
                      <div className="transaction-date">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === "deposit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </li>
                ))}
              </ul>
              {walletData.transactions.length > 3 && (
                <button
                  className="view-all-transactions"
                  onClick={() => setActiveTab("transactions")}
                >
                  Xem tất cả giao dịch
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="transactions-container">
            <h3>Lịch sử giao dịch</h3>

            {walletData.transactions.length === 0 ? (
              <p className="no-transactions">Chưa có giao dịch nào</p>
            ) : (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Mã giao dịch</th>
                    <th>Mô tả</th>
                    <th>Ngày</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {walletData.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{transaction.description}</td>
                      <td>{formatDate(transaction.date)}</td>
                      <td className={`amount ${transaction.type}`}>
                        {transaction.type === "deposit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <span className={`status ${transaction.status}`}>
                          {transaction.status === "completed"
                            ? "Hoàn thành"
                            : transaction.status === "pending"
                            ? "Đang xử lý"
                            : "Thất bại"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showWithdrawForm && (
        <div className="modal-overlay">
          <div className="withdraw-modal">
            <h2>Rút tiền</h2>
            <button
              className="close-modal"
              onClick={() => setShowWithdrawForm(false)}
            >
              ✕
            </button>

            <div className="available-balance">
              Số dư khả dụng:{" "}
              <strong>{formatCurrency(walletData.balance)}</strong>
            </div>

            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label>Số tiền rút</label>
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={handleWithdrawAmountChange}
                  placeholder="Nhập số tiền"
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngân hàng</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Tên ngân hàng"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tên chủ tài khoản</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Tên chủ tài khoản"
                  required
                />
              </div>

              <div className="form-group">
                <label>Số tài khoản</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Số tài khoản"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-withdraw"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận rút tiền"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
