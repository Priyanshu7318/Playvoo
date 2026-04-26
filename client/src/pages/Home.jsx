import { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import "./Home.css";

const Home = ({ type = "random" }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5001/api/videos/${type}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideos();
  }, [type]);

  return (
    <div className="home-container animate-fade-in">
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
        {videos.length === 0 && (
          <div className="no-videos">No videos found. Be the first to upload!</div>
        )}
      </div>
    </div>
  );
};

export default Home;
