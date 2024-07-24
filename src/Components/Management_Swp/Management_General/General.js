import { useEffect, useState } from "react";
import SideBar from "../../Sidebar/SideBar";
import {
  useLocation,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { BarChart } from "@mui/x-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInDays } from "date-fns";
import { max } from "moment-timezone";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function General() {
  const [order, setOrder] = useState();
  let query = useQuery();
  let id = query.get("id");
  const history = useHistory();
  useEffect(async () => {}, []);
  const [totalFinalTransactionValues, setTotalFinalTransactionValues] =
    useState([]);
  const [formattedDates, setFormattedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const [report, setReport] = useState();

  const handleSelect = async () => {
    if (!startDate || !endDate) {
      setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }

    if (endDate < startDate) {
      setError('"Ngày kết thúc" không được nhỏ hơn "Ngày bắt đầu".');
      return;
    }

    setError("");
    await getSaleReports();
    await getReport()
  };

  const getSaleReports = async () => {
    try {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      // Fetch data based on selected date range
      // For demonstration purposes, we'll just log the selected dates
      const difference = differenceInDays(endDate, startDate);
      const formData = new FormData();
      formData.append("StartDate", formattedStartDate);
      formData.append("EndDate", formattedEndDate);
      formData.append("Format", difference <= 7 ? "day" : "month");
      const response = await axios.post(
        `https://swp.somee.com/api/Order/SaleReport`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        const finalTransactionValues = response.data.reportDetails.map(
          (detail) => ({
            data: [detail.totalFinalTransactionValue],
          })
        );
        const formattedDatesArray = response.data.reportDetails.map(
          (detail) => detail.formattedDate
        );
        setTotalFinalTransactionValues(finalTransactionValues);
        setFormattedDates(formattedDatesArray);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getReport = async () => {
    try {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      const formData = new FormData();  
      formData.append("StartDay", formattedStartDate);
      formData.append("EndDay", formattedEndDate);
      const response = await axios.post(
        `https://swp.somee.com/api/Order/getreport`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setReport(response.data)
        console.log(response.data)
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleBackClick = () => {
    history.goBack();
  };

  const renderAllOrder = () => {
    return order.orderDetails.map((element, index) => {
      return (
        <tr>
          <td>{index + 1}</td>
          <td>{element.productItem.product.name}</td>
          <td>{element.quantity}</td>
          <td>{element.productItem.price}</td>
          <td>{element.price}</td>
        </tr>
      );
    });
  };

  return (
    <div className="theme-layout">
      <div className="responsive-header">
        <div className="res-logo">
          <img src="images/logo.png" alt="" />
        </div>
        <div className="user-avatar mobile">
          <a href="profile.html" title="View Profile">
            <img alt="" src="images/resources/user.jpg" />
          </a>
          <div className="name">
            <h4>Saim Turan</h4>
            <span>Antalaya, Turky</span>
          </div>
        </div>
        <div className="right-compact">
          <div className="menu-area">
            <div id="nav-icon3">
              <i>
                <svg
                  className="feather feather-grid"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height={18}
                  width={18}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect height={7} width={7} y={3} x={3} />
                  <rect height={7} width={7} y={3} x={14} />
                  <rect height={7} width={7} y={14} x={14} />
                  <rect height={7} width={7} y={14} x={3} />
                </svg>
              </i>
            </div>
            <ul className="drop-menu">
              <li>
                <a title="profile.html" href="profile.html">
                  <i className="icofont-user-alt-1" />
                  Your Profile
                </a>
              </li>
              <li>
                <a title href="#">
                  <i className="icofont-question-circle" />
                  Help
                </a>
              </li>
              <li>
                <a title href="#">
                  <i className="icofont-gear" />
                  Setting
                </a>
              </li>
              <li>
                <a className="dark-mod" title href="#">
                  <i className="icofont-moon" />
                  Dark Mode
                </a>
              </li>
              <li>
                <a title href="login-register.html" className="logout">
                  <i className="icofont-logout" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
          <div className="res-search">
            <span>
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-search"
                >
                  <circle cx={11} cy={11} r={8} />
                  <line x1={21} y1={21} x2="16.65" y2="16.65" />
                </svg>
              </i>
            </span>
          </div>
        </div>
        <div className="restop-search">
          <span className="hide-search">
            <i className="icofont-close-circled" />
          </span>
          <form method="post">
        
          </form>
        </div>
      </div>
      {/* responsive header */}
      <header className>
        <div className="topbar stick">
          <div className="logo">
            <img alt="" src="images/logo.png" />
            <span>BelongLove</span>
          </div>
         
        </div>
      </header>
      {/* header */}
      <div className="top-sub-bar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="menu-btn">
                <i className>
                  <svg
                    id="menu-btn"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-menu"
                  >
                    <line x1={3} y1={12} x2={21} y2={12} />
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <line x1={3} y1={18} x2={21} y2={18} />
                  </svg>
                </i>
              </div>
              <div className="page-title">
                <h4>All General.</h4>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <ul className="breadcrumb">
                <li>
                  <a href="#" title>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" title>
                    All General
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* top sub bar */}
      <SideBar />
      {/* sidebar */}
      <div className="container-fluid">
        <div className="row">
          z
          <div className="col-lg-12">
            <div className="panel-content">
              <div className="container">
                <h4 className="main-title ">Thống kê bán hàng</h4>
                <div className="d-widget">
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <label>Ngày bắt đầu: </label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="yyyy-MM-dd"
                        />
                      </div>
                      <div style={{ marginLeft: "30px" }}>
                        <label>Ngày kết thúc: </label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="yyyy-MM-dd"
                        />
                      </div>
                      <button
                        className="main-btn"
                        style={{ marginLeft: "20px", marginBottom: "20px" }}
                        onClick={async () => await handleSelect()}
                      >
                        Select
                      </button>
                      
                    </div>
                    {error && <p style={{ color: "red" , marginLeft:'10px'}}>{error}</p>}
                  </div>

                  <h3 style={{ margin: "20px 0", textAlign: "center" }}>
                    TÓM TẮT THỐNG KÊ VỀ BÁN HÀNG
                  </h3>
                  <div className="summary">
                    <div className="payment-method" style={{ padding: "0" }}>
                      <p style={{ padding: "10px" }}>Số đơn bán</p>
                      <p style={{ padding: "10px" }}>Số đơn hủy</p>
                      <p style={{ padding: "10px" }}>Phí vận chuyển</p>
                      <p style={{ padding: "10px" }}>Thu nhập</p>
                    </div>
                    {report &&
                    <div className="order-summary">
                      <p style={{ padding: "10px" }}>{report.totalQuantity}</p>
                      <p style={{ padding: "10px" }}>{report.totalQuantityCancel}</p>
                      <p style={{ padding: "10px" }}>{report.totalDeliver}</p>
                      <p style={{ padding: "10px" }}>{report.totalFinal}</p>
                    </div>}
                  </div>
                  {formattedDates && (
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: formattedDates,
                        },
                      ]}
                      series={totalFinalTransactionValues}
                      width={400}
                      height={300}
                      margin={{
                        left: 100,
                      }}
                    />
                  )}
                  {/* <div className="table-container">
                    <table className="tb_od">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tên Sữa</th>
                          <th>Số Lượng</th>
                          <th>Giá</th>
                          <th>Tổng Phụ</th>
                        </tr>
                      </thead>
                      <tbody>{order && renderAllOrder()}</tbody>
                    </table>
                  </div> */}
                  {/* <div className="summary">
                    <div className="payment-method">
                      <h5>Phương Thức Thanh Toán:</h5>
                      <p>Thanh toán thông qua VNpay</p>
                      <p>Đơn hàng này đã được thanh toán</p>
                    </div>
                    <div className="order-summary">
                      <h5>Tóm tắt tổng đơn hàng</h5>
                      <p>Tổng Phụ: 50.000 VND</p>
                      <p>Phí Vận Chuyển: 10.000 VND</p>
                      <p>Tổng: 60.000 VND</p>
                    </div>
                  </div> */}
                  <div className="footer">
                    <button className="back-button" onClick={handleBackClick}>
                      Quay Lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
