import React, { useState, useEffect } from "react";
import "../../css/group.css";
import axios from "axios";

function Groups(props) {
  
  const [listGroups, setListGroups] = useState([]);
  const [group, setGroup] = useState({});
  const [groupId, setGroupId] = useState("");
  const [success,setSuccess] = useState(false)
  const onChange = (e) => {
    const { name, value, type } = e.target;
    setGroupId(value);
    console.log(groupId + "dd");
    for (let i = 0; i < listGroups.length; i++) {
      if (value == listGroups[i].id) {
        setGroup(listGroups[i]);
        return;
      } else {
        setGroup({});
      }
    }
  };

  const saveChanges = async (alumiId) => {
	  if(alumiId == group.groupAdminId){
		  alumiId = null
	  }
    const data = {
	name: group.name,
	schoolYearId : group.schoolYearId,
	policy : group.policy,
	backgroundImg : group.backgroundImg,
	avataImg: group.avataImg,
	description : group.description,
	info : group.info,
	groupAdminId: alumiId,
	groupAdmin : group.groupAdmin, 
	shoolYear : group.shoolYear,
	alumiInGroups: group.alumiInGroups,
	eventInGroups: group.eventInGroups,
	postInGroups: group.postInGroups,
	id: group.id,  
    };
    try {
      const response = await axios.put(
        `https://truongxuaapp.online/api/v1/groups?id=${groupId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + localStorage.authorization,
          },
        }
      );
      setSuccess(true)
      console.log('thanh cong')
      setGroupId("");
      setGroup({})
    } catch (err) {
      console.log(err);
    }
  };

  async function featchGroups() {
    try {
      const response = await axios.get(
        `https://truongxuaapp.online/api/v1/groups?pageNumber=0&pageSize=0`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + localStorage.authorization,
          },
        }
      );
      if (response.status === 200) {
        const listGroups = [];
        const listIdGroups = [];
        const listAlumniIngroups = await fetchAlumiIngroup();

        for (let j = 0; j < listAlumniIngroups.length; j++) {
          if (listAlumniIngroups[j].alumniId == props.alumiId) {
            listIdGroups.push(listAlumniIngroups[j].classId);
          }
        }

        for (let i = 0; i < response.data.length; i++) {
          for (let j = 0; j < listIdGroups.length; j++) {
            if (listIdGroups[j] == response.data[i].id) {
              listGroups.push(response.data[i]);
            }
          }
        }

        setListGroups(listGroups);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAlumiIngroup = async () => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/alumniingroup?pageNumber=0&pageSize=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " +localStorage.authorization,
          },
        }
      );
      const listAlumniIngroups = response.data;
      return listAlumniIngroups;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    featchGroups();
    setSuccess(false)
  }, [success]);

  const renderGroupOption = () => {
    return listGroups.map((group) => {
      return (
        <option key={group.id.toString()} value={group.id}>
          {group.name}
        </option>
      );
    });
  };

  const RenderInfo = () => {
	  return(
		  <>
		   <a href="#">
          <h5 className="group-name">{"Tên nhóm: " + group.name}</h5>
        </a>

        <p className="creator">Trưởng nhóm :{group.groupAdminId} </p>

        <img className="group-img" src={group.backgroundImg} />
        <p
          style={{
            color: "black",
            fontSize: 12,
            marginBottom: 0,
          }}
        >
          {group.description}
        </p>

        <div className="bottom" onClick={()=>saveChanges(props.alumiId)}>
          <p className="join">
            {props.alumiId == group.groupAdminId ? "Hủy đặt" : " Đặt"}
          </p>
        </div>
		  </>
	  )
  }

  const renderGroup = () => {
    return (
      <div className="group-wrap ">
        <select className="select-group" name="groupId" onChange={onChange} value={groupId}>
          <option className="selected-group" value="">
            Chọn nhóm{" "}
          </option>
          {renderGroupOption()}
        </select>
       {groupId != "" ? <RenderInfo />:""}
      </div>
    );
  };

  return <div className="group-grid">{renderGroup()}</div>;
}

export default Groups;
