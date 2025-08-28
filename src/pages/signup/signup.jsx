// src/pages/signup/signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    lastName: '',
    gender: '',
    mail: '',
    password: '',
    phone: '',
  });

  const getnewuser = (e) => {
    e.preventDefault();
    console.log("Signup attempt with user data:", { ...user, password: "***" });
    
    axios
      .post('http://localhost:5409/users/signup', user)
      .then((res) => {
        console.log("Signup successful:", res.data);
        setUser({
          name: '',
          lastName: '',
          gender: '',
          mail: '',
          password: '',
          phone: '',
        });
        toast("user created");
        navigate('/');
      })
      .catch((err) => {
        console.error("Signup error:", err);
        if (err.response) {
          console.error("Error response:", err.response.data);
          alert(err.response.data.error || 'Signup failed!');
        } else {
          alert('Network error. Please check your connection.');
        }
      });
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={getnewuser}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="First Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          autoComplete="given-name"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          autoComplete="family-name"
          required
        />

        <div className="gender-selection">
  <div>
    <input
      type="radio"
      name="gender"
      id="male"
      value="male"
      checked={user.gender === 'male'}
      onChange={(e) => setUser({ ...user, gender: e.target.value })}
    />
    <label htmlFor="male">Male</label>
  </div>

  <div>
    <input
      type="radio"
      name="gender"
      id="female"
      value="female"
      checked={user.gender === 'female'}
      onChange={(e) => setUser({ ...user, gender: e.target.value })}
    />
    <label htmlFor="female">Female</label>
  </div>

  <div>
    <input
      type="radio"
      name="gender"
      id="others"
      value="others"
      checked={user.gender === 'others'}
      onChange={(e) => setUser({ ...user, gender: e.target.value })}
    />
    <label htmlFor="others">Others</label>
  </div>
</div>


        <input
          type="email"
          placeholder="Email"
          value={user.mail}
          onChange={(e) => setUser({ ...user, mail: e.target.value })}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          autoComplete="new-password"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          autoComplete="tel"
          required
        />

        <button type="submit">Sign Up</button>

        <p className="signin-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/')}>Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
