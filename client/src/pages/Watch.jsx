import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../context/AuthContext";
import "./Watch.css";

const Watch = () => {
  const { currentUser } = useContext(AuthContext);
  const path = useLocation().pathname.split("/")[2];
  const [video, setVideo] = useState({});
  const [channel, setChannel] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`http://localhost:5001/api/videos/find/${path}`);
        const channelRes = await axios.get(`http://localhost:5001/api/users/find/${videoRes.data.userId}`);
        const commentsRes = await axios.get(`http://localhost:5001/api/comments/${videoRes.data._id}`);
        setVideo(videoRes.data);
        setChannel(channelRes.data);
        setComments(commentsRes.data);
        await axios.put(`http://localhost:5001/api/videos/view/${videoRes.data._id}`);
      } catch (err) { }
    };
    fetchData();
  }, [path]);

  const handleLike = async () => {
    if (!currentUser) return;
    await axios.put(`http://localhost:5001/api/videos/like/${video._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setVideo(prev => {
      const isLiked = prev.likes?.includes(currentUser._id);
      const isDisliked = prev.dislikes?.includes(currentUser._id);
      return {
        ...prev,
        likes: isLiked ? prev.likes.filter(id => id !== currentUser._id) : [...(prev.likes || []), currentUser._id],
        dislikes: isDisliked ? prev.dislikes.filter(id => id !== currentUser._id) : prev.dislikes
      };
    });
  };

  const handleDislike = async () => {
    if (!currentUser) return;
    await axios.put(`http://localhost:5001/api/videos/dislike/${video._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setVideo(prev => {
      const isLiked = prev.likes?.includes(currentUser._id);
      const isDisliked = prev.dislikes?.includes(currentUser._id);
      return {
        ...prev,
        dislikes: isDisliked ? prev.dislikes.filter(id => id !== currentUser._id) : [...(prev.dislikes || []), currentUser._id],
        likes: isLiked ? prev.likes.filter(id => id !== currentUser._id) : prev.likes
      };
    });
  };

  const handleSubscribe = async () => {
    if (!currentUser) return;
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`http://localhost:5001/api/users/unsubscribe/${channel._id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      : await axios.put(`http://localhost:5001/api/users/subscribe/${channel._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

    // Normally we should update Context here to reflect UI globally but simplified for now
    window.location.reload(); 
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!currentUser || !newComment) return;
    try {
      const res = await axios.post("http://localhost:5001/api/comments", {
        videoId: video._id,
        desc: newComment
      }, { headers: { Authorization: `Bearer ${token}` } });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {}
  };

  return (
    <div className="watch-container animate-fade-in">
      <div className="content">
        <div className="video-wrapper">
          <video src={video.videoUrl} controls autoPlay className="video-player" />
        </div>
        <h1 className="video-title">{video.title}</h1>
        <div className="video-details">
          <div className="channel-info">
            <img src={channel.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + channel.name} alt="avatar" className="channel-avatar-large" />
            <div className="channel-text">
              <span className="channel-name-large">{channel.name}</span>
              <span className="channel-subs">{channel.subscribers} subscribers</span>
            </div>
            <button 
              className={`subscribe-btn ${currentUser?.subscribedUsers?.includes(channel._id) ? "subscribed" : ""}`}
              onClick={handleSubscribe}
            >
              {currentUser?.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE"}
            </button>
          </div>

          <div className="video-actions">
            <button className="action-btn-pill" onClick={handleLike}>
              <ThumbsUp size={20} fill={video.likes?.includes(currentUser?._id) ? "currentColor" : "none"} />
              {video.likes?.length || 0}
            </button>
            <button className="action-btn-pill" onClick={handleDislike}>
              <ThumbsDown size={20} fill={video.dislikes?.includes(currentUser?._id) ? "currentColor" : "none"} />
              DISLIKE
            </button>
          </div>
        </div>

        <div className="video-desc-box">
          <p className="views-date">{video.views} views • {format(video.createdAt)}</p>
          <p>{video.desc}</p>
        </div>

        <div className="comments-section">
          <h3><MessageSquare size={20} style={{ display: 'inline', marginRight: '8px' }} /> {comments.length} Comments</h3>
          
          {currentUser && (
            <form className="comment-form" onSubmit={postComment}>
              <img src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + currentUser.name} alt="avatar" className="comment-avatar" />
              <input 
                placeholder="Add a comment..." 
                value={newComment} 
                onChange={e => setNewComment(e.target.value)}
              />
              <button type="submit" className="comment-btn">Comment</button>
            </form>
          )}

          {comments.map(c => (
            <div className="comment-item" key={c._id}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.userId}`} alt="avatar" className="comment-avatar" />
              <div className="comment-body">
                <span className="comment-date">{format(c.createdAt)}</span>
                <p className="comment-text">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recommendations">
        {/* Simplified recommendations, typically you fetch related videos */}
        <p className="sidebar-hint">Recommended videos will appear here.</p>
      </div>
    </div>
  );
};

export default Watch;
