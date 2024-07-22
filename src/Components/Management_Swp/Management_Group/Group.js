import axios from "axios";
import React, { useEffect, useState } from "react";
import SideBar from "../../Sidebar/SideBar";
import { Country } from "../../Country";

export default function Group() {
  const [groups, setGroups] = useState([]);
  const [schools, setSchools] = useState([]);
  const [stateAdd, setStateAdd] = useState("Create");
  const [schoolEdit, setSchoolEdit] = useState(-1);
  const [imgNotSave, setImgNotSave] = useState([]);
  const [groupRecent, setGroupRecent] = useState({});
  const [deleteGroupId, setDeleteGroupId] = useState(-1);

  useEffect(async () => {
    await getAllSchool();
    await getAllGroups();
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDeleteImage = () => {
    setSelectedFile(null);
    URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    document.getElementById("txtImage").value = "";
  };

  const clickToUpdate = async (id) => {
    await getGroupRecent(id);
  };
  const changeSubmit = async (event) => {
    event.preventDefault();
    if (stateAdd == "Create") {
      await addGroup();
    } else {
      await updateGroup();
    }
  };
  const addGroup = async () => {
    if (document.getElementById("txtSelectCountry").value != "Chọn quốc gia") {
      try {
        const data = {
          Name: document.getElementById("txtName").value,
          Description: document.getElementById("txtDesciption").value,
          Nation: document.getElementById("txtSelectCountry").value,
        };
        const formData = new FormData();
        formData.append("Name", document.getElementById("txtName").value);
        formData.append(
          "Description",
          document.getElementById("txtDesciption").value
        );
        formData.append(
          "Nation",
          document.getElementById("txtSelectCountry").value
        );
        formData.append("Path", document.getElementById("txtLink").value);
        const imageInput = document.getElementById("txtImage");
        if (imageInput.files.length > 0) {
          formData.append("Image", imageInput.files[0]);
        }
        const response = await axios.post(
          "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Company/AddCompany",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.authorization,
            },
          }
        );
        if (response.status === 200) {
          await getAllGroups();
          alert("Tạo công ty thành công");
          setStateAdd("Create");
          document.getElementById("txtName").value = "";
          document.getElementById("txtDesciption").value = "";
          document.getElementById("txtLink").value = "";
          document.getElementById("txtImage").value = "";
          var elementTest = document.getElementById("post-new");
          handleDeleteImage();
          elementTest.classList.remove("active");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Có lỗi rồi");
    }
  };
  const updateGroup = async () => {
    if (document.getElementById("txtSelectCountry").value != "Chọn sản phẩm") {
      try {
        const formData = new FormData();
        formData.append("Id", schoolEdit);
        formData.append("Name", document.getElementById("txtName").value);
        formData.append(
          "Description",
          document.getElementById("txtDesciption").value
        );
        formData.append(
          "Nation",
          document.getElementById("txtSelectCountry").value
        );
        formData.append("Path", document.getElementById("txtLink").value);
        const imageInput = document.getElementById("txtImage");
        if (imageInput.files.length > 0) {
          formData.append("Image", imageInput.files[0]);
        }
        const response = await axios.put(
          `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Company/UpdateCompany`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.authorization,
            },
          }
        );
        if (response.status === 200) {
          await getAllGroups();
          alert("Cập nhập công ty thành công ");
          handleDeleteImage();
          setStateAdd("Create");
          document.getElementById("txtName").value = "";
          document.getElementById("txtDesciption").value = "";
          document.getElementById("txtSelectCountry").value = "";
          var elementTest = document.getElementById("post-new");
          elementTest.classList.remove("active");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Chọn quốc gia");
    }
  };
  const getGroupRecent = async (id) => {
    try {
      const response = await axios.get(
        `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Company/GetById?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setGroupRecent(response.data);
        document.getElementById("txtName").value = response.data.company.name;
        document.getElementById("txtDesciption").value =
          response.data.company.description;
        document.getElementById("txtSelectCountry").value =
          response.data.company.nation;
        document.getElementById("txtLink").value = response.data.company.path;
        setPreviewUrl(
          `data:image/png;base64, ${response.data.company.image.content}`
        );
        setSchoolEdit(response.data.company.nation);
        getAllSchool();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getAllSchool = () => {
    setSchools(Country);
  };
  const renderAllSchool = (selectIndex) => {
    return schools.map((element, index) => {
      if (selectIndex == undefined) {
        return (
          <option value={element.name} key={index}>
            {element.name}
          </option>
        );
      } else {
        if (selectIndex == element.name) {
          return (
            <option value={element.name} key={index} selected>
              {element.name}
            </option>
          );
        } else {
          return (
            <option value={element.name} key={index}>
              {element.name}
            </option>
          );
        }
      }
    });
  };
  const onChangeSelect = async (event) => {};
  const getAllGroups = async () => {
    try {
      const response = await axios.get(
        "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Company/GetAllCompany",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setGroups(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
 
  

  const deleteAGroup = async (idGroup) => {
    try {
      const response = await axios.delete(
        `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Company/DeleteCompany?id=${idGroup}`
      );
      if (response.status === 200) {
        document.getElementById("delete-post").classList.remove("active");
        alert("Xóa thành công công ty này");
        await getAllGroups();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const renderAllGroups = () => {
    return groups.map((element, index) => {
      return (
        <tr key={index}>
          <td>{index+1}</td>
          <td>{element.name}</td>
          <td className="text-success">{element.description}</td>
          <td>{element.nation}</td>
          <td>{element.path}</td>
          <td>
            {" "}
            {element.image && (
              <img
                src={`data:image/png;base64, ${element.image.content}`}
                alt="Product Image"
                style={{ width: "50px", height: "50px" }} // Adjust the width and height as needed
              />
            )}
          </td>
          <td>
            <div
              onClick={() => {
                var elementTest = document.getElementById("delete-post");
                elementTest.classList.add("active");
                setDeleteGroupId(element.id);
              }}
              style={{
                marginBottom: 10,
              }}
              className="button soft-danger"
            >
              <i className="icofont-trash" />
            </div>
            <div
              onClick={() => {
                var elementTest = document.getElementById("post-new");
                elementTest.classList.add("active");
                setStateAdd("Update");
                setSchools([]);
                clickToUpdate(element.id);
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
                <h4>All Company.</h4>
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
                    All Company
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
              <h4 className="main-title">Quản lý công ty</h4>
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
                Tạo Công ty
              </button>
              <div className="row merged20 mb-4">
                <div className="col-lg-12">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Tất cả các công ty</h5>
                    </div>
                    <table className="table table-default all-events table-striped table-responsive-lg">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tên công ty</th>
                          <th>Mô Tả</th>
                          <th>Quốc Gia</th>
                          <th>Link</th>
                          <th>Hình ảnh</th>
                          <th>Chỉnh sửa</th>
                        </tr>
                      </thead>
                      <tbody>{renderAllGroups()}</tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row merged20 mb-4">
                <div className="col-lg-6"></div>
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
        <div
          className="popup"
          style={{ width: "800px", overflowY: "scroll" }}
        >
          <span
            onClick={() => {
              var element = document.getElementById("post-new");
              element.classList.remove("active");
              setStateAdd("Create");
              document.getElementById("txtName").value = "";
              document.getElementById("txtDesciption").value = "";
              handleDeleteImage();
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
                  Tạo công ty
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
                  Chọn quốc gia:{" "}
                </p>
                <select
                  onChange={onChangeSelect}
                  id="txtSelectCountry"
                  style={{
                    padding: 10,
                    width: "30%",
                    marginRight: 10,
                  }}
                >
                  <option>Chọn quốc gia</option>
                  {stateAdd == "Create"
                    ? renderAllSchool()
                    : renderAllSchool(schoolEdit)}
                </select>
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
                  Tên công ty:{" "}
                </p>
                <input
                  required
                  placeholder="Tên của công ty"
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
              ></div>
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
                  Đường dẫn:{" "}
                </p>
                <input
                  required
                  placeholder="Mô tả của nhóm"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtLink"
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
                  placeholder="Mô tả của nhóm"
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
                <p style={{ fontSize: 20, fontWeight: 700, width: "20%" }}>
                  Hình ảnh:{" "}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  required
                  style={{ width: "100%", padding: 10 }}
                  id="txtImage"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    handleFileChange(e);
                    // Xử lý tệp hình ảnh ở đây
                  }}
                />
              </div>
              <div className="page-break"></div>
              {previewUrl && (
                <div style={{ position: "relative" }}>
                  {stateAdd == "Create" && (
                    <button
                      style={{
                        position: "absolute",
                        top: "5px",
                        left: "200px",
                        zIndex: "10",
                      }}
                      onClick={handleDeleteImage}
                    >
                      X
                    </button>
                  )}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "150px" }}
                  />
                </div>
              )}
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
                {stateAdd == "Create" ? "Tạo Công Ty" : "Cập nhật"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div id="delete-post" className="post-new-popup">
        <div className="popup" style={{ width: "800px" }}>
          <span
            onClick={() => {
              var element = document.getElementById("delete-post");
              element.classList.remove("active");
            }}
            className="popup-closed"
          >
            <i className="icofont-close" />
          </span>
          <div className="popup-meta">
            <div className="popup-head">
              <h5>
                <p
                  style={{
                    fontSize: 18,
                  }}
                  id="popup-head-name"
                >
                  Bạn có chắn muốn xóa công ty này ?
                </p>
              </h5>
            </div>
            <div className="post-new">
              <button
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingRight: 20,
                  paddingLeft: 20,

                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#EFEFEF",
                  float: "right",
                  marginLeft: 10,
                }}
                onClick={() => {
                  var element = document.getElementById("delete-post");
                  element.classList.remove("active");
                }}
              >
                Hủy
              </button>
              <button
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingRight: 20,
                  paddingLeft: 20,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "red",
                  backgroundColor: "red",
                  float: "right",
                }}
                onClick={() => deleteAGroup(deleteGroupId)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
