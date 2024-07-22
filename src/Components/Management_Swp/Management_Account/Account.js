import axios from "axios";
import React, { useEffect, useState } from "react";
import SideBar from "../../Sidebar/SideBar";
import { Country } from "../../Country";
import Loader from "../../Loader";

export default function Group() {
  const [groups, setGroups] = useState([]);
  const [schools, setSchools] = useState([]);
  const [stateAdd, setStateAdd] = useState("Create");
  const [schoolEdit, setSchoolEdit] = useState(-1);
  const [imgNotSave, setImgNotSave] = useState([]);
  const [groupRecent, setGroupRecent] = useState({});
  const [deleteGroupId, setDeleteGroupId] = useState(-1);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 20;
  const [loader, setLoader] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      await getAllSchool();
      await getAllGroups();
    };

    fetchData();
  }, [pageIndex]);

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
  const txtFirstName = document.getElementById("txtFirstName");
  const txtLastName = document.getElementById("txtLastName");
  const txtEmail = document.getElementById("txtEmail");
  const txtPassword = document.getElementById("txtPassword");
  const txtAddress = document.getElementById("txtAddress");
  const txtPhoneNumber = document.getElementById("txtPhoneNumber");

  // Kiểm tra sự tồn tại của các phần tử
  if (!txtFirstName || !txtLastName || !txtEmail || !txtPassword || !txtAddress || !txtPhoneNumber) {
      alert("Có lỗi xảy ra: Một hoặc nhiều phần tử không tồn tại trong DOM.");
      return;
  }

  // Kiểm tra dữ liệu đầu vào
  console.log({
      FirstName: txtFirstName.value,
      LastName: txtLastName.value,
      Email: txtEmail.value,
      Password: txtPassword.value,
      Address: txtAddress.value,
      PhoneNumber: txtPhoneNumber.value
  });

  try {
      const formData = new FormData();
      formData.append('FirstName', txtFirstName.value);
      formData.append('LastName', txtLastName.value);
      formData.append('Email', txtEmail.value);
      formData.append('Password', txtPassword.value);
      formData.append('Address', txtAddress.value);
      formData.append('PhoneNumber', txtPhoneNumber.value);

      // Kiểm tra nội dung của FormData
      for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axios.post(
          "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Account/createstaffaccount",
          formData,
          {
              headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: "Bearer " + localStorage.authorization,
              }
          }
      );

      if (response.status === 200) {
          await getAllGroups();

          alert("Tạo Staff thành công");
          setStateAdd("Create");

          // Reset giá trị các ô input
          txtFirstName.value = "";
          txtLastName.value = "";
          txtEmail.value = "";
          txtPassword.value = "";
          txtAddress.value = "";
          txtPhoneNumber.value = "";

          // Remove active class
          const elementTest = document.getElementById("post-new");
          if (elementTest) {
              elementTest.classList.remove("active");
          }
      }
  } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      alert("Có lỗi xảy ra khi tạo Staff. Vui lòng kiểm tra dữ liệu và thử lại.");
  }
};



  const updateGroup = async () => {
    if (
      document.getElementById("txtSelectCountry").value != "Chọn trường" &&
      document.getElementById("txtSelectSchoolYear").value != ""
    ) {
      let avtImg = null;
      let bgImg = null;

      for (let i = 0; i < imgNotSave.length; i++) {
        if (imgNotSave[i].type == "avatar") {
          avtImg = await saveImgInImgBB(imgNotSave[i].img);
        } else {
          bgImg = await saveImgInImgBB(imgNotSave[i].img);
        }
      }

      if (avtImg == null) {
        avtImg = groupRecent.avataImg;
      }
      if (bgImg == null) {
        bgImg = groupRecent.backgroundImg;
      }
      try {
        const data = {
          name: document.getElementById("txtName").value,
          schoolYearId: document.getElementById("txtSelectSchoolYear").value,
          policy: document.getElementById("txtPolicy").value,
          backgroundImg: bgImg,
          avataImg: avtImg,
          description: document.getElementById("txtDesciption").value,
          info: document.getElementById("txtInfomation").value,
          groupAdminId:
            groupRecent.groupAdminId != null ? groupRecent.groupAdminId : null,
        };
        const response = await axios.put(
          `https://truongxuaapp.online/api/v1/groups?id=${groupRecent.id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.authorization,
            },
          }
        );
        if (response.status === 200) {
          await getAllGroups();
          alert("Cập nhập nhóm thành công ");
          setImgNotSave([]);
          setStateAdd("Create");
          document.getElementById("txtName").value = "";
          document.getElementById("txtDesciption").value = "";
          var elementTest = document.getElementById("post-new");
          elementTest.classList.remove("active");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Chọn trường và niên khóa phù hợp");
    }
  };
  const getGroupRecent = async (id) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/groups/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setGroupRecent(response.data);
        document.getElementById("txtName").value = response.data.name;
        document.getElementById("txtDesciption").value =
          response.data.description;
          document.getElementById("txtSelectCountry").value = response.data.nation;
        setSchoolEdit(id);
         getAllSchool();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getSchoolIdBySchoolYearId = async (schoolYearId) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/schools/schoolyears/${schoolYearId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        return response.data.schoolId;
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
        console.log(response.data.data.display_url);
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
  const getAllSchool = () => {
    setSchools(Country);
  };
  const renderAllSchool = (selectIndex) => {
    return schools.map((element, index) => {
      if (selectIndex == undefined) {
        return (
          <option value={element.id} key={index}>
            {element.name}
          </option>
        );
      } else {
        if (selectIndex == element.id) {
          return (
            <option value={element.id} key={index} selected>
              {element.name}
            </option>
          );
        } else {
          return (
            <option value={element.id} key={index}>
              {element.name}
            </option>
          );
        }
      }
    });
  };
  const onChangeSelect = async (event) => {
  };
 
  //   try {
  //     const response = await axios.get(
  //       "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Account/GetAllUser",
        
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + localStorage.authorization,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       setGroups(response.data.data);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  
  const getAllGroups = async (pageSize = 10, pageIndex = 1) => {
    try {
      const formData = new FormData();
          formData.append('pageNumber', 1);  
          formData.append('pageSize', pageSize); 
      const response = await axios.post(
        `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Account/GetAllUser`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setGroups(response.data.data);
        setLoader(false)
        
      }
    } catch (err) {
      console.error(err);
    }
  };




  
  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    setPageIndex(pageIndex + 1);
  };
  
  const getImageByPostId = async (postId) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/images/postid?postId=${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        for (let i = 0; i < response.data.length; i++) {
          await deleteImageInPost(response.data[i].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const deleteImageInPost = async (idImage) => {
    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/images/${idImage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };
  const getCommentByPostId = async (postId) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/posts/comments/postid?postId=${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        for (let i = 0; i < response.data.length; i++) {
          await deleteCommentInPost(response.data[i].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const deleteCommentInPost = async (idComment) => {
    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/posts/comments/${idComment}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAGroup = async (idGroup) => {
    
    try {

      const formData = new FormData();
      formData.append("Id", idGroup);
      const response = await axios.post(
        'http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Account/LockAccount',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem('authorization'),
          },
        }
      );
  
      if (response.status === 200) {
        document.getElementById("delete-post").classList.remove("active");
        alert("Khóa tài khoản thành công");
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
          <td>{element.email}</td>
          <td>{element.lastName}</td>
          <td>{element.address}</td>
          <td>{element.role}</td>
          <td>{element.lockoutEnabled ? "Đang hoạt động" : "Bị Khóa"}</td>
          <td>
            <div
              onClick={() => {
                var elementTest = document.getElementById("delete-post");
                elementTest.classList.add("active");
                setDeleteGroupId(element.id);
                
                console.log(element.id)
              }}
              style={{
                marginBottom: 10,
              }}
              className="button soft-danger"
            >
              <i className="icofont-pen-alt-1" />
            </div>
            {/* <div
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
            </div> */}
          </td>
        </tr>
      );
    });
  };
  return (
    <div className="theme-layout">
      {loader && <Loader />}
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
                <h4>All Account.</h4>
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
                    All Account
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
              <h4 className="main-title">Danh Sách người dùng trên hệ thống</h4>
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
                Tạo tài khoản Staff
              </button>

             
              <div className="row merged20 mb-4">
      <div className="col-lg-12">
        <div className="d-widget">
          <div className="d-widget-title">
            <h5>Thông tin</h5>
          </div>
          <table className="table table-default all-events table-striped table-responsive-lg">
            <thead>
              <tr>
                <th>STT</th>
                <th>Email</th>
                <th>Tên</th>
                <th>Sđt</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th>Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>{renderAllGroups()}</tbody>
          </table>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={pageIndex === 1}>
              Previous
            </button>
            <span>Page {pageIndex}</span>
            <button onClick={handleNextPage}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>





              <div className="row merged20 mb-4">
                <div className="col-lg-6">
                  <div className="d-widget">
                   
                   
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

              document.getElementById("txtFirstName").value = "";
              document.getElementById("txtLastName").value = "";
              document.getElementById("txtEmail").value = "";
              document.getElementById("txtPassword").value = "";
              document.getElementById("txtAddress").value = "";
              document.getElementById("txtPhoneNumber").value = "";

              
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
                 {stateAdd == "Create" ? "Tạo tài khoản Staff" : "Cập nhật tài khoản Staff"}
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
                  Tên:{" "}
                </p>
                <input
                  required
                  placeholder="Nhập tên"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtFirstName"
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
                  Họ:{" "}
                </p>
                <input
                  required
                  placeholder="Nhập họ"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtLastName"
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
                  Email:{" "}
                </p>
                <input
                  required
                  placeholder="Nhập email:"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtEmail"
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
                  Mật khẩu:{" "}
                </p>
                <input
                  required
                  placeholder="Nhập mật khẩu"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtPassword"
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
                  placeholder="Nhập địa chỉ:"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtAddress"
                />
              </div>






              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
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
                  placeholder="Nhập số điện thoại:"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtPhoneNumber"
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
                {stateAdd == "Create" ? "Tạo tài khoản Staff" : "Cập nhật tài khoản Staff"}
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
                  Bạn có chắn muốn khoá tài khoản này ?
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
               Khóa 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
