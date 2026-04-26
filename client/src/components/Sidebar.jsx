import { Link } from "react-router-dom";
import { Home, Compass, PlaySquare, PlusCircle } from "lucide-react";
import "./Sidebar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="logo-icon"></div>
          <h2>Playvoo</h2>
        </Link>
      </div>
      <div className="sidebar-wrapper">
        <Link to="/" className="sidebar-item">
          <Home size={22} />
          <span>Home</span>
        </Link>
        <Link to="/trend" className="sidebar-item">
          <Compass size={22} />
          <span>Explore</span>
        </Link>
        <Link to="/sub" className="sidebar-item">
          <PlaySquare size={22} />
          <span>Subscriptions</span>
        </Link>
        <hr className="hr-line" />
        
        {!currentUser && (
          <div className="sidebar-login">
            <p>Sign in to like videos, comment, and subscribe.</p>
            <Link to="/login" className="btn-primary" style={{ display: "inline-block", marginTop: "10px" }}>
              SIGN IN
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
