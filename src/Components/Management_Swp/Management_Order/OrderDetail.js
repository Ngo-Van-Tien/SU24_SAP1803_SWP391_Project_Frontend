import { useEffect, useState } from "react";
import SideBar from "../../Sidebar/SideBar"
import { useLocation, useHistory  } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
export default function OrderDetail() {

    const [order, setOrder] = useState();
    let query = useQuery();
    let id = query.get('id');
    const history = useHistory();
    useEffect(async () => {
        console.log("hehehe")
        await getGroupRecent();
      }, []);
    const getGroupRecent = async () => {
        try {
          const response = await axios.get(
            `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Order/GetOrder?id=${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.authorization,
              },
            }
          );
          if (response.status === 200) {
            setOrder(response.data);
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

    return(
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
            <div className="searches">
              <form method="post">
              
                <button type="submit">
                  <i className="" />
                </button>
              </form>
            </div>
            <ul className="web-elements">
              <li>
                <div className="user-dp">
                  <a href="profile-page2.html" title>
                    <img src="images/resources/user.jpg" alt="" />
                    <div className="name">
                      <h4>Xin Chào</h4>
                    </div>
                  </a>
                </div>
              </li>
              <li>
                <a href="index.html" title="Home" data-toggle="tooltip">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-home"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </i>
                </a>
              </li>
              <li>
                <a
                  className="mesg-notif"
                  href="#"
                  title="Messages"
                  data-toggle="tooltip"
                >
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-message-square"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </i>
                </a>
                <span />
              </li>
              <li>
                <a
                  className="mesg-notif"
                  href="#"
                  title="Notifications"
                  data-toggle="tooltip"
                >
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-bell"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </i>
                </a>
                <span />
              </li>
              <li>
                <a
                  className="create"
                  href="#"
                  title="Add New"
                  data-toggle="tooltip"
                >
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-plus"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                  </i>
                </a>
              </li>
              <li>
                <a title href="#">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-grid"
                    >
                      <rect x={3} y={3} width={7} height={7} />
                      <rect x={14} y={3} width={7} height={7} />
                      <rect x={14} y={14} width={7} height={7} />
                      <rect x={3} y={14} width={7} height={7} />
                    </svg>
                  </i>
                </a>
                <ul className="dropdown">
                  <li>
                    <a href="profile.html" title>
                      <i className="icofont-user-alt-3" /> Your Profile
                    </a>
                  </li>
                  <li>
                    <a href="add-new-course.html" title>
                      <i className="icofont-plus" /> New Course
                    </a>
                  </li>
                  <li>
                    <a className="invite-new" href="#" title>
                      <i className="icofont-brand-slideshare" /> Invite Collegue
                    </a>
                  </li>
                  <li>
                    <a href="pay-out.html" title>
                      <i className="icofont-price" /> Payout
                    </a>
                  </li>
                  <li>
                    <a href="price-plan.html" title>
                      <i className="icofont-flash" /> Upgrade
                    </a>
                  </li>
                  <li>
                    <a href="help-faq.html" title>
                      <i className="icofont-question-circle" /> Help
                    </a>
                  </li>
                  <li>
                    <a href="settings.html" title>
                      <i className="icofont-gear" /> Setting
                    </a>
                  </li>
                  <li>
                    <a href="privacy-n-policy.html" title>
                      <i className="icofont-notepad" /> Privacy
                    </a>
                  </li>
                  <li>
                    <a className="dark-mod" title href="#">
                      <i className="icofont-moon" /> Dark Mode
                    </a>
                  </li>
                  <li className="logout">
                    <a href="sign-in.html" title>
                      <i className="icofont-power" /> Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
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
                  <h4>All OrderDetail.</h4>
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
                      All Orderdetail
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
        <div className="row">z
          <div className="col-lg-12">
            <div className="panel-content">
        <div className="container">
      <h4 className="main-title " >Chi Tiết Đơn Hàng</h4>
      <div className="d-widget">
      <div className="info">
        <div className="info-section">
          <h5>Thông Tin Của Hàng</h5>
          <p>Sữa Việt</p>
          <p>67 Đường Trần Hưng Đạo, Cầu Ông Lãnh, Quận 1, Thành phố Hồ Chí Minh, Việt Nam</p>
          <p>Số Điện Thoại: 0903478987</p>
          <p>Email: Suaviet@gmail.com</p>
        </div>
        <div className="info-section">
          <h5>Thông Tin Khách Hàng</h5>
          <p>{order && order.address}</p>
          <p>Số Điện Thoại: 08454734646</p>
          <p>Email: 08454734646example@gmail.com</p>
        </div>
        <div className="info-section">
          <h5>Hóa Đơn #249</h5>
          <p>{order && order.id}</p>
          <p>Ngày Thanh Toán: </p>
          <p>Mã Giao Dịch:</p>
        </div>
      </div>
      <div className="table-container">
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
          <tbody>
            {order && renderAllOrder()}
          </tbody>
        </table>
      </div>
      <div className="summary">
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
      </div>
      <div className="footer">
        <button className="back-button" onClick={handleBackClick}>Quay Lại</button>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
        </div>
    )
}