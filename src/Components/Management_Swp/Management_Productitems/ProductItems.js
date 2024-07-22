import axios from "axios";
import React, { useState, useEffect } from "react";
import SideBar from "../../Sidebar/SideBar";



export default function Schools() {
  const [school, setSchools] = useState([]);
  const [quanlity, setQuanlity] = useState(null);
  const [OutOfStock, setOutOfStock] = useState(null);
  const [stateAdd, setStateAdd] = useState("Create");
  const [schoolRecent, setSchoolRecent] = useState([]);


  const [schoolEdit, setSchoolEdit] = useState(-1);
  const [product, setProduct] = useState([]);
  const [deleteGroupId, setDeleteGroupId] = useState(-1);


  useEffect(async () => {
    await getAllSchool();
    await getallProduct();
    await getQuanlityCompany();
    await getQuanlityOutofstock();
    console.log(localStorage.authorization)

  }, []);
  const changeSubmit = async (event) => {
    event.preventDefault();
    if (stateAdd == "Create") {
      
      await addProductItem();
    } else {
      await updateSchool();
    }
  };
  const addProductItem = async () => {
    if (document.getElementById("txtProductId").value !== "Chọn sản phẩm") {
      try {
        const formData = new FormData();
        formData.append('ProductId', document.getElementById("txtProductId").value);
        formData.append('Quantity', document.getElementById("txtQuantity").value);
        formData.append('Price', document.getElementById("txtPrice").value);
        formData.append('Size', document.getElementById("txtSize").value);



        const response = await axios.post(
          "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/ProductItem/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.authorization,
            },
          }
        );
        if (response.status === 200) {
          await getAllSchool();
          alert("Tạo sản phẩm thành công");
          setStateAdd("Create");

          document.getElementById("txtProductId").value = "";
          document.getElementById("txtQuantity").value = "";
          document.getElementById("txtPrice").value = "";
          document.getElementById("txtSize").value = "";

          var elementTest = document.getElementById("post-new");
          elementTest.classList.remove("active");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Có lỗi rồi");
    }
  };
  ;

  const getAllSchool = async () => {
    
    try {
      const response = await axios.get(
        "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/ProductItem/GetAll",
        {
          headers: {
            "Content-Type": "application/json",
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
  const getQuanlityCompany = async () => {
    try {
      const response = await axios.get(
        "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Company/GetQuantity",
        {
          headers: {
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200 && response.data.isSuccess) {
        setQuanlity(response.data.quantity); // Update state with quantity from API response
      } else {
        console.error(response.data.errorMessage || "An error occurred");
      }
    } catch (err) {
      console.error(err);
    }
  };



  const getQuanlityOutofstock = async () => {
    try {
      const response = await axios.post(
        "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/ProductItem/GetQuantityOutOfStock",
        {
          headers: {
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200 && response.data.isSuccess) {
        setOutOfStock(response.data.quantity); // Update state with quantity from API response
      } else {
        console.error(response.data.errorMessage || "An error occurred");
      }
    } catch (err) {
      console.error(err);
    }
  };




  const clickToUpdate = async (id) => {
    await getProductitemRecent(id);
  };



  const getProductitemRecent = async (id) => {
    
    try {
      const response = await axios.get(
        `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/ProductItem/GetById?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setSchoolRecent(response.data);


        document.getElementById("txtQuantity").value = response.data.quantity;
        document.getElementById("txtPrice").value = response.data.price;
        document.getElementById("txtSize").value = response.data.size;
        setSchoolEdit(response.data.product.id);
     

      }
    } catch (err) {
      console.error(err);
    }
  };


  const getallProduct = async () => {
    
    try {
      const response = await axios.get(
        "http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/Product/GetAllProduct",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setProduct(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onChangeSelect = async (event) => {
  };

  const renderAllProduct = (selectIndex) => {

    return product.map((element, index) => {
      if (selectIndex == undefined) {
        return (
          <option value={element.id} key={index}>
            {element.name}
          </option>
        );
      } else {
        if (selectIndex == element.id) {
          return (
            <option value={element.id} key={index} selected={true}>
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

  const updateSchool = async () => {
    try {
      const formData = new FormData();
      formData.append('Id', schoolRecent.id);
      formData.append('ProductId', document.getElementById("txtProductId").value);
      formData.append('Quantity', document.getElementById("txtQuantity").value);
      formData.append('Price', document.getElementById("txtPrice").value);
      formData.append('Size', document.getElementById("txtSize").value);

      // Kiểm tra dữ liệu FormData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.put(
        `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/ProductItem/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );

      if (response.status === 200) {
        await getAllSchool();
        alert("Cập nhật dòng sữa thành công");
        setStateAdd("Create");
        document.getElementById("txtProductId").value = "";
        document.getElementById("txtQuantity").value = "";
        document.getElementById("txtPrice").value = "";
        document.getElementById("txtSize").value = "";

        var elementTest = document.getElementById("post-new");
        elementTest.classList.remove("active");
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        // Máy chủ đã trả về một phản hồi với mã trạng thái không thành công
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        // Yêu cầu đã được thực hiện nhưng không nhận được phản hồi
        console.error('Request data:', err.request);
      } else {
        // Một cái gì đó đã xảy ra trong việc thiết lập yêu cầu gây ra lỗi
        console.error('Error message:', err.message);
      }
    }
  };




  const deleteAGroup = async (idGroup) => {
    try {
      console.log('idGroup:', idGroup);
      const formData = new FormData();
      formData.append('Id', idGroup);

      const response = await axios.delete(

        `http://development.eba-5na7jw5m.ap-southeast-1.elasticbeanstalk.com/api/ProductItem/delete`,

        {
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        document.getElementById("delete-post").classList.remove("active");
        alert("Xóa sản phẩm thành công");
        await getAllSchool();
      }
    } catch (err) {
      console.error(err); 
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('Request data:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
    }
  };

  const renderSchools = () => {
    return school.map((element, index) => {
      return (
        
        <tr key={index}>
          <td>{element.id}</td>
          <td>{element.product.name}</td>
          <td>{element.quantity}</td>
          <td>{element.price}</td>
          <td>{element.size}</td>
          <td>
            {element.product.image && (
              <img
                src={`data:image/png;base64,${element.product.image.content}`}
                alt="Product Image"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
            )}

          </td>

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
              clickToUpdate(element.id);
            }}
            className="button soft-primary"
          >
            <i className="icofont-pen-alt-1" />
          </div>





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
                <h4>All ProductItems.</h4>
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
                    All ProductItems
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
              <h4 className="main-title">Quản lý Dòng Sữa</h4>
              <div className="row merged20 mb-4">
                {/* <div className="col-lg-3 col-md-6">
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
                </div> */}
                {/* <div className="col-lg-3 col-md-6 ">
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

                        {OutOfStock !== null && (
                          <>
                            <p className="OutOfStock">{OutOfStock}</p>
                            <span className="label">Hết Hàng</span>
                          </>
                        )}
                        
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
                        {quanlity !== null && (
                          <>
                            <p className="quanlity">{quanlity}</p>
                            <span className="label">Số Công Ty</span>
                          </>
                        )}
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
                </div> */}
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
                Tạo Dòng Sữa
              </button>
              <div className="row merged20 mb-4">
                <div className="col-lg-12">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Tất cả các dòng sữa có trong hệ thống</h5>
                    </div>
                    <table className="table table-default all-events table-striped table-responsive-lg">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tên</th>
                          <th>Số lượng</th>
                          <th>Gía</th>
                          <th>Size</th>
                          <th>Hình</th>
                          <th>Chỉnh sửa</th>
                        </tr>
                      </thead>
                      <tbody>{renderSchools()}</tbody>
                    </table>
                  </div>
                </div>
              </div>








              {/* <div className="row merged20 mb-4">
                <div className="col-lg-6">
                  <div className="d-widget">
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* main content */}

      {/* send message popup */}

      {/* side slide message & popup */}
      <div id="post-new" className="post-new-popup">
        <div className="popup" style={{ width: "800px" }}>
          <span
            onClick={() => {
              var element = document.getElementById("post-new");
              element.classList.remove("active");
              setStateAdd("Create");
              document.getElementById("txtQuantity").value = "";
              document.getElementById("txtPrice").value = "";
              document.getElementById("txtSize").value = "";
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
                  {stateAdd == "Create" ? "Tạo Sản Phẩm" : "Cập nhật Sản Phẩm"}
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
                  Chọn sản phẩm:{" "}
                </p>
                <select
                  onChange={onChangeSelect}

                  id="txtProductId"
                  style={{
                    padding: 10,
                    width: "30%",
                    marginRight: 10,
                  }}
                >
                  <option>Chọn sản phẩm</option>
                  {stateAdd == "Create"
                    ? renderAllProduct()
                    : renderAllProduct(schoolEdit)}
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
                  Số lượng:{" "}
                </p>
                <input
                  required
                  placeholder="Nhập số lượng"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtQuantity"
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
                  Gía:{" "}
                </p>
                <input
                  required
                  placeholder="Nhập giá"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtPrice"
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
                  Khối lượng:{" "}
                </p>
                <input
                  required
                  placeholder="Nhập Khối Lượng"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtSize"
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
                {stateAdd == "Create" ? "Tạo Sản Phẩm" : "Cập nhật Sản Phẩm"}
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
                  Bạn có chắn muốn xóa Sản này ?
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
