import React from "react";
import "./header.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleProfile } from "../../store/profileslice"; // new slice

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  return (
    <div className="header">
      <div className="brand">
        <i className="bi bi-send-arrow-up-fill">&nbsp;chatapp</i>
      </div>

      <div className="options">
        <img
          src="https://tse1.mm.bing.net/th/id/OIP.GHGGLYe7gDfZUzF_tElxiQHaHa?pid=Api&P=0&h=180"
          width={40}
          height={40}
          style={{ cursor: "pointer" }}
          onClick={() => dispatch(toggleProfile())} // ✅ toggle profile in chat area
          alt="profile"
        />
        <h3
          style={{ cursor: "pointer" }}
          onClick={() => dispatch(toggleProfile())}
        >
          {user?.name || "Profile"}
        </h3>
        <i
          className="bi bi-box-arrow-in-right"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        ></i>
      </div>
    </div>
  );
};

export default Header;
