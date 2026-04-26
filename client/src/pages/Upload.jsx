import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "./Upload.css";

const Upload = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [inputs, setInputs] = useState({ title: "", desc: "", tags: "" });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Please sign in to upload videos.</div>;
  }

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video) return alert("Please select a video file!");
    
    setUploading(true);
    try {
      const data = new FormData();
      data.append("video", video);
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }
      
      const token = localStorage.getItem("token");
      
      // Upload video and thumbnail files
      const uploadRes = await axios.post("http://localhost:5001/api/videos/upload", data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      // Create video item in db
      const newVideo = {
        title: inputs.title,
        desc: inputs.desc,
        tags: inputs.tags.split(",").map(tag => tag.trim()),
        videoUrl: `http://localhost:5001${uploadRes.data.videoUrl}`,
        imgUrl: uploadRes.data.imgUrl.startsWith("http") ? uploadRes.data.imgUrl : `http://localhost:5001${uploadRes.data.imgUrl}`
      };
      
      const res = await axios.post("http://localhost:5001/api/videos", newVideo, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      setUploading(false);
      navigate(`/video/${res.data._id}`);
    } catch (err) {
      setUploading(false);
      console.error(err);
      alert("Error uploading video");
    }
  };

  return (
    <div className="upload-container animate-fade-in">
      <div className="upload-wrapper">
        <h2>Upload Video</h2>
        <form className="upload-form" onSubmit={handleUpload}>
          <div className="files-container">
            <div className="file-input-wrapper">
              <UploadCloud size={48} color="var(--primary-color)" />
              <p>Drag and drop a video file</p>
              <input 
                type="file" 
                accept="video/*" 
                onChange={(e) => setVideo(e.target.files[0])} 
                className="file-input"
              />
              {video && <p className="file-name">{video.name}</p>}
            </div>

            <div className="file-input-wrapper thumbnail-upload">
              <UploadCloud size={48} color="var(--text-soft)" />
              <p>Upload a thumbnail (optional)</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setThumbnail(e.target.files[0])} 
                className="file-input"
              />
              {thumbnail && <p className="file-name">{thumbnail.name}</p>}
            </div>
          </div>

          <div className="input-group">
            <label>Title</label>
            <input type="text" name="title" onChange={handleChange} placeholder="Glimpse of us" required />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea name="desc" onChange={handleChange} rows={5} placeholder="Tell viewers about your video" required />
          </div>

          <div className="input-group">
            <label>Tags</label>
            <input type="text" name="tags" onChange={handleChange} placeholder="music, vlog, nature (comma separated)" />
          </div>

          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
