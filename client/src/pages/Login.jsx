import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", inputs);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setErr(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-wrapper">
        <h2>Sign In</h2>
        <p>to continue to Playvoo</p>
        <form className="auth-form" onSubmit={handleLogin}>
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
            Sign in
          </button>
          {err && <div className="error-text">{err}</div>}
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
