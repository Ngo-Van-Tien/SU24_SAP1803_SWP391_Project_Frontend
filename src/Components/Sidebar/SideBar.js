import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export default function SideBar() {
  const [activeId, setActiveId] = useState("txtSchool");
  useEffect(() => {
    document.getElementById("txtSchool").classList.add("active");
  }, []);
  return (
    <div>
      <nav className="sidebar">
        <ul className="menu-slide">



          <li
            onClick={() => {
              let element = document.getElementById(activeId);
              element.classList.remove("active");
              document.getElementById("txtSchool").classList.add("active");
              setActiveId("txtSchool");
            }}
            id="txtSchool"
            className
          >





            <Link to="/general">
              <a
                className
                style={{
                  cursor: "pointer",
                }}
                title
              >
                <i className>
                  <i>
                    <svg
                      id="ab8"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-file"
                    >
                      <path
                        d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                        style={{ strokeDasharray: "66, 86", strokeDashoffset: 0 }}
                      />
                      <path
                        d="M13,2L13,9L20,9"
                        style={{ strokeDasharray: "14, 34", strokeDashoffset: 0 }}
                      />
                    </svg>
                  </i>

                </i>
                Báo Cáo
              </a>
            </Link>
          </li>

          <li
            onClick={() => {
              let element = document.getElementById(activeId);
              element.classList.remove("active");
              document.getElementById("txtGroup").classList.add("active");
              setActiveId("txtGroup");
            }}
            id="txtGroup"
          >






            <Link to="/product">
              <a
                classNamestyle={{
                  cursor: "pointer",
                }}
                title
              >
                <i className>
                  <svg
                    id="ab4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-airplay"
                  >
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                    <polygon points="12 15 17 21 7 21 12 15" />
                  </svg>
                </i>
                Hệ Thống Sữa Gốc
              </a>
            </Link>
          </li>
          <li
            onClick={() => {
              let element = document.getElementById(activeId);
              element.classList.remove("active");
              document.getElementById("txtGroup").classList.add("active");
              setActiveId("txtGroup");
            }}
            id="txtGroup"
          >



            <Link to="/school">
              <a
                classNamestyle={{
                  cursor: "pointer",
                }}
                title
              >
                <i className>
                  <svg
                    id="ab4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-airplay"
                  >
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                    <polygon points="12 15 17 21 7 21 12 15" />
                  </svg>
                </i>
                Dòng Sữa
              </a>
            </Link>

          </li>


          <li
            onClick={() => {
              let element = document.getElementById(activeId);
              element.classList.remove("active");
              document.getElementById("txtEvent").classList.add("active");
              setActiveId("txtEvent");
            }}
            id="txtEvent"
            className
          >
            {/* <Link to="/events">
              <a
                classNamestyle={{
                  cursor: "pointer",
                }}
                title
              >
                <i className>
                  <svg
                    id="ab5"
                    xmlns="http://www.w3.org/2000/svg"
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-shopping-bag"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </i>
                Chức năng sữa
              </a>
            </Link> */}




            <Link to="/order">
              <a
                classNamestyle={{
                  cursor: "pointer",
                }}
                title
              >
                <i className>
                  <svg
                    id="ab5"
                    xmlns="http://www.w3.org/2000/svg"
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-shopping-bag"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </i>
                Đơn Hàng
              </a>
            </Link>

          </li>

          <hr />
          <li
            onClick={() => {
              let element = document.getElementById(activeId);
              element.classList.remove("active");
              document.getElementById("txtAccount").classList.add("active");
              setActiveId("txtAccount");
            }}
            id="txtAccount"
            className
          >
            <Link to="/brand">
              <a
                className
                style={{
                  cursor: "pointer",
                }}
                title
              >
                <i className="">
                  <svg
                    id="team"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-smile"
                  >
                    <path
                      d="M2,12A10,10 0,1,1 22,12A10,10 0,1,1 2,12"
                      style={{ strokeDasharray: "63, 83", strokeDashoffset: 0 }}
                    />
                    <path
                      d="M8 14s1.5 2 4 2 4-2 4-2"
                      style={{ strokeDasharray: "10, 30", strokeDashoffset: 0 }}
                    />
                    <path
                      d="M9,9L9.01,9"
                      style={{ strokeDasharray: "1, 21", strokeDashoffset: 0 }}
                    />
                    <path
                      d="M15,9L15.01,9"
                      style={{ strokeDasharray: "1, 21", strokeDashoffset: 0 }}
                    />
                  </svg>
                </i>

                Thương Hiệu
              </a>
            </Link>
          </li>

          <li
            onClick={() => {
              let element = document.getElementById(activeId);
              element.classList.remove("active");
              document.getElementById("txtNews").classList.add("active");
              setActiveId("txtNews");
            }}
            id="txtNews"
            className
          >


            <Link to="/milkfuncion">
              <a
                classNamestyle={{
                  cursor: "pointer",
                }}
                title
              >
                <i className="">
                  <svg
                    id="ab7"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-zap"
                  >
                    <path
                      d="M13,2L3,14L12,14L11,22L21,10L12,10L13,2Z"
                      style={{ strokeDasharray: "66, 86", strokeDashoffset: 0 }}
                    />
                  </svg>
                </i>

                Chức Năng Sữa

              </a>
            </Link>

          </li>






          <li
            onClick={() => {
              let element = document.getElementById(activeId);
              element.classList.remove("active");
              document.getElementById("txtNews").classList.add("active");
              setActiveId("txtNews");
            }}
            id="txtNews"
            className
          >
            <Link to="/nutrient">
              <a
                classNamestyle={{
                  cursor: "pointer",
                }}
                title
              >
                <i className>
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
                    className="feather feather-coffee"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1={6} y1={1} x2={6} y2={4} />
                    <line x1={10} y1={1} x2={10} y2={4} />
                    <line x1={14} y1={1} x2={14} y2={4} />
                  </svg>
                </i>
                Dinh Dưỡng
              </a>
            </Link>
            <Link to="/group">
              <a
                classNamestyle={{
                  cursor: "pointer",
                }}
                title
              >
                <i className="">
                  <svg
                    id="ab3"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-star"
                  >
                    <path
                      d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z"
                      style={{ strokeDasharray: "70, 90", strokeDashoffset: 0 }}
                    />
                  </svg>
                </i>

                Công Ty
              </a>
            </Link>


            <Link to="/Account">
              <a
                classNamestyle={{
                  cursor: "pointer",
                }}
                title
              >

                <i className>
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
                    <path
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      style={{ strokeDasharray: "25, 45", strokeDashoffset: 0 }}
                    />
                    <path
                      d="M5,7A4,4 0,1,1 13,7A4,4 0,1,1 5,7"
                      style={{ strokeDasharray: "26, 46", strokeDashoffset: 0 }}
                    />
                    <path
                      d="M23 21v-2a4 4 0 0 0-3-3.87"
                      style={{ strokeDasharray: "8, 28", strokeDashoffset: 0 }}
                    />
                    <path
                      d="M16 3.13a4 4 0 0 1 0 7.75"
                      style={{ strokeDasharray: "11, 31", strokeDashoffset: 0 }}
                    />
                  </svg>
                </i>

                Tài Khoản
              </a>
            </Link>

          </li>
          <li
            onClick={() => {
              let element = document.getElementById(activeId);
              element.classList.remove("active");
              document.getElementById("txtSchoolYear").classList.add("active");
              setActiveId("txtSchoolYear");
            }}
            id="txtSchoolYear"
            className
          >

          </li>





          <Link to="/" style={{
            textDecoration: 'none', display: "flex",
            alignItems: "center",
          }}>

            <div
              className="logout-button"
              title="Logout"
              style={{
                cursor: "pointer",
                padding: "10px 20px",
                backgroundColor: "#1976D2",
                color: "white",
                borderRadius: "5px",
                transition: "background-color 0.3s",
                textAlign: "center",
                margin: "auto",
              }}
            >
              Logout
            </div>
          </Link>
        </ul>
      </nav>
    </div>
  );
}
