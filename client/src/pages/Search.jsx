import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import "./Home.css"; // Reuse home grid styles

const Search = () => {
  const query = useLocation().search;
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/videos/search${query}`);
        setVideos(res.data);
      } catch (err) {}
    };
    fetchVideos();
  }, [query]);

  return (
    <div className="home-container animate-fade-in">
      <h2>Search Results</h2>
      <div className="video-grid" style={{ marginTop: "20px" }}>
        {videos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
        {videos.length === 0 && (
          <div className="no-videos">No videos found matching your search.</div>
        )}
      </div>
    </div>
  );
};

export default Search;
