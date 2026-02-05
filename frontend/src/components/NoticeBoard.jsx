import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "./NoticeBoard.css";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "GENERAL",
  });
  
  const role = localStorage.getItem("role");
  const canManage = role === "ADMIN" || role === "HR";

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/api/notices");
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/notices/${id}`);
      setNotices(notices.filter((n) => n.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/notices", formData);
      setNotices([res.data, ...notices]);
      setShowForm(false);
      setFormData({ title: "", content: "", category: "GENERAL" });
    } catch (err) {
      alert("Failed to post notice");
    }
  };

  return (
    <div className="notice-board">
      <div className="nb-header">
        <h3>Announcements</h3>
        {canManage && (
          <button 
            className="post-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Post Notice"}
          </button>
        )}
      </div>

      {showForm && (
        <form className="notice-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="GENERAL">General</option>
            <option value="URGENT">Urgent</option>
            <option value="EVENT">Event</option>
          </select>
          <textarea
            placeholder="Content"
            required
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />
          <button type="submit">Post</button>
        </form>
      )}

      <div className="notices-list">
        {notices.length === 0 ? (
          <p className="no-notices">No announcements yet.</p>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className={`notice-card ${notice.category.toLowerCase()}`}>
              <div className="notice-top">
                <span className="notice-cat">{notice.category}</span>
                <span className="notice-date">
                  {new Date(notice.date).toLocaleDateString()}
                </span>
                {canManage && (
                  <button 
                    className="delete-notice-btn"
                    onClick={() => handleDelete(notice.id)}
                  >
                    &times;
                  </button>
                )}
              </div>
              <h4>{notice.title}</h4>
              <p>{notice.content}</p>
              <div className="notice-footer">
                <small>Posted by: {notice.author?.name || "Admin"}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
