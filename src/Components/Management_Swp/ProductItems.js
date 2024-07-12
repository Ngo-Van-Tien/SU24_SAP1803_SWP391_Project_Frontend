import axios from "axios";
import React, { useState, useEffect } from "react";
import SideBar from "../Sidebar/SideBar";

export default function Schools() {
  const [school, setSchools] = useState([]);
  const [stateAdd, setStateAdd] = useState("Create");
  const [schoolRecent, setSchoolRecent] = useState([]);
  const [imgNotSave, setImgNotSave] = useState({});
  

  useEffect(async () => {
    await getAllSchool();
    
  }, []);
  const changeSubmit = async (event) => {
    event.preventDefault();
    if (stateAdd == "Create") {
      await addNewSchool();
    } else {
      await updateSchool();
    }
  };
  const upImgInState = async (e) => {
    setImgNotSave(e.target.files[0]);
    if (stateAdd == "Update") {
      document.getElementById("txtUpdateCover").src = URL.createObjectURL(
        e.target.files[0]
      );
    }
  };
  const getAllSchool = async () => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/schools?pageNumber=1&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        //console.log(response.data);
        setSchools(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const clickToUpdate = async (id) => {
    await getSchoolRecent(id);
  };
  const getSchoolRecent = async (idSchool) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/schools/${idSchool}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setSchoolRecent(response.data);
        document.getElementById("txtName").value = response.data.name;
        document.getElementById("txtPhone").value = response.data.phone;
        document.getElementById("txtDesciption").value =
          response.data.description;
        document.getElementById("txtWebsite").value = response.data.website;
        document.getElementById("txtHeadmaster").value =
          response.data.headmaster;
        document.getElementById("txtAddress").value = response.data.address;
        document.getElementById("txtUpdateCover").src = response.data.image;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const saveImgInImgBB = async (img) => {
    let body = new FormData();
    body.set("key", "71b6c3846105c92074f8e9a49b85887f");
    body.append("image", img);
    try {
      const response = await axios({
        method: "POST",
        url: "https://api.imgbb.com/1/upload",
        data: body,
      });
      if (response.status == 200) {
        //console.log(response.data.data.display_url);
        return response.data.data.display_url;
        // dataImgSave = {
        //   name: response.data.data.title,
        //   url_display: response.data.data.display_url,
        // };
        // return dataImgSave.url_display;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const addNewSchool = async () => {
    let imgBB = await saveImgInImgBB(imgNotSave);
    console.log(imgBB);
    try {
      const data = {
        name: document.getElementById("txtName").value,
        description: document.getElementById("txtDesciption").value,
        image: imgBB,
        phone: document.getElementById("txtPhone").value,
        address: document.getElementById("txtAddress").value,
        website: document.getElementById("txtWebsite").value,
        headmaster: document.getElementById("txtHeadmaster").value,
      };
      const response = await axios.post(
        "https://truongxuaapp.online/api/v1/schools",
        data,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        document.getElementById("txtName").value = "";
        document.getElementById("txtPhone").value = "";
        document.getElementById("txtDesciption").value = "";
        document.getElementById("txtWebsite").value = "";
        document.getElementById("txtHeadmaster").value = "";
        document.getElementById("txtAddress").value = "";
        document.getElementById("txtAvaSchool").value = "";
        setStateAdd("Create");
        setImgNotSave([]);
        await getAllSchool();
        alert("Tạo trường thành công ");
        var elementTest = document.getElementById("post-new");
        elementTest.classList.remove("active");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const updateSchool = async () => {
    let imgBB = null;
    imgBB = await saveImgInImgBB(imgNotSave);
    if (imgBB == null) {
      imgBB = schoolRecent.image;
    }
    try {
      const data = {
        name: document.getElementById("txtName").value,
        description: document.getElementById("txtDesciption").value,
        image: imgBB,
        phone: document.getElementById("txtPhone").value,
        address: document.getElementById("txtAddress").value,
        website: document.getElementById("txtWebsite").value,
        headmaster: document.getElementById("txtHeadmaster").value,
      };
      const response = await axios.put(
        `https://truongxuaapp.online/api/v1/schools?id=${schoolRecent.id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        document.getElementById("txtName").value = "";
        document.getElementById("txtPhone").value = "";
        document.getElementById("txtDesciption").value = "";
        document.getElementById("txtWebsite").value = "";
        document.getElementById("txtHeadmaster").value = "";
        document.getElementById("txtAddress").value = "";
        document.getElementById("txtAvaSchool").value = "";
        setStateAdd("Create");
        setImgNotSave([]);
        await getAllSchool();

        alert("Cập nhật trường thành công");
        var elementTest = document.getElementById("post-new");
        elementTest.classList.remove("active");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const renderSchools = () => {
    return school.map((element, index) => {
      return (
        <tr key={index}>
          <td>{element.id}</td>
          <td>{element.name}</td>
          <td>{element.description}</td>
          <td>{element.phone}</td>
          <td>{element.address}</td>
          <td>
            <a href="#" title>
              {element.website}
            </a>
          </td>
          <td> {element.headmaster}</td>
          <td>
            <img
              style={{
                width: 150,
                height: 100,
              }}
              src={element.image}
              alt=""
            />
          </td>
          <td>
            <div
              style={{
                marginBottom: 16,
              }}
              className="button soft-danger"
            >
              <i className="icofont-trash" />
            </div>
            <div
              onClick={() => {
                clickToUpdate(element.id);
                setStateAdd("Update");
                var elementTest = document.getElementById("post-new");
                elementTest.classList.add("active");
              }}
              className="button soft-primary"
            >
              <i className="icofont-pen-alt-1" />
            </div>
          </td>
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
            <input type="text" placeholder="Search..." />
          </form>
        </div>
      </div>
      {/* responsive header */}
      <header className>
        <div className="topbar stick">
          <div className="logo">
            <img alt="" src="images/logo.png" />
            <span>Socimo</span>
          </div>
          <div className="searches">
            <form method="post">
              <input type="text" placeholder="Search..." />
              <button type="submit">
                <i className="icofont-search" />
              </button>
            </form>
          </div>
          <ul className="web-elements">
            <li>
              <div className="user-dp">
                <a href="profile-page2.html" title>
                  <img src="images/resources/user.jpg" alt="" />
                  <div className="name">
                    <h4>Danial Cardos</h4>
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
                <h4>Trường</h4>
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
                    All Events
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
              <h4 className="main-title">Quản lý Sữa</h4>
              <div className="row merged20 mb-4">
                <div className="col-lg-3 col-md-6">
                  <div className="d-widget">
                    <div className="event-stat">
                      <i>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-calendar"
                        >
                          <rect
                            x={3}
                            y={4}
                            width={18}
                            height={18}
                            rx={2}
                            ry={2}
                          />
                          <line x1={16} y1={2} x2={16} y2={6} />
                          <line x1={8} y1={2} x2={8} y2={6} />
                          <line x1={3} y1={10} x2={21} y2={10} />
                        </svg>
                      </i>
                      <div className="event-figure">
                        <h5>{school.length}</h5>
                        <span>Kho sữa</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 ">
                  <div className="d-widget">
                    <div className="event-stat">
                      <i>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-users"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx={9} cy={7} r={4} />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </i>
                      <div className="event-figure">
                        <h5>10</h5>
                        <span>Hết Hàng</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="d-widget">
                    <div className="event-stat">
                      <i>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-file"
                        >
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                          <polyline points="13 2 13 9 20 9" />
                        </svg>
                      </i>
                      <div className="event-figure">
                        <h5>41</h5>
                        <span>Số Công Ty</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="d-widget">
                    <div className="event-stat">
                      <i>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-dollar-sign"
                        >
                          <line x1={12} y1={1} x2={12} y2={23} />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </i>
                      <div className="event-figure">
                        <h5>400</h5>
                        <span>Số Thương Hiệu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="main-btn"
                onClick={() => {
                  var element = document.getElementById("post-new");
                  element.classList.add("active");
                }}
                style={{
                  padding: 10,
                  backgroundColor: "#088DCD ",
                  color: "white",
                  borderWidth: 1,
                  borderColor: "#088DCD ",
                  display: "block",
                  marginBottom: 26,
                }}
              >
                Tạo trường
              </button>
              <div className="row merged20 mb-4">
                <div className="col-lg-12">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Tất cả các trường</h5>
                    </div>
                    <table className="table table-default all-events table-striped table-responsive-lg">
                      <thead>
                        <tr>
                          <th>ID#</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Website</th>
                          <th>Headmaster</th>
                          <th>Image</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>{renderSchools()}</tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row merged20 mb-4">
                <div className="col-lg-6">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Events Schedule</h5>
                    </div>
                    <ul className="upcoming-event">
                      <li>
                        <div className="event-date soft-red">
                          <i>24 FEB</i>
                          <span>2021</span>
                        </div>
                        <div className="event-deta">
                          <h5>digital marketing summit</h5>
                          <ul>
                            <li>
                              <i className="icofont-user" /> steve Josef
                            </li>
                            <li>
                              <i className="icofont-map-pins" /> New York City
                            </li>
                            <li>
                              <i className="icofont-clock-time" /> 9:00PM-12AM
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <div className="event-date soft-green">
                          <i>10 MAR</i>
                          <span>2021</span>
                        </div>
                        <div className="event-deta">
                          <h5>digital marketing summit</h5>
                          <ul>
                            <li>
                              <i className="icofont-user" /> steve Josef
                            </li>
                            <li>
                              <i className="icofont-map-pins" /> New York City
                            </li>
                            <li>
                              <i className="icofont-clock-time" /> 9:00PM-12AM
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <div className="event-date soft-blue">
                          <i>20 OCT</i>
                          <span>2021</span>
                        </div>
                        <div className="event-deta">
                          <h5>digital marketing summit</h5>
                          <ul>
                            <li>
                              <i className="icofont-user" /> steve Josef
                            </li>
                            <li>
                              <i className="icofont-map-pins" /> New York City
                            </li>
                            <li>
                              <i className="icofont-clock-time" /> 9:00PM-12AM
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Web Traffic</h5>
                      <select className="browser-default custom-select">
                        <option value={3}>last day</option>
                        <option value={2}>week</option>
                        <option selected>Monthly</option>
                        <option value={1}>Yearly</option>
                      </select>
                    </div>
                    <div className="web-traffic">
                      <div className="chart-legend">
                        <p>Today's visitors</p>
                        <h5>98,300</h5>
                      </div>
                      <div id="hybrid_traffic" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row merged20 mb-4">
                <div className="col-lg-6">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Notice Borad</h5>
                    </div>
                    <div className="d-Notices">
                      <ul>
                        <li>
                          <p>March 21, 2021</p>
                          <h6>
                            <a href="#" title>
                              Mr. William
                            </a>{" "}
                            <span>5 mint ago</span>
                          </h6>
                          <p>
                            invited to join the meeting in the conference room
                            at 9.45 am
                          </p>
                          <div
                            style={{
                              marginBottom: 16,
                            }}
                            className="action-btns"
                          >
                            <div className="button soft-danger" title="ignore">
                              <i className="icofont-trash" />
                            </div>
                            <div className="button soft-primary" title="save">
                              <i className="icofont-star" />
                            </div>
                          </div>
                        </li>
                        <li>
                          <p>Feb 15, 2021</p>
                          <h6>
                            <a href="#" title>
                              Andrew{" "}
                            </a>{" "}
                            <span>35 mint ago</span>
                          </h6>
                          <p>
                            created a group 'Hencework' in the discussion forum
                          </p>
                          <div className="action-btns">
                            <div className="button soft-danger" title="ignore">
                              <i className="icofont-trash" />
                            </div>
                            <div className="button soft-primary" title="save">
                              <i className="icofont-star" />
                            </div>
                          </div>
                        </li>
                        <li>
                          <p>Jan 10, 2021</p>
                          <h6>
                            <a href="#" title>
                              Franklyn J.
                            </a>{" "}
                            <span>40 mint ago</span>
                          </h6>
                          <p>Prepare the conference schedule</p>
                          <div className="action-btns">
                            <div className="button soft-danger" title="ignore">
                              <i className="icofont-trash" />
                            </div>
                            <div className="button soft-primary" title="save">
                              <i className="icofont-star" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Logs</h5>
                    </div>
                    <ul className="recent-log">
                      <li className="hole-circle red-circle">
                        <span>New User Registration</span> <i>23:13</i>
                      </li>
                      <li className="hole-circle blue-circle">
                        <span>New 14 products added.</span> <i>22:10</i>
                      </li>
                      <li className="hole-circle green-circle">
                        <span>New sale: Napole.</span> <i>21:33</i>
                      </li>
                      <li className="hole-circle yellow-circle">
                        <span>New notifications</span> <i>20:40</i>
                      </li>
                      <li className="hole-circle orange-circle">
                        <span>New Comments</span> <i>19:20</i>
                      </li>
                      <li className="hole-circle blue-circle">
                        <span>New sale: souffle.</span> <i>18:00</i>
                      </li>
                      <li className="hole-circle yellow-circle">
                        <span>New notifications</span> <i>20:40</i>
                      </li>
                      <li className="hole-circle red-circle">
                        <span>New User Registration</span> <i>23:13</i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* main content */}
      <div className="popup-wraper">
        <div className="popup">
          <span className="popup-closed">
            <i className="icofont-close" />
          </span>
          <div className="popup-meta">
            <div className="popup-head">
              <h5>
                <i className="icofont-envelope" /> Send Message
              </h5>
            </div>
            <div className="send-message">
              <form method="post" className="c-form">
                <input type="text" placeholder="Enter Name.." />
                <input type="text" placeholder="Subject" />
                <textarea placeholder="Write Message" defaultValue={""} />
                <div className="uploadimage">
                  <i className="icofont-file-jpg" />
                  <label className="fileContainer">
                    <input type="file" />
                    Attach file
                  </label>
                </div>
                <button type="submit" className="main-btn">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
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
      <div id="post-new" className="post-new-popup">
        <div className="popup" style={{ width: "800px" }}>
          <span
            onClick={() => {
              var element = document.getElementById("post-new");
              element.classList.remove("active");
              setStateAdd("Create");
              document.getElementById("txtName").value = "";
              document.getElementById("txtPhone").value = "";
              document.getElementById("txtDesciption").value = "";
              document.getElementById("txtWebsite").value = "";
              document.getElementById("txtHeadmaster").value = "";
              document.getElementById("txtAddress").value = "";
              document.getElementById("txtAvaSchool").value = "";
              //setElementUpdate(undefined);
            }}
            className="popup-closed"
          >
            <i className="icofont-close" />
          </span>
          <div className="popup-meta">
            <div className="popup-head">
              <h5
                style={{
                  textAlign: "center",
                }}
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
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
                <p
                  style={{
                    display: "inline",
                    fontSize: 20,
                  }}
                  id="popup-head-name"
                >
                  Tạo trường
                </p>
              </h5>
            </div>
            <form
              onSubmit={changeSubmit}
              style={{ width: "100%" }}
              className="c-form"
            >
              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Tên trường:{" "}
                </p>
                <input
                  required
                  placeholder="Tên trường"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtName"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  SĐT:{" "}
                </p>
                <input
                  required
                  placeholder="
                  Số điện thoại của trường"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtPhone"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Mô tả:{" "}
                </p>
                <input
                  required
                  placeholder="Mô tả của trường"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtDesciption"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Website:{" "}
                </p>
                <input
                  required
                  placeholder="Website của trường"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtWebsite"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Hiệu trưởng:{" "}
                </p>
                <input
                  required
                  placeholder="Hiệu trưởng của trường"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtHeadmaster"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Địa chỉ:{" "}
                </p>
                <input
                  required
                  placeholder="Địa chỉ của trường"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtAddress"
                />
              </div>

              <div
                //onChange={saveImgCover}
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Ảnh trường:{" "}
                </p>
                {stateAdd == "Update" ? (
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <img
                      style={{
                        width: 120,
                        height: 60,
                        marginRight: 16,
                      }}
                      id="txtUpdateCover"
                      src=""
                    />
                    <i
                      style={{
                        fontSize: 20,
                        position: "absolute",
                        right: 18,
                        top: 3,
                        color: "white",
                      }}
                      class="icofont-close-circled"
                    ></i>
                  </div>
                ) : (
                  ""
                )}
                <input
                  onChange={upImgInState}
                  style={{
                    width: stateAdd == "Create" ? "100%" : "60%",
                    padding: 10,
                  }}
                  id="txtAvaSchool"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                />
              </div>
              <button
                className="main-btn"
                style={{
                  padding: 10,
                  backgroundColor: "#088DCD ",
                  color: "white",
                  borderWidth: 1,
                  borderColor: "#088DCD ",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Tạo nhóm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
