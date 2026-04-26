import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Register = () => {
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setErr(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-wrapper">
        <h2>Sign Up</h2>
        <p>to continue to Playvoo</p>
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            name="name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary" style={{ marginTop: "10px" }}>
            Sign up
          </button>
          {err && <div className="error-text">{err}</div>}
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
