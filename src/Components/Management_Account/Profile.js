import React from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "../../css/profile.css";
import CreateUser from "../Management_Account/CreateUser";
import Groups from "../Management_Account/Groups";
import SideBar from "../Sidebar/SideBar";

export default function Profile() {
  const [listUsers, setListUser] = useState([]);
  const [alumiId, setAlumiId] = useState("");
  const [groupPopup, setGroupPopup] = useState(false);
  const [count, setCount] = useState(0);
  const token =
    "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoia2lldXRyYW5nQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJJZCI6IjQiLCJTY2hvb2xJZCI6IjEiLCJHcm91cElkIjoiIiwiSW1hZ2UiOiJodHRwczovL2kuaWJiLmNvLzFNODRIbTYvOWIxNDRkMTktYTEzZS00MDJmLThiNTktMGRmNDkyYmY0MGQ3LmpwZyIsIkFsdW1uaU5hbWUiOiJUcmFuZyBuw6giLCJleHAiOjE2MzYxOTEzMDQsImlzcyI6ImxvY2FsaG9zdDoxMjM0NyIsImF1ZCI6ImxvY2FsaG9zdDoxMjM0NyJ9.GSH07DjXfByObLy7eQdrSzici9m94JIBBrlkAIMjVk4";
  useEffect(async () => {
    await fetchAllUser();
    console.log(listUsers[211]);
  }, [groupPopup, count]);

  const fetchAllUser = async () => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/alumni?pageNumber=0&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        const listGroups = await fetchAllGroups();
        for (let i = 0; i < response.data.length; i++) {
          for (let j = 0; j < listGroups.length; j++) {
            let adminOfGroups = [];
            if (response.data[i].id === listGroups[j].groupAdminId) {
              response.data[i].isAdmin = true;
              response.data[i].ofGroups = adminOfGroups.push(listGroups[j].id);
              break;
            } else {
              response.data[i].isAdmin = false;
              response.data[i].ofGroups = [];
            }
          }
        }
        setListUser(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllGroups = async () => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/groups?pageNumber=0&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      const listGroups = response.data;
      return listGroups;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
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
                  <h4>User Profile</h4>
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
                      Profile
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
            <div className="col-lg-12">
              <div className="panel-content">
                <h4 className="main-title">
                  Quản lý người dùng <i className="icofont-pen-alt-1" />
                </h4>
                <div className="row merged20 mb-4">
                  <div className="col-lg-4">
                    <div className="d-widget text-center">
                      <CreateUser />
                    </div>
                    <div className="d-widget mt-4">
                      <div className="d-widget-title">
                        <h5>Social Links</h5>
                      </div>
                      <div className="social-links">
                        <i className="icofont-facebook" />
                        <input type="text" placeholder="Facebook Profile" />
                        <em>Add your Facebook username (e.g. johndoe).</em>
                      </div>
                      <div className="social-links">
                        <i className="icofont-instagram" />
                        <input type="text" placeholder="Facebook Profile" />
                        <em>Add your Facebook username (e.g. johndoe).</em>
                      </div>
                      <div className="social-links">
                        <i className="icofont-twitter" />
                        <input type="text" placeholder="Facebook Profile" />
                        <em>Add your Facebook username (e.g. johndoe).</em>
                      </div>
                      <div className="social-links">
                        <i className="icofont-pinterest" />
                        <input type="text" placeholder="Facebook Profile" />
                        <em>Add your Facebook username (e.g. johndoe).</em>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <nav className="responsive-tab style1">
                      <ul
                        data-submenu-title="compounents"
                        uk-switcher="connect: #picturez ;animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium"
                        className="uk-grid"
                        uk-sticky="offset:50;media : @m"
                      >
                        <li className="refresh">
                          <a href="#">Người dùng </a>{" "}
                          <i
                            class="icofont-refresh"
                            onClick={() => setCount(count + 1)}
                          ></i>
                        </li>
                      </ul>
                    </nav>
                    <ul className="uk-switcher" id="picturez">
                      <li>
                        <table className="table table-default uk-table-striped">
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Email</th>
                              <th>Họ và tên </th>
                              <th>Mật khẩu</th>
                              <th>Đặt làm admin nhóm</th>
                              <th>Tùy chọn</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listUsers.map((user) => {
                              return (
                                <tr>
                                  <td>{user.id}</td>
                                  <td>{user.email}</td>
                                  <td>
                                    <b>{user.name}</b>
                                  </td>
                                  <td>{user.password}</td>
                                  <td>
                                    <a
                                      href="#"
                                      style={{
                                        backgroundColor:
                                          user.isAdmin == false
                                            ? "#088dcd"
                                            : "#f16868",
                                      }}
                                      onClick={() => {
                                        setGroupPopup(true);
                                        setAlumiId(user.id);
                                      }}
                                      className="btn-setAdmin"
                                    >
                                      {user.isAdmin == false
                                        ? "Đặt"
                                        : "Hủy Đặt"}{" "}
                                    </a>
                                  </td>
                                  <td>
                                    <span className="iconbox button soft-danger">
                                      <i className="icofont-trash" />
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </li>
                      <li>
                        <div className="total-sales">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="earning-box">
                                <span>
                                  Sales earnings this month (October), after
                                  associated author fees, &amp; before taxes:
                                </span>
                                <h5>$330.29</h5>
                                <h6>Net Sales</h6>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="earning-box">
                                <span>
                                  Total value of your sales, with associated
                                  author fees, before taxes:
                                </span>
                                <h5>$660.60</h5>
                                <h6>Gross Sales</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-widget mt-4">
                          <div className="d-widget-title">
                            <h5>Your Sales By Countries</h5>
                          </div>
                          <table className="table top-countries table-default table-striped">
                            <thead>
                              <tr>
                                <th>Countries</th>
                                <th>Item Sales</th>
                                <th>This Month</th>
                                <th>Last Month</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <figure>
                                    <img
                                      src="images/flags/001-united-kingdom.png"
                                      alt=""
                                    />
                                  </figure>{" "}
                                  <span>England</span>
                                </td>
                                <td>$20</td>
                                <td>$40</td>
                                <td>$120</td>
                                <td>$1220</td>
                              </tr>
                              <tr>
                                <td>
                                  <figure>
                                    <img
                                      src="images/flags/002-united-states.png"
                                      alt=""
                                    />
                                  </figure>{" "}
                                  <span>United States</span>
                                </td>
                                <td>$40</td>
                                <td>$40</td>
                                <td>$120</td>
                                <td>$1220</td>
                              </tr>
                              <tr>
                                <td>
                                  <figure>
                                    <img
                                      src="images/flags/003-france.png"
                                      alt=""
                                    />
                                  </figure>{" "}
                                  <span>France</span>
                                </td>
                                <td>$40</td>
                                <td>$60</td>
                                <td>$30</td>
                                <td>$120</td>
                              </tr>
                              <tr>
                                <td>
                                  <figure>
                                    <img
                                      src="images/flags/004-germany.png"
                                      alt=""
                                    />
                                  </figure>{" "}
                                  <span>Germany</span>
                                </td>
                                <td>$150</td>
                                <td>$200</td>
                                <td>$2770</td>
                                <td>$8720</td>
                              </tr>
                              <tr>
                                <td>
                                  <figure>
                                    <img
                                      src="images/flags/005-spain.png"
                                      alt=""
                                    />
                                  </figure>{" "}
                                  <span>Spain</span>
                                </td>
                                <td>$130</td>
                                <td>$640</td>
                                <td>$820</td>
                                <td>$2210</td>
                              </tr>
                              <tr>
                                <td>
                                  <figure>
                                    <img
                                      src="images/flags/006-china.png"
                                      alt=""
                                    />
                                  </figure>{" "}
                                  <span>China</span>
                                </td>
                                <td>$12</td>
                                <td>$654</td>
                                <td>$7798</td>
                                <td>$9920</td>
                              </tr>
                              <tr>
                                <td>
                                  <figure>
                                    <img
                                      src="images/flags/007-italy.png"
                                      alt=""
                                    />
                                  </figure>{" "}
                                  <span>Italy</span>
                                </td>
                                <td>$987</td>
                                <td>$232</td>
                                <td>$567</td>
                                <td>$9862</td>
                              </tr>
                              <tr>
                                <td>
                                  <figure>
                                    <img
                                      src="images/flags/008-japan.png"
                                      alt=""
                                    />
                                  </figure>{" "}
                                  <span>Japan</span>
                                </td>
                                <td>$486</td>
                                <td>$239</td>
                                <td>$233</td>
                                <td>$1520</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </li>
                      <li>
                        <div className="uk-width">
                          <div className="setting-card">
                            <h2>Notification</h2>
                            <p className="mb-4">
                              Notifications - Choose when and how to be
                              notified.
                            </p>
                            <h6>Choose when and how to be notified</h6>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch1"
                              />
                              <label className="switch" htmlFor="switch1" />
                              <i className="icofont-substitute" />{" "}
                              <span>Subscriptions</span>
                              <p>
                                Notify me about activity from the profiles I'm
                                subscribed to
                              </p>
                            </div>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch2"
                              />
                              <label className="switch" htmlFor="switch2" />
                              <i className="icofont-at" />{" "}
                              <span>Recommended Researches </span>
                              <p>
                                Notify me of courses I might like based on what
                                I watch
                              </p>
                            </div>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch3"
                              />
                              <label className="switch" htmlFor="switch3" />
                              <i className="icofont-comment" />{" "}
                              <span> Active Comments</span>
                              <p>
                                Notify me about activity on my comments on
                                others’ courses
                              </p>
                            </div>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch4"
                              />
                              <label className="switch" htmlFor="switch4" />
                              <i className="icofont-reply" />{" "}
                              <span>Reply to My comments </span>
                              <p>Notify me about replies to my comments</p>
                            </div>
                            <h6>Email Notifications</h6>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch5"
                              />
                              <label className="switch" htmlFor="switch5" />
                              <i className="icofont-email" />{" "}
                              <span>
                                Send me Emails about akedimc activity and
                                updates
                              </span>
                              <p>
                                If this setting is turned off, socimo may still
                                send you messages regarding your account,
                                required service announcements, legal
                                notifications, and privacy matters
                              </p>
                            </div>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch6"
                              />
                              <label className="switch" htmlFor="switch6" />
                              <i className="icofont-foot-print" />{" "}
                              <span>
                                Promotional and helpful Recommendations
                              </span>
                              <p>
                                Send me any promotional and recommendation email
                                from akedemic
                              </p>
                            </div>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch7"
                              />
                              <label className="switch" htmlFor="switch7" />
                              <i className="-stock" />{" "}
                              <span>Show your profile on search engine.</span>
                              <p>
                                If this setting is turned off, socimo may still
                                send you messages regarding your account,
                                required service announcements, legal
                                notifications, and privacy matters
                              </p>
                            </div>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch8"
                              />
                              <label className="switch" htmlFor="switch8" />
                              <i className="icofont-users-social" />{" "}
                              <span>Show Your followers on your timeline.</span>
                              <p>
                                Send me any promotional and recommendation email
                                from akedemic
                              </p>
                            </div>
                            <div className="seting-mode">
                              <input
                                type="checkbox"
                                hidden="hidden"
                                id="switch9"
                              />
                              <label className="switch" htmlFor="switch9" />
                              <i className="icofont-read-book-alt" />{" "}
                              <span>Show your courses and researches. </span>
                              <p>
                                Send me any promotional and recommendation email
                                from akedemic
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* main content */}
        {groupPopup == true ? (
          <div className={`popup-wraper ${groupPopup == true ? "active" : ""}`}>
            <div className="popup">
              <span
                className="popup-closed"
                onClick={() => setGroupPopup(false)}
              >
                <i className="icofont-close" />
              </span>
              <div className="popup-meta">
                <div className="popup-head">
                  <h5>
                    <i className="icofont-ui-user-group" /> Danh sách nhóm
                  </h5>
                </div>
                <div className="send-message">
                  <Groups alumiId={alumiId} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* send message popup */}
        <div className="side-slide">
          <span className="popup-closed">
            <i className="icofont-close" />
          </span>
          <div className="slide-meta">
            <ul className="nav nav-tabs slide-btns">
              <li className="nav-item">
                <a className="active" href="#messages" data-toggle="tab">
                  Messages
                </a>
              </li>
              <li className="nav-item">
                <a className href="#notifications" data-toggle="tab">
                  Notifications
                </a>
              </li>
            </ul>
            {/* Tab panes */}
            <div className="tab-content">
              <div className="tab-pane active fade show" id="messages">
                <h4>
                  <i className="icofont-envelope" /> messages
                </h4>
                <a
                  href="#"
                  className="send-mesg"
                  title="New Message"
                  data-toggle="tooltip"
                >
                  <i className="icofont-edit" />
                </a>
                <ul className="new-messages">
                  <li>
                    <figure>
                      <img src="images/resources/user1.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Ibrahim Ahmed</span>
                      <a href="#" title>
                        Helo dear i wanna talk to you
                      </a>
                    </div>
                  </li>
                  <li>
                    <figure>
                      <img src="images/resources/user2.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Fatima J.</span>
                      <a href="#" title>
                        Helo dear i wanna talk to you
                      </a>
                    </div>
                  </li>
                  <li>
                    <figure>
                      <img src="images/resources/user3.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Fawad Ahmed</span>
                      <a href="#" title>
                        Helo dear i wanna talk to you
                      </a>
                    </div>
                  </li>
                  <li>
                    <figure>
                      <img src="images/resources/user4.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Saim Turan</span>
                      <a href="#" title>
                        Helo dear i wanna talk to you
                      </a>
                    </div>
                  </li>
                  <li>
                    <figure>
                      <img src="images/resources/user5.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Alis wells</span>
                      <a href="#" title>
                        Helo dear i wanna talk to you
                      </a>
                    </div>
                  </li>
                </ul>
                <a href="#" title className="main-btn" data-ripple>
                  view all
                </a>
              </div>
              <div className="tab-pane fade" id="notifications">
                <h4>
                  <i className="icofont-bell-alt" /> notifications
                </h4>
                <ul className="notificationz">
                  <li>
                    <figure>
                      <img src="images/resources/user5.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Alis wells</span>
                      <a href="#" title>
                        recommend your post
                      </a>
                    </div>
                  </li>
                  <li>
                    <figure>
                      <img src="images/resources/user4.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Alis wells</span>
                      <a href="#" title>
                        share your post <strong>a good time today!</strong>
                      </a>
                    </div>
                  </li>
                  <li>
                    <figure>
                      <img src="images/resources/user2.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Alis wells</span>
                      <a href="#" title>
                        recommend your post
                      </a>
                    </div>
                  </li>
                  <li>
                    <figure>
                      <img src="images/resources/user1.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Alis wells</span>
                      <a href="#" title>
                        share your post <strong>a good time today!</strong>
                      </a>
                    </div>
                  </li>
                  <li>
                    <figure>
                      <img src="images/resources/user3.jpg" alt="" />
                    </figure>
                    <div className="mesg-info">
                      <span>Alis wells</span>
                      <a href="#" title>
                        recommend your post
                      </a>
                    </div>
                  </li>
                </ul>
                <a href="#" title className="main-btn" data-ripple>
                  view all
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* side slide message & popup */}
      </div>
    </div>
  );
}
