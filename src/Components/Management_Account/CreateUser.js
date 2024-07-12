import React from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "../../css/profile.css";

export default function CreateUser(props) {
  const initialState = {
    email: "",
    firstName: "",
    lastName: "",
    name: "",
    password: "",
    phone: "",
    address: "",
    img: "",
    bio: "",
    status: true,
    loading: false,
    error: [],
    userRef: firebase.database().ref("users"),
    errorUser: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      name: formData.firstName + " " + formData.lastName,
    });
  }, [formData.firstName, formData.lastName]);

  const saveUserToDb = async (uid) => {
    const data = formData;
    try {
      const response = await axios.post(
        `https://truongxuaapp.online/api/users/sign-up?userId=${uid}`,
        data
      );
      if (response.status === 200){

	      setFormData(initialState)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = (e) => {
    setFormData({ ...formData, loading: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(formData.email, formData.password)
      .then((createUser) => {
        console.log(createUser.user.uid);
        createUser.user
          .updateProfile({
            displayName: formData.name,
            // photoURL:`http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
          })
          .then(() => {
            saveUser(createUser).then(() => {
              console.log("user save");
              
            });
          });
      })
      .catch((err) => {
        console.log(err);
        if (err.message.includes("already in use")) {
          setFormData({ ...formData, errorUser: "Tài khoản đã tồn tại" });
        } else {
          setFormData({ ...formData, errorUser: "" });
        }
      });
  };

  const saveUser = (createUser) => {
    saveUserToDb(createUser.user.uid);
    return formData.userRef.child(createUser.user.uid).set({
      name: createUser.user.displayName,
      // avatar: createUser.user.photoURL
    });
  };

  return (
    <>
      <div className="name-wrap">
        <input
          type="text"
          {...register("firstName", {
            required: "Nhập tên", // JS only: <p>error message</p> TS only support string
          })}
          onChange={handleChange}
          name="firstName"
          placeholder="Họ"
	  value={formData.firstName}
        />
        {errors.firstName && (
          <p className="error">{errors.firstName.message}</p>
        )}

        <input
          type="text"
          {...register("lastName", {
            required: "Nhập họ", // JS only: <p>error message</p> TS only support string
          })}
          onChange={handleChange}
          name="lastName"
          placeholder="Tên"
	  value={formData.lastName}
        />
        {errors.lastName && <p className="error">{errors.lastName.message}</p>}
      </div>

      <input
        type="text"
        {...register("email", {
          required: "Nhập Email",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "sai định dạng email",
          }, // JS only: <p>error message</p> TS only support string
        })}
        onChange={handleChange}
        name="email"
        placeholder="Email@"
	value={formData.email}
      />
      {errors.email && <p className="error">{errors.email.message}</p>}
      <p style={{ color: "red", marginLeft: 10 }}>{formData.errorUser}</p>

      <input
        type="password"
        {...register("password", {
          required: "Nhập mật khẩu",
          pattern: {
            value: /^[A-Za-z0-9]+$/,
            message: "Mật khẩu không chứa kí tự đặc biệt",
          },
          minLength: {
            value: 6,
            message: "mật khẩu lớn hơn hoặc bằng 6 ký tự", // JS only: <p>error message</p> TS only support string
          },
          // JS only: <p>error message</p> TS only support string
        })}
        onChange={handleChange}
        name="password"
        placeholder="Mật khẩu"
	value={formData.password}
      />
      {errors.password && <p className="error">{errors.password.message}</p>}

      <input
        type="text"
        {...register("address", {
          required: "Nhập địa chỉ", // JS only: <p>error message</p> TS only support string
        })}
        onChange={handleChange}
        name="address"
        placeholder="Địa chỉ"
	value={formData.address}
      />
      {errors.address && <p className="error">{errors.address.message}</p>}

      <button
        onClick={handleSubmit(handleCreate)}
        className="main-btn"
        type="submit"
      >
        <i className="icofont-key" /> Tạo tài khoản
      </button>
    </>
  );
}
