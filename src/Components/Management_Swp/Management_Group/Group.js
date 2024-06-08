import axios from "axios";
import React, { useEffect, useState } from "react";
import SideBar from "../../Sidebar/SideBar";

export default function Group() {
  const [groups, setGroups] = useState([]);
  const [schools, setSchools] = useState([]);
  const [schoolYear, setSchoolYear] = useState([]);
  const [stateAdd, setStateAdd] = useState("Create");
  const [schoolEdit, setSchoolEdit] = useState(-1);
  const [schoolYearEdit, setSchoolYearEdit] = useState(-1);
  const [imgNotSave, setImgNotSave] = useState([]);
  const [groupRecent, setGroupRecent] = useState({});
  const [deleteGroupId, setDeleteGroupId] = useState(-1);

  useEffect(async () => {
    await getAllGroups();
    await getAllSchool();
  }, []);
  const saveImgAvatar = async (e) => {
    const img = imgNotSave;
    if (img.length > 0) {
      for (let i = 0; i < img.length; i++) {
        if (img[i].type == "avatar") {
          img.splice(i, 1);
        }
      }
    }
    if (stateAdd == "Update") {
      document.getElementById("txtUpdateAvatar").src = URL.createObjectURL(
        e.target.files[0]
      );
    }
    const imgAvatar = { img: e.target.files[0], type: "avatar" };
    img.push(imgAvatar);
    setImgNotSave(img);
  };
  const saveImgCover = async (e) => {
    const img = imgNotSave;
    if (img.length > 0) {
      for (let i = 0; i < img.length; i++) {
        if (img[i].type == "cover") {
          img.splice(i, 1);
        }
      }
    }
    if (stateAdd == "Update") {
      document.getElementById("txtUpdateCover").src = URL.createObjectURL(
        e.target.files[0]
      );
    }
    const imgAvatar = { img: e.target.files[0], type: "cover" };
    img.push(imgAvatar);
    setImgNotSave(img);
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
    if (
      document.getElementById("txtSelectSchool").value != "Chọn trường" &&
      document.getElementById("txtSelectSchoolYear").value != ""
    ) {
      if (
        document.getElementById("txtAvatar").value.length > 0 &&
        document.getElementById("txtCover").value.length > 0
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
        try {
          const data = {
            name: document.getElementById("txtName").value,
            schoolYearId: document.getElementById("txtSelectSchoolYear").value,
            policy: document.getElementById("txtPolicy").value,
            backgroundImg: bgImg,
            avataImg: avtImg,
            description: document.getElementById("txtDesciption").value,
            info: document.getElementById("txtInfomation").value,
            groupAdminId: null,
          };
          const response = await axios.post(
            "https://truongxuaapp.online/api/v1/groups",
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
            alert("Tạo group thành công");
            setImgNotSave([]);
            setStateAdd("Create");
            document.getElementById("txtName").value = "";
            document.getElementById("txtPolicy").value = "";
            document.getElementById("txtDesciption").value = "";
            document.getElementById("txtInfomation").value = "";
            document.getElementById("txtAvatar").value = "";
            document.getElementById("txtCover").value = "";
            var elementTest = document.getElementById("post-new");
            elementTest.classList.remove("active");
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        alert("Vui Lòng chọn hình");
      }
    } else {
      alert("Chọn trường và niên khóa phù hợp");
    }
  };
  const updateGroup = async () => {
    if (
      document.getElementById("txtSelectSchool").value != "Chọn trường" &&
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
          document.getElementById("txtPolicy").value = "";
          document.getElementById("txtDesciption").value = "";
          document.getElementById("txtInfomation").value = "";
          document.getElementById("txtAvatar").value = "";
          document.getElementById("txtCover").value = "";
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
        // setImgNotSave(
        //   { img: response.data.avataImg, type: "database" },
        //   { img: response.data.backgroundImg, type: "database" }
        // );
        setGroupRecent(response.data);
        document.getElementById("txtUpdateAvatar").src = response.data.avataImg;
        document.getElementById("txtUpdateCover").src =
          response.data.backgroundImg;
        document.getElementById("txtName").value = response.data.name;
        document.getElementById("txtPolicy").value = response.data.policy;
        document.getElementById("txtDesciption").value =
          response.data.description;
        document.getElementById("txtInfomation").value = response.data.info;
        const schoolId = await getSchoolIdBySchoolYearId(
          response.data.schoolYearId
        );
        //console.log(response.data.schoolYearId);
        setSchoolYearEdit(response.data.schoolYearId);
        await getListSchoolYear(schoolId);
        setSchoolEdit(schoolId);
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
        "https://truongxuaapp.online/api/v1/schools?pageNumber=1&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setSchools(response.data);
      }
    } catch (err) {
      console.error(err);
    }
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
  const getListSchoolYear = async (idSchool) => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/schools/schoolyears?pageNumber=1&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        const listSchoolYear = [];
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].schoolId == idSchool) {
            //console.log(response.data[i])
            listSchoolYear.push(response.data[i]);
          }
        }
        setSchoolYear(listSchoolYear);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const onChangeSelect = async (event) => {
    //event.target.value
    await getListSchoolYear(event.target.value);
  };
  const renderSchoolYear = (indexSelect) => {
    return schoolYear.map((element, index) => {
      const dateStart = new Date(element.startDate);
      const dateEnd = new Date(element.endDate);
      if (indexSelect == undefined) {
        return (
          <option key={index} value={element.id}>
            {dateStart.getDate() +
              "/" +
              dateStart.getMonth() +
              "/" +
              dateStart.getFullYear()}{" "}
            -
            {dateEnd.getDate() +
              "/" +
              dateEnd.getMonth() +
              "/" +
              dateEnd.getFullYear()}
          </option>
        );
      } else {
        if (element.id == indexSelect) {
          return (
            <option key={index} value={element.id} selected>
              {dateStart.getDate() +
                "/" +
                dateStart.getMonth() +
                "/" +
                dateStart.getFullYear()}{" "}
              -
              {dateEnd.getDate() +
                "/" +
                dateEnd.getMonth() +
                "/" +
                dateEnd.getFullYear()}
            </option>
          );
        } else {
          return (
            <option key={index} value={element.id}>
              {dateStart.getDate() +
                "/" +
                dateStart.getMonth() +
                "/" +
                dateStart.getFullYear()}{" "}
              -
              {dateEnd.getDate() +
                "/" +
                dateEnd.getMonth() +
                "/" +
                dateEnd.getFullYear()}
            </option>
          );
        }
      }
    });
  };
  const getAllGroups = async () => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/groups?pageNumber=1&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setGroups(response.data);
      }
    } catch (err) {
      console.error(err);
    }
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
  const findPostByGroupId = async (groupId) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/posts/groupid?groupId=${groupId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        for (let i = 0; i < response.data.length; i++) {
          getImageByPostId(response.data[i].id);
          getCommentByPostId(response.data[i].id);
        }
      }
    } catch (err) {
      console.err(err);
    }
  };
  const findAlumniInGroupByGroupId = async (groupId) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/alumniingroup/groupid?groupid=${groupId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        for (let i = 0; i < response.data.length; i++) {
          deleteAlumniInGroupById(response.data[i].id);
        }
      }
    } catch (err) {
      console.err(err);
    }
  };
  const deleteAlumniInGroupById = async (idComment) => {
    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/alumniingroup/${idComment}`,
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
    await findPostByGroupId(idGroup);
    await findAlumniInGroupByGroupId(idGroup);

    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/groups/${idGroup}`,
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
        await getAllGroups();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const renderAllGroups = () => {
    return groups.map((element, index) => {
      return (
        <tr key={index}>
          <td>{element.id}</td>
          <td>{element.name}</td>
          <td>{element.policy}</td>
          <td>
            <img
              style={{
                width: 70,
                height: 100,
              }}
              src={element.backgroundImg}
              alt=""
            />
          </td>
          <td>
            <img
              style={{
                width: 150,
                height: 100,
              }}
              src={element.avataImg}
              alt=""
            />
          </td>
          <td className="text-success">{element.description}</td>
          <td>{element.info}</td>
          <td>{element.groupAdminId}</td>
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
                <h4>All Events</h4>
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
              <h4 className="main-title">Quản lý nhóm</h4>
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
                        <h5>{groups.length}</h5>
                        <span>nhóm</span>
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
                        <h5>1200</h5>
                        <span>Registered Users</span>
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
                        <h5>4021</h5>
                        <span>Tickets Sold</span>
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
                        <h5>$1400</h5>
                        <span>Earnigns</span>
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
                Tạo nhóm
              </button>
              <div className="row merged20 mb-4">
                <div className="col-lg-12">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Tất cả các nhóm</h5>
                    </div>
                    <table className="table table-default all-events table-striped table-responsive-lg">
                      <thead>
                        <tr>
                          <th>ID#</th>
                          <th>Name Group</th>
                          <th>Policy</th>
                          <th>Background Image</th>
                          <th>Avata Image</th>
                          <th>Description</th>
                          <th>Infomation</th>
                          <th>Group Admin Id</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>{renderAllGroups()}</tbody>
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
              document.getElementById("txtPolicy").value = "";
              document.getElementById("txtDesciption").value = "";
              document.getElementById("txtInfomation").value = "";
              document.getElementById("txtAvatar").value = "";
              document.getElementById("txtCover").value = "";
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
                  Tạo nhóm của trường
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
                  Chọn trường:{" "}
                </p>
                <select
                  onChange={onChangeSelect}
                  id="txtSelectSchool"
                  style={{
                    padding: 10,
                    width: "30%",
                    marginRight: 10,
                  }}
                >
                  <option>Chọn trường</option>
                  {stateAdd == "Create"
                    ? renderAllSchool()
                    : renderAllSchool(schoolEdit)}
                </select>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "50%",
                    color: "red",
                    display: schoolYear.length > 0 ? "none" : "block",
                  }}
                >
                  Trường này chưa có niên khóa X{" "}
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "22%",
                    display: schoolYear.length > 0 ? "block" : "none",
                  }}
                >
                  Chọn niên khóa:{" "}
                </p>
                <select
                  id="txtSelectSchoolYear"
                  style={{
                    padding: 10,
                    width: "30%",
                    display: schoolYear.length > 0 ? "block" : "none",
                  }}
                >
                  {stateAdd == "Create"
                    ? renderSchoolYear()
                    : renderSchoolYear(schoolYearEdit)}
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
                  Tên nhóm:{" "}
                </p>
                <input
                  required
                  placeholder="Tên của nhóm"
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
                  Chính sách:{" "}
                </p>
                <input
                  required
                  placeholder="
                  Chính sách của nhóm"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtPolicy"
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
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Thông tin:{" "}
                </p>
                <input
                  required
                  placeholder="Thông tin của nhóm"
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                  id="txtInfomation"
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
                    fontSize: 15,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Ảnh đại diện:{" "}
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
                      id="txtUpdateAvatar"
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
                  style={{
                    width: stateAdd == "Create" ? "100%" : "60%",
                    padding: 10,
                  }}
                  onChange={saveImgAvatar}
                  id="txtAvatar"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                />
              </div>

              <div
                onChange={saveImgCover}
                style={{
                  display: "flex",
                  marginTop: 20,
                  alignItems: "baseline",
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    width: "20%",
                  }}
                >
                  Ảnh bìa:{" "}
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
                  style={{
                    width: stateAdd == "Create" ? "100%" : "60%",
                    padding: 10,
                  }}
                  id="txtCover"
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
                  Bạn có chắn muốn xóa bài đăng này ?
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
