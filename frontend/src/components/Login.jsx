import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/store";
import ReCAPTCHA from "react-google-recaptcha";
import Logo from "./Logo";
import Image from "./Image";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      return alert("Please complete the CAPTCHA");
    }

    try {
      const response = await fetch(
        "https://studentmanagement-anwx.onrender.com/api/v1/routes/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          body: JSON.stringify({ username, password, captchaToken }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess(data)); // Store user & token in Redux
        navigate("/");
      } else {
        alert(data.message);
        recaptchaRef.current.reset();
        setCaptchaToken("");
      }
    } catch (error) {
      console.error("Login failed:", error);
      recaptchaRef.current.reset();
      setCaptchaToken("");
    }
  };

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
        <Logo />
        <div className="flex flex-col items-center justify-center w-full max-w-md mt-auto mb-auto px-4 sm:px-6">
          <h1 className="text-3xl text-black font-bold text-center mb-6 font-mono">
            Login
          </h1>
          <form className="w-full" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-black font-mono mb-2">
                Username
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                type="text"  // Changed to "text" for username
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-black font-mono mb-2">
                Password
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <ReCAPTCHA
                sitekey="6LcWaSUrAAAAAKi8355M86oun6fj7MR5iAt1X48g"
                onChange={handleCaptcha}
                ref={recaptchaRef}
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-mono hover:bg-blue-700 transition-all"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Image />
    </div>
  );
}

export default Login;
