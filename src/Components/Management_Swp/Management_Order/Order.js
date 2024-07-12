import axios from "axios";
import React, { useEffect, useState } from "react";
import SideBar from "../../Sidebar/SideBar";
import ReactDOM from 'react-dom';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Order() {
  const [groups, setGroups] = useState([]);
  const [schools, setSchools] = useState([]);
  const [stateAdd, setStateAdd] = useState("Create");
  const [schoolEdit, setSchoolEdit] = useState(-1);
  const [imgNotSave, setImgNotSave] = useState([]);
  const [groupRecent, setGroupRecent] = useState({});
  const [deleteGroupId, setDeleteGroupId] = useState(-1);
  const history = useHistory()
  useEffect(async () => {
    await getAllSchool();
    await getAllOrder();
  }, []);

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
    if (
      document.getElementById("txtSelectCountry").value != "Chọn công ty"
    ) {
      try {
        const ids = selectedOptionsList.map(option => option.id);
        const formData = new FormData();
        formData.append('Name', document.getElementById("txtName").value);
        formData.append('Description', document.getElementById("txtDesciption").value);
        formData.append('CompanyId', document.getElementById("txtSelectCountry").value);
        selectedOptionsList.forEach((item, index) => {
          formData.append('MilkFunctionIds', item.id);
      });
        
        const response = await axios.post(
          "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/MilkBrand/AddMilkBrand",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.authorization,

            },
          }
        );
        if (response.status === 200) {
          await getAllOrder();
          alert("Tạo thương hiệu thành công");
          setStateAdd("Create");
          document.getElementById("txtName").value = "";
          document.getElementById("txtDesciption").value = "";
          var elementTest = document.getElementById("post-new");
          elementTest.classList.remove("active");
          document.getElementById("txtMilkFunction").value = "";
              setSelectedOption({});
              setSelectedOptionsList([])
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Có lỗi rồi");
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
          await getAllOrder();
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
        await getAllSchool();
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

  const getAllSchool = async () => {
    try {
      const response = await axios.get(
        "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Company/GetAllCompany",
        {
          headers: {
            
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      
      if (response.status === 200) {
        setSchools(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const getAllOrdder = async () => {
    try {
      const response = await axios.get(
        "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/MilkFunction/GetAll",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setMilkFunction(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedOption, setSelectedOption] = useState({});
  const [milkFunction, setMilkFunction] = useState();

    const [selectedOptionsList, setSelectedOptionsList] = useState([]);

    // Handler function to update selected option
    const handleOptionChange = (e) => {
      const selectedOptionId = e.target.value;
      if(selectedOptionId != null){
        const option = milkFunction.find(opt => opt.id === selectedOptionId);
        setSelectedOption(option);
      }
        
    };

    // Handler function for button click
    const handleAddButtonClick = (e) => {
        
        e.preventDefault()     
        if (selectedOption) {
          const option = selectedOptionsList.find(opt => opt.id === selectedOption.id);
          if(option != null) return;
          setSelectedOptionsList([...selectedOptionsList, selectedOption]);
          setSelectedOption('');
      }
    };

    const handleDeleteOption = (e, index) => {
      e.preventDefault()
      const updatedOptions = [...selectedOptionsList];
      updatedOptions.splice(index, 1);
      setSelectedOptionsList(updatedOptions);
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
  const getAllOrder = async () => {
    try {
      const response = await axios.get(
        "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Order/GetAllOrders",
        {
          headers: {
           "Content-Type": "multipart/form-data",
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

  const [brandFunction, setBrandFuction] = useState()
  const [brandFunctions, setBrandFuctions] = useState([])
  const deleteFunction = (index) => {
    const updatedFunctions = [...brandFunctions];
    updatedFunctions.splice(index, 1);
    setBrandFuctions(updatedFunctions);
  };
  const addFunction = (e) => {
    e.preventDefault();
    if (brandFunction != null && brandFunction != "") {
      setBrandFuctions(brandFunctions => [...brandFunctions, brandFunction])
      console.log(brandFunctions)
      console.log(brandFunction)
      setBrandFuction("")
    }
  }

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
      const response = await axios.delete(
        `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/MilkBrand/DeleteMilkBrand?id=${idGroup}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        document.getElementById("delete-post").classList.remove("active");
        alert("Xóa thành công nhóm");
        await getAllOrdder();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const renderAllOrder = () => {
    return groups.map((element, index) => {
      return (
        <tr key={index}>
          <td>{element.id}</td>
          <td>{element.status}</td>
          <td>{element.statusPayment}</td>
          <td>{element.address}</td>
          <td>{element.createDate}</td>

          <td className="text-success">{element.description}</td>
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
            <div
              onClick={(e) => {
                history.push(`/orderDetail?id=${element.id}`)
              }}
              className="button soft-primary"
            >
              <i className="icofont-eye-open" />
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
            <span>BelongLove</span>
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
                    <h4>ADMIN</h4>
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
                <h4>All Order</h4>
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
                    All Kho sữa
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
              <h4 className="main-title">Quản lý đơn hàng</h4>
              {/* <button
                className="main-btn"
                onClick={ async () => {
                  var element = document.getElementById("post-new");
                  element.classList.add("active");
                  await getAllMilkFunction()
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
                Tạo 
              </button> */}
              <div className="row merged20 mb-4">
                <div className="col-lg-12">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Tất cả các đơn hàng</h5>
                    </div>
                    <table className="table table-default all-events table-striped table-responsive-lg">
                      <thead>
                        <tr>
                          <th>Mã đơn hàng</th>
                          <th>Trạng thái</th>
                          <th>Thanh toán</th>
                          <th>Địa chỉ</th>
                          <th>Ngày tạo</th>
                          <th> </th>
                          <th>Edit</th>
                          {/* <button className="btn btn-primary" onClick={onClick}>
                            View
                          </button> */}
                        </tr>
                      </thead>
                      <tbody>{renderAllOrder()}</tbody>
                    </table>
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
              document.getElementById("txtDesciption").value = "";
              document.getElementById("txtMilkFunction").value = "";
              setSelectedOption({});
              setSelectedOptionsList([])
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
                  Tạo thương hiệu
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
                  Chọn công ty:{" "}
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
                  <option>Chọn công ty</option>
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
                  Tên thương hiệu:{" "}
                </p>
                <input
                  required
                  placeholder="Tên của thương hiệu"
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
                  placeholder="Mô tả của thương hiệu"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtDesciption"
                />





              </div>
              <div style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}>
            {/* Dropdown list */}
            <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Chọn dòng sữa:{" "}
                </p>
            <select
             style={{
              padding: 10,
              width: "30%",
              marginRight: 10,
            }}
            id="txtMilkFunction"
            value={selectedOption && selectedOption.id}
            onChange={handleOptionChange}>
                <option value="">Select an option</option>
                {milkFunction && milkFunction.map(option => (
                    <option key={option.id} value={option.id} name={option.name}>{option.name}</option>
                ))}
            </select>

            {/* Button to add */}
            <button onClick={handleAddButtonClick}>Add</button>

            {selectedOptionsList.length > 0 && (
                <div>
                    <h3>Selected Options:</h3>
                    <ul>
                        {selectedOptionsList.map((option, index) => (
                            <li key={index}>
                                {option.name}
                                <button onClick={(e) => handleDeleteOption(e, index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
              <div  >
            <ul>
        {brandFunctions.map((func, index) => (
          <li key={index}>
            {func}
            <button onClick={() => deleteFunction(index)}>
              {/* Icon Delete using Unicode or SVG */}
              <svg
                onClick={() => deleteFunction(index)}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M10.354 5.354a.5.5 0 0 1 0 .708L8.707 8l1.647 1.646a.5.5 0 0 1-.708.708L8 8.707 6.354 10.354a.5.5 0 0 1-.708-.708L7.293 8 5.646 6.354a.5.5 0 0 1 .708-.708L8 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
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
                Tạo Thương Hiệu
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
                  Bạn có chắn muốn xóa thương hiệu này ?
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
