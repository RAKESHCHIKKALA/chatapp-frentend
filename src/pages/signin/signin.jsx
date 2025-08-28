// src/components/Signin.js
import React, { useState } from "react";
import axios from "axios";
import "./signin.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice"; // redux action

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt started with:", { mail, password: password ? "***" : "empty" });

    try {
      console.log("Making API call to signin endpoint...");
      const resp = await axios.post("http://localhost:5409/users/signin", {
        mail,
        password,
      });

      console.log("Signin API response:", resp.data);

      if (resp.data.ok) {
        console.log("Login successful, response data:", resp.data);

        // Store complete user data including ID
        const userData = {
          ...resp.data.user, // This includes _id, name, lastName, mail, phone
          token: resp.data.result,
        };

        console.log("User data to store:", userData);

        // store token in localStorage
        localStorage.setItem("token", resp.data.result);
        console.log("Token stored in localStorage");

        // save user in redux
        dispatch(login(userData));
        console.log("User data dispatched to Redux");

        toast.success("Login successful");
        console.log("Navigating to /home...");
        navigate("/home");
      } else {
        console.error("Login failed:", resp.data.message);
        toast.error(resp.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.message || "Login failed");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit">Login</button>

        <button
          type="button"
          style={{ margin: "7px" }}
          onClick={() => navigate("/signup")}
        >
          New User?
        </button>
      </form>
    </div>
  );
};

export default Signin;
