import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../../css/event.css";
import { useForm } from "react-hook-form";
import SideBar from "../../Sidebar/SideBar";

export default function Events() {
  const moment = require("moment-timezone");
  const [event, setEvent] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editEvent, setEditEvent] = useState(false);
  const [createEventCheck, setCreateEventCheck] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [oldImg, setOldImg] = useState([]);
  const [oldActivity, setOldActivity] = useState([]);

  useEffect(async () => {
    if (editEvent == true) await fetchEventById(eventId);
    if (createEventCheck == true) {
      initialState.alumniCreatedId = 4;
      initialState.schoolId = "";
      initialState.startDate = "";
      initialState.endDate = "";
      initialState.name = "";
      initialState.description = "";
      initialState.ticketPrice = 0;
      initialState.createAt = "";
      initialState.hourStart = 0;
      initialState.minuteStart = 0;
      initialState.hourEnd = 0;
      initialState.minuteEnd = 0;
      initialState.activity = "";
      initialState.add = "";
      initialState.delete = "";
      setFormEvent(initialState);
      setActivityEvent([]);
    }
    console.log(oldImg);
  }, [editEvent, createEventCheck]);

  const initialState = {
    alumniCreatedId: 4,
    schoolId: "",
    startDate: "",
    endDate: "",
    name: "",
    description: "",
    ticketPrice: 0,
    createAt: "",
    hourStart: 0,
    minuteStart: 0,
    hourEnd: 0,
    minuteEnd: 0,
    activity: "",
    add: "",
    delete: "",
    deleteImg: "",
  };

  const onChange = (e) => {
    const { name, value, type } = e.target;

    setFormEvent({ ...formEvent, [name]: value });
    console.log(formEvent.schoolId);
    setErrorStart("");
    setErrorEnd("");
    setActivityError("");
  };

  const [errorStart, setErrorStart] = useState("");
  const [errorEnd, setErrorEnd] = useState("");

  const [formEvent, setFormEvent] = useState(initialState);

  const [activityEvent, setActivityEvent] = useState([]);

  const [school, setSchool] = useState([]);

  const fetchSchool = async () => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/schools?pageNumber=0&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      setSchool(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEventById = async (id) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/events/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      const listActivity = await getActivity(id);
      setOldActivity(listActivity);
      const listImg = await getImage(id);

      setOldImg(listImg);
      //      if(listActivity.length > 0) {
      // listActivity.map(async (activity)=>{
      //   await deleteActivityEvent(activity.id);
      // })}

      const startDate = response.data.startDate.split("T");
      const time = startDate[1].split(":");
      const endDate = response.data.endDate.split("T");
      const timeEnd = endDate[1].split(":");
      initialState.schoolId = response.data.schoolId;
      initialState.startDate = startDate[0];
      initialState.endDate = endDate[0];
      initialState.name = response.data.name;
      initialState.description = response.data.description;
      initialState.ticketPrice = response.data.ticketPrice;
      initialState.createAt = response.data.createAt;
      initialState.hourStart = parseInt(time[0]);
      initialState.minuteStart = parseInt(time[1]);
      initialState.hourEnd = parseInt(timeEnd[0]);
      initialState.minuteEnd = parseInt(timeEnd[1]);
      initialState.activity = "";
      setFormEvent(initialState);
    } catch (err) {
      console.log(err);
    }
  };

  const renderSchool = () => {
    return school.map((school) => {
      return (
        <>
          <option
            key={school.id.toString()}
            value={school.id}
            selected={formEvent.schoolId == school.id}
          >
            {school.name}
          </option>
        </>
      );
    });
  };

  const RenderActivity = ({ item, index }) => {
    // return activity.map((item,index) => {
    return (
      <div className="item-wrap">
        <span className="activity-name">{item} </span>
        <i
          name="delete"
          onClick={(e) => {
            deleteActivity(index);
            onChange(e);
          }}
          class="icofont-ui-close"
        ></i>
      </div>
    );
    // });
  };
  const RenderOldActivity = () => {
    if (editEvent == true) {
      return oldActivity.map((item, index) => {
        return (
          <div className="item-wrap" key={item.id}>
            <span className="activity-name">{item.name} </span>
            <i
              name="delete"
              onClick={async (e) => {
                await deleteActivityEvent(item.id);
                deleteOldActivity(index);
                onChange(e);
              }}
              class="icofont-ui-close"
            ></i>
          </div>
        );
      });
    }
  };

  const deleteActivity = (index) => {
    const listActivity = activityEvent;
    listActivity.splice(index, 1);
    setActivityEvent(listActivity);
    console.log(index);
    console.log(activityEvent);
  };
  const [activityError, setActivityError] = useState("");

  const createEvent = async () => {
    const m = moment().tz("Asia/Ho_Chi_Minh").format();
    let hourStart = formEvent.hourStart.toString();
    let minuteStart = formEvent.minuteStart.toString();
    let hourEnd = formEvent.hourEnd.toString();
    let minuteEnd = formEvent.minuteEnd.toString();
    if (hourStart < 10) hourStart = "0" + hourStart;
    if (minuteStart < 10) minuteStart = "0" + minuteStart;
    if (hourEnd < 10) hourEnd = "0" + hourEnd;
    if (minuteEnd < 10) minuteEnd = "0" + minuteEnd;
    if (formEvent.startDate == "") {
      setErrorStart("Nhập ngày bắt đầu");
    }
    if (formEvent.endDate == "") {
      setErrorEnd("Nhập ngày kết thúc");
    }

    if (
      formEvent.startDate != "" ||
      formEvent.endDate != "" ||
      activityEvent.length == 0
    ) {
      const start = moment
        .tz(
          `${formEvent.startDate} ${hourStart}:${minuteStart}`,
          "Asia/Ho_Chi_Minh"
        )
        .format();
      const end = moment
        .tz(`${formEvent.endDate} ${hourEnd}:${minuteEnd}`, "Asia/Ho_Chi_Minh")
        .format();
      if (start < m) {
        console.log(start);
        setErrorStart(
          "Ngày bắt đầu và thời gian phải lớn hơn thời gian hiện tại"
        );
        return;
      }
      if (start >= end) {
        console.log(end);
        setErrorEnd(
          "Ngày kết thúc và thời gian phải lớn hơn thời gian bắt đầu"
        );
        return;
      }
      if (activityEvent.length == 0 && editEvent == false) {
        setActivityError("Thêm ít nhất 1 hoạt động ");
        return;
      }
    }

    const start = moment
      .tz(
        `${formEvent.startDate} ${hourStart}:${minuteStart}`,
        "Asia/Ho_Chi_Minh"
      )
      .format();
    const end = moment
      .tz(`${formEvent.endDate} ${hourEnd}:${minuteEnd}`, "Asia/Ho_Chi_Minh")
      .format();
    const data = {
      alumniCreatedId: formEvent.alumniCreatedId,
      schoolId: formEvent.schoolId,
      startDate: start,
      endDate: end,
      name: formEvent.name,
      description: formEvent.description,
      ticketPrice: formEvent.ticketPrice,
      createAt: m,
      schoolId: formEvent.schoolId,
    };
    try {
      let response = null;
      if (editEvent == false) {
        response = await axios.post(
          "https://truongxuaapp.online/api/v1/events",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.authorization,
            },
          }
        );
      }
      if (editEvent == true) {
        response = await axios.put(
          `https://truongxuaapp.online/api/v1/events?id=${eventId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.authorization,
            },
          }
        );
      }

      if (response.status == 200) {
        const dataImage = await saveImgEventInImgBB();
        console.log(dataImage);
        let eventIdRes = null;
        if (editEvent == false) {
          eventIdRes = parseInt(response.data);
        }
        if (editEvent == true) {
          eventIdRes = eventId;
        }
        console.log(eventIdRes);
        await saveEventImage(eventIdRes, dataImage);
        await saveEventActivity(eventIdRes);
        setEventPopup(false);
        setDeleteSuccess(true);
        initialState.schoolId = "";
        initialState.startDate = "";
        initialState.endDate = "";
        initialState.name = "";
        initialState.description = "";
        initialState.ticketPrice = 0;
        initialState.createAt = "";
        initialState.hourStart = 0;
        initialState.minuteStart = 0;
        initialState.hourEnd = 0;
        initialState.minuteEnd = 0;
        initialState.activity = "";
        setFormEvent(initialState);
        setActivityEvent([]);
        setEditEvent(false);
        setCreateEventCheck(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveEventActivity = async (eventId) => {
    try {
      if (activityEvent.length > 0) {
        for (let i = 0; i < activityEvent.length; i++) {
          const response = await axios.post(
            "https://truongxuaapp.online/api/v1/activities",
            {
              eventId: eventId,
              name: activityEvent[i],
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.authorization,
              },
            }
          );
          console.log(eventId + "dass");
          console.log(activityEvent[i] + "ds");

          if (response.status === 200) console.log(activityEvent[0]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  function renderImgEvent() {
    if (imgEventNotSave.length > 0) {
      return imgEventNotSave.map((element, index) => {
        if (element.typeImg != "delete") {
          return (
            <div
              key={index}
              style={{
                display: "inline",
                paddingRight: 20,
                position: "relative",
              }}
            >
              <img
                src={
                  element.typeImg == undefined || element.typeImg == "new"
                    ? URL.createObjectURL(element.img)
                    : element.img
                }
                style={{
                  width: 150,
                  height: 120,
                  marginBottom: 10,
                }}
              ></img>
              <i
                style={{
                  position: "absolute",
                  fontSize: 24,
                  right: 25,
                  top: -50,
                  color: "black",
                }}
                onClick={() => deleteImgEvent(index)}
                className="icofont-close-circled"
              />
            </div>
          );
        }
      });
    }
  }
  function renderOldImg() {
    if (editEvent == true) {
      return oldImg.map((element, index) => {
        return (
          <div
            key={element.id}
            style={{
              display: "inline",
              paddingRight: 20,
              position: "relative",
            }}
          >
            <img
              src={element.imageUrl}
              style={{
                width: 150,
                height: 120,
                marginBottom: 10,
              }}
            />
            <i
              name="deleteImg"
              style={{
                position: "absolute",
                fontSize: 24,
                right: 25,
                top: -50,
                color: "black",
                cursor: "pinter",
              }}
              onClick={async (e) => {
                await deleteImage(element.id);
                deleteOldImg(index);
                onChange(e);
              }}
              className="icofont-close-circled"
            />
          </div>
        );
      });
    }
  }

  const deleteImgEvent = async (index) => {
    let newNotSaveImg = [...imgEventNotSave];
    let img = newNotSaveImg[index];
    if (img.typeImg == "ImgApi") {
      img.typeImg = "delete";
    } else {
      newNotSaveImg.splice(index, 1);
    }
    setimgEventNotSave(newNotSaveImg);
  };

  const deleteOldImg = (index) => {
    let listImg = oldImg;
    listImg.splice(index, 1);
    setOldImg(listImg);
  };
  const deleteOldActivity = (index) => {
    let listActivity = oldActivity;
    listActivity.splice(index, 1);
    setOldActivity(listActivity);
  };

  const [imgEventNotSave, setimgEventNotSave] = useState([]);

  function uploadImageEvent(event) {
    let data = [];
    if (event.target.files.length == 1) {
      let imgNew = event.target.files[0];
      data[0] = { img: imgNew, typeImg: "new" };
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        let imgNew = event.target.files[i];
        data[i] = { img: imgNew, typeImg: "new" };
      }
    }
    console.log(data);
    if (imgEventNotSave.length > 0) {
      let oldImg = [...imgEventNotSave, ...data];
      setimgEventNotSave(oldImg);
    } else {
      setimgEventNotSave(data);
    }
  }

  const fetchAllEvent = async () => {
    try {
      // const response = await axios.get('https://truongxuaapp.online/api/v1/events?pageNumber=0&pageSize=0',
      const response = await axios.get(
        "http://20.212.26.68:12348/api/v1/events?pageNumber=0&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        setEvent(response.data);
        console.log(event);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const saveImgEventInImgBB = async () => {
    let dataImgSave = [];
    if (imgEventNotSave.length >= 1) {
      let body = new FormData();
      body.set("key", "801bd3a925ecfac0e693d493198af86c");
      for (let i = 0; i < imgEventNotSave.length; i++) {
        if (imgEventNotSave[i].typeImg == "new") {
          let img = imgEventNotSave[i].img;
          body.append("image", img);
          try {
            const response = await axios({
              method: "POST",
              url: "https://api.imgbb.com/1/upload",
              data: body,
            });
            if (response.status == 200) {
              dataImgSave[i] = {
                name: response.data.data.title,
                url_display: response.data.data.display_url,
              };
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
    return dataImgSave;
  };

  const saveEventImage = async (eventId, dataImage) => {
    if (dataImage.length > 0) {
      for (let i = 0; i < dataImage.length; i++) {
        const response = await axios.post(
          "https://truongxuaapp.online/api/v1/images",
          {
            eventId: eventId,
            imageUrl: dataImage[i].url_display,
          },

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.authorization,
            },
          }
        );
        if (response.status === 200) console.log(dataImage[i].url_display);
      }
      setimgEventNotSave([]);
    }
  };

  const [eventPopup, setEventPopup] = useState(false);

  const showEventPopup = () => {
    setEventPopup(true);
  };

  useEffect(async () => {
    await fetchAllEvent();
    await fetchSchool();
    setDeleteSuccess(false);
  }, [deleteSuccess]);

  // useEffect(async ()=>{

  // },[])
  const deleteEvent = async () => {
    const listActivity = await getActivity(eventId);
    const listFeedback = await getFeedback();
    const listDonate = await getDonate();
    const listImage = await getImage(eventId);

    if (listDonate.length > 0) {
      listDonate.map(async (donate) => {
        await deleteDonate(donate.id);
      });
    }
    if (listImage.length > 0) {
      listImage.map(async (img) => {
        await deleteImage(img.id);
      });
    }
    if (listFeedback.length > 0) {
      listFeedback.map(async (feedback) => {
        await deleteFeedback(feedback.id);
      });
    }
    if (listActivity.length > 0) {
      listActivity.map(async (activity) => {
        await deleteActivityEvent(activity.id);
      });
    }

    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/events/${eventId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      setDeleteSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };

  const [eventId, setEventId] = useState("");

  const getActivity = async (id) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/activities/eventid?eventId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      const listActivity = response.data;
      return listActivity;
    } catch (err) {
      console.log(err);
    }
  };
  const getFeedback = async () => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/feedbacks/eventid?eventid=${eventId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      const listFeedback = response.data;
      return listFeedback;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/feedbacks/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const getDonate = async () => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/donates/eventid?eventId=${eventId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      const listDonate = response.data;
      return listDonate;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDonate = async (id) => {
    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/donates/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const getImage = async (id) => {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/images/eventid?eventid=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
      const listImage = response.data;
      return listImage;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteImage = async (id) => {
    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/images/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteActivityEvent = async (id) => {
    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/activities/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.authorization,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const renderEvent = () => {
    return event.map((event) => {
      return (
        <tr>
          <td>{event.id}</td>
          <td>{event.schoolId}</td>
          <td>{event.name}</td>
          <td>{event.createAt}</td>
          <td>{event.ticketPrice} vnd</td>
          <td>
            <div
              onClick={() => {
                setDeletePopup(true);
                setEventId(event.id);
              }}
              className="button soft-danger"
            >
              <i className="icofont-trash" />
            </div>
            <div
              onClick={async () => {
                showEventPopup();
                console.log(eventPopup);
                setEventId(event.id);
                setEditEvent(true);
                setCreateEventCheck(false);
              }}
              className="button soft-primary"
            >
              <i className="icofont-pen-alt-1" />
            </div>
            <div
              onClick={() => {
                showEventPopup();
                setCreateEventCheck(true);
                setEditEvent(false);
              }}
              className="button soft-primary"
            >
              <i class="icofont-plus-circle"></i>
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
              <div className="row merged20 mb-4">
                <div className="col-lg-12">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Tất cả sự kiện</h5>
                    </div>
                    <table className="table table-default all-events table-striped table-responsive-lg">
                      <thead>
                        <tr>
                          <th>ID#</th>
                          <th>Id trường</th>
                          <th>Tên event</th>
                          <th>Ngày tạo </th>
                          <th>Giá vé</th>
                          <th>Tùy chọn</th>
                        </tr>
                      </thead>
                      <tbody>{renderEvent()}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {deletePopup ? (
        <div className="delete-wrap">
          <div className="delete-popup">
            <p>Xóa sự kiện này</p>
            <div className="btn-wrap">
              <span
                className="btnAccept"
                onClick={async () => {
                  setEventId("");
                  await deleteEvent();
                  setDeletePopup(false);
                }}
              >
                Đồng ý{" "}
              </span>
              <span
                onClick={() => {
                  setDeletePopup(false);
                  setEventId("");
                  console.log(eventId);
                }}
                className="brnCancel"
              >
                Hủy
              </span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* main content */}
      <div className={`wraper-invite ${eventPopup === true ? "active" : ""}`}>
        <div className="popup">
          <span
            className="popup-closed"
            onClick={() => {
              setEventPopup(false);
              setEventId("");
              setEditEvent(false);
              setCreateEventCheck(false);
            }}
          >
            <i className="icofont-close" />
          </span>
          <div className="popup-meta">
            <div className="popup-head">
              <h5>
                <i class="icofont-megaphone-alt"></i>
                Sự kiện mới
              </h5>
            </div>
            <div className="invitation-meta">
              <div className="imgWrap">
                <label class="lablePhoto" for="photoEvent">
                  <i className="icofont-camera" /> Photo / Video
                </label>
                <input
                  type="file"
                  name="photoEvent"
                  className="photoEvent"
                  id="photoEvent"
                  onChange={uploadImageEvent}
                  accept="image/*"
                  multiple
                />
                <div id="imgBAdd" className="imgBeforeAdd">
                  {renderImgEvent()}
                  {renderOldImg()}
                </div>
              </div>
              <form method="post" className="c-form">
                <div className="name-wrap">
                  <div className="name-event">
                    <h6 className="event-name"> Tên sự kiện</h6>
                    <input
                      name="name"
                      type="text"
                      placeholder="Tên sự kiện"
                      {...register("name", {
                        required: "Nhập tên sự kiện ",
                      })}
                      onChange={onChange}
                      value={formEvent.name}
                    />
                    {errors.name && (
                      <p className="error">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="choose-school">
                    <h6 className="event-name"> Chọn trường</h6>
                    <select
                      {...register("schoolId", {
                        required: "Chọn trường tạo event",
                      })}
                      className="select-year"
                      id=""
                      name="schoolId"
                      onChange={onChange}
                      value={formEvent.shoolId}
                    >
                      <option className="selected-shool" value="">
                        Chọn trường{" "}
                      </option>
                      {renderSchool()}
                    </select>
                    {errors.schoolId && (
                      <p className="error">{errors.schoolId.message}</p>
                    )}
                  </div>
                </div>
                <h6 className="event-name"> Mô tả </h6>
                <input
                  name="description"
                  type="text"
                  placeholder="Mô tả"
                  {...register("description", {
                    required: "Nhập mô tả ",
                  })}
                  onChange={onChange}
                  value={formEvent.description}
                />
                {errors.description && (
                  <p className="error">{errors.description.message}</p>
                )}
                <div className="datetime">
                  <div className="date">
                    <h6 className="event-name"> Ngày bắt đầu</h6>
                    <input
                      name="startDate"
                      type="date"
                      onChange={onChange}
                      value={formEvent.startDate}
                    />
                    <p className="error">{errorStart}</p>
                  </div>
                  <div className="time">
                    <div>
                      <h6 className="event-name"> Nhập giờ</h6>
                      <input
                        name="hourStart"
                        type="number"
                        placeholder="Giờ"
                        {...register("hourStart", {
                          max: {
                            value: 24,
                            message: "Giờ trong khoảng 0-24h ",
                          },
                          min: {
                            value: 0,
                            message: "Giờ trong khoảng 0-24h ",
                          },
                          required: "Nhập giờ ",
                        })}
                        onChange={onChange}
                        value={formEvent.hourStart}
                      />
                      {errors.hourStart && (
                        <p className="error">{errors.hourStart.message}</p>
                      )}
                    </div>
                    <div>
                      <h6 className="event-name"> Nhập phút</h6>
                      <input
                        name="minuteStart"
                        type="number"
                        placeholder="Phút"
                        {...register("minuteStart", {
                          max: {
                            value: 60,
                            message: "Phút trong khoảng 0-60 phút ",
                          },
                          min: {
                            value: 0,
                            message: "Giờ trong khoảng 0-60 phút ",
                          },
                        })}
                        onChange={onChange}
                        value={formEvent.minuteStart}
                      />
                      {errors.minuteStart && (
                        <p className="error">{errors.minuteStart.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="datetime">
                  <div className="date">
                    <h6 className="event-name"> Ngày kết thúc</h6>
                    <input
                      name="endDate"
                      type="date"
                      onChange={onChange}
                      value={formEvent.endDate}
                    />
                    <p className="error">{errorEnd}</p>
                  </div>
                  <div className="time">
                    <div>
                      <h6 className="event-name"> Nhập giờ</h6>
                      <input
                        name="hourEnd"
                        type="number"
                        placeholder="Giờ"
                        {...register("hourEnd", {
                          max: {
                            value: 24,
                            message: "Giờ trong khoảng 0-24h ",
                          },
                          min: {
                            value: 0,
                            message: "Giờ trong khoảng 0-24h ",
                          },
                          required: "Nhập giờ ",
                        })}
                        onChange={onChange}
                        value={formEvent.hourEnd}
                      />
                      {errors.hourEnd && (
                        <p className="error">{errors.hourEnd.message}</p>
                      )}
                    </div>
                    <div>
                      <h6 className="event-name"> Nhập phút</h6>
                      <input
                        name="minuteEnd"
                        type="number"
                        placeholder="Phút"
                        {...register("minuteEnd", {
                          max: {
                            value: 60,
                            message: "Phút trong khoảng 0-60 phút ",
                          },
                          min: {
                            value: 0,
                            message: "Phút trong khoảng 0-60 phút ",
                          },
                        })}
                        onChange={onChange}
                        value={formEvent.minuteEnd}
                      />
                      {errors.minuteEnd && (
                        <p className="error">{errors.minuteEnd.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="activity">
                  <h6 className="event-name"> Hoạt động sự kiện</h6>
                  <div className="activity-input">
                    <input
                      name="activity"
                      type="text"
                      placeholder="Hoạt động"
                      onChange={onChange}
                      value={formEvent.activity}
                    />
                    <span
                      className="add-activity"
                      name="add"
                      onClick={(e) => {
                        if (formEvent.activity != "") {
                          const listActivity = activityEvent;
                          listActivity.push(formEvent.activity);
                          setActivityEvent(listActivity);
                          onChange(e);
                          setFormEvent({ ...formEvent, activity: "" });
                        }
                      }}
                    >
                      Thêm
                    </span>
                  </div>
                  <p className="error">{activityError}</p>
                  <div className="activity-item">
                    {RenderOldActivity()}
                    {activityEvent.map((item, index) => {
                      return (
                        <RenderActivity key={item} item={item} index={index} />
                      );
                    })}
                  </div>
                </div>
                <h6 className="event-name"> Giá vé</h6>
                <input
                  name="ticketPrice"
                  type="number"
                  placeholder="Giá vé"
                  onChange={onChange}
                  value={formEvent.ticketPrice}
                />

                <button
                  type="submit"
                  onClick={handleSubmit(createEvent)}
                  className="main-btn"
                >
                  Tạo
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
    </div>
  );
}
