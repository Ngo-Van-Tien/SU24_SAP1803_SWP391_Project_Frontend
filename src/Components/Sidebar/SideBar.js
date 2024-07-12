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
            <Link to="/school">
              <a
                className
                style={{
                  cursor: "pointer",
                }}
                title
              >
                <i className>
                  <svg
                    id="team"
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-smile"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1={9} y1={9} x2="9.01" y2={9} />
                    <line x1={15} y1={9} x2="15.01" y2={9} />
                  </svg>
                </i>
                Quản lý kho sữa
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
            <Link to="/group">
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
                Quản lý công ty
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
            <Link to="/brand">
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
                Quản lý thương hiệu
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

            <Link to="/milkfuncion">
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
                Quản lý Chức năng sữa
              </a>
            </Link>

          </li>
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
            <Link to="/Account">
              <a
                className
                style={{
                  cursor: "pointer",
                }}
                title
              >
                <i>
                  <svg
                    id="ab1"
                    className="feather feather-users"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    height={14}
                    width={14}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle r={4} cy={7} cx={9} />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </i>
                Quản lý Tài Khoản
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
                Quản lý chất dinh dưỡng
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
            <Link to="/product">
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
                Quản lý sản phẩm
              </a>
            </Link>
            <Link to="/order">
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
                Đơn hàng
              </a>
            </Link>
            <Link to="/general">
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
                Báo cáo doanh số
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

          {/* <li className>
            style={{
                cursor: "pointer"
            }} 
              <i className>
                <svg
                  id="ab9"
                  xmlns="http://www.w3.org/2000/svg"
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-lock"
                >
                  <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </i>
              Login/Register
            </a>
          </li> */}
        </ul>
      </nav>
    </div>
  );
}
