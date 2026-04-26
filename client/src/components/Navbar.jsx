import { Search, Video as VideoIcon, UserCircle, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q) navigate(`/search?q=${q}`);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-wrapper">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search videos..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit">
            <Search size={20} color="var(--text-soft)" />
          </button>
        </form>

        {currentUser ? (
          <div className="user-section">
            <Link to="/upload" className="action-btn">
              <VideoIcon size={24} />
            </Link>
            <Link to={`/channel/${currentUser._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="avatar-wrapper">
                <img src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + currentUser.name} alt="avatar" className="avatar" />
                <span className="user-name">{currentUser.name}</span>
              </div>
            </Link>
            <button className="action-btn" onClick={logout}>
              <LogOut size={24} color="var(--primary-color)" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserCircle size={20} />
            SIGN IN
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
