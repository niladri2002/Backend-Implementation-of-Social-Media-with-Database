// src/Components/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const checkUserResponse = await fetch(`http://localhost:5000/checkuser`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const checkUserData = await checkUserResponse.json();

      if (checkUserResponse.ok && checkUserData.exists) {
        alert('User with this email already exists. Please use a different email.');
        return;
      }

      const signupResponse = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const signupData = await signupResponse.json();

      if (signupResponse.ok) {
        sessionStorage.setItem('token', signupData.token);
        onSignup();
        navigate('/home');
      } else {
        alert(signupData.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup');
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
      <p>
                    Don't have an account? &nbsp;
                    <Link to="/login">Login</Link>
                  </p>
    </div>
  );
};

export default Signup;
