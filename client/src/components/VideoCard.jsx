import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import axios from "axios";
import "./VideoCard.css";

const VideoCard = ({ video }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChannel();
  }, [video.userId]);

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <div className="video-card">
        <div className="thumbnail-container">
          <img 
            src={video.imgUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800"} 
            alt="thumbnail" 
            className="thumbnail"
          />
        </div>
        <div className="details">
          <img 
            src={channel.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + channel.name} 
            alt="channel avatar" 
            className="channel-avatar" 
          />
          <div className="texts">
            <h3 className="title">{video.title}</h3>
            <h4 className="channel-name">{channel.name}</h4>
            <div className="info">
              {video.views} views • {format(video.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
