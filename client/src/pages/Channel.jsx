import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { AuthContext } from "../context/AuthContext";
import "./Home.css"; // Reuse home grid styles

const Channel = () => {
  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState({});
  const [videos, setVideos] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelRes = await axios.get(`http://localhost:5001/api/users/find/${path}`);
        const videosRes = await axios.get(`http://localhost:5001/api/videos/user/${path}`);
        setChannel(channelRes.data);
        setVideos(videosRes.data);
      } catch (err) {}
    };
    fetchData();
  }, [path]);

  const handleSubscribe = async () => {
    if (!currentUser) return;
    const token = localStorage.getItem("token");
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`http://localhost:5001/api/users/unsubscribe/${channel._id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      : await axios.put(`http://localhost:5001/api/users/subscribe/${channel._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    window.location.reload(); 
  };

  return (
    <div className="home-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "40px", backgroundColor: "var(--bg-lighter)", padding: "40px", borderRadius: "16px", flexWrap: "wrap", borderTop: "5px solid var(--primary-color)" }}>
        <img 
          src={channel.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + channel.name} 
          alt="avatar" 
          style={{ width: "160px", height: "160px", borderRadius: "50%", objectFit: "cover", backgroundColor: "#333" }} 
        />
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h1 style={{ fontSize: "36px", marginBottom: "15px" }}>{channel.name}</h1>
          <div style={{ color: "var(--text-soft)", display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px", fontSize: "15px" }}>
            <span style={{ fontWeight: 600, color: "var(--text-color)" }}>{channel.subscribers || 0} subscribers</span>
            <span>•</span>
            <span>{videos.length} videos</span>
            <span>•</span>
            <span>{videos.reduce((acc, video) => acc + video.views, 0)} total views</span>
          </div>
          <p style={{ color: "var(--text-soft)", fontSize: "14px" }}>
            Joined {channel.createdAt ? new Date(channel.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
          </p>
        </div>
        
        {currentUser?._id !== channel._id ? (
          <button 
            className={`subscribe-btn ${currentUser?.subscribedUsers?.includes(channel._id) ? "subscribed" : ""}`}
            onClick={handleSubscribe}
            style={{ padding: "12px 24px" }}
          >
            {currentUser?.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE"}
          </button>
        ) : (
          <button style={{ background: "transparent", color: "var(--text-color)", padding: "10px 20px", border: "1px solid var(--border-color)", borderRadius: "20px", fontWeight: "600" }}>
            Customize Channel
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "30px", marginBottom: "30px", borderBottom: "1px solid var(--border-color)", paddingBottom: "0" }}>
        <h3 style={{ borderBottom: "3px solid var(--text-color)", paddingBottom: "15px", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}>HOME</h3>
        <h3 style={{ color: "var(--text-soft)", paddingBottom: "15px", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}>VIDEOS</h3>
        <h3 style={{ color: "var(--text-soft)", paddingBottom: "15px", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}>ABOUT</h3>
      </div>
      
      <div className="video-grid">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
        {videos.length === 0 && (
          <div className="no-videos">This channel has no videos.</div>
        )}
      </div>
    </div>
  );
};

export default Channel;
