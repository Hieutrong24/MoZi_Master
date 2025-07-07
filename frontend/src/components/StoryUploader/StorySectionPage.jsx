import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import StoryUploader from "../StoryUploader/StoryUploader";
import axios from "axios";

const StorySection = () => {
  const { authState } = useContext(AuthContext);
  const { avatar } = authState || {};
  const [reload, setReload] = useState(false);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/story/all`, { withCredentials: true })
      .then((res) => setStories(res.data.stories || []))
      .catch((err) => console.error("Lỗi lấy story:", err));
  }, [reload]);

  return (
    <div className="d-flex gap-3 overflow-auto px-2 py-3 bg-white rounded-3" style={{ whiteSpace: "nowrap" }}>
      {/* Tạo Story */}
      <div
        className="story-card position-relative text-white text-center rounded-4 shadow"
        style={{
          width: "110px",
          height: "190px",
          backgroundImage: `url(${avatar})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          flex: "0 0 auto",
          cursor: "pointer",
        }}
        data-bs-toggle="modal"
        data-bs-target="#storyUploadModal"
      >
        <div
          className="position-absolute top-50 start-50 translate-middle bg-primary rounded-circle d-flex justify-content-center align-items-center"
          style={{
            width: "36px",
            height: "36px",
            fontSize: "22px",
            border: "3px solid white",
          }}
        >
          +
        </div>
        <div className="position-absolute bottom-0 w-100 bg-dark bg-opacity-50 rounded-bottom-4 py-1">
          <small>Tạo tin</small>
        </div>
      </div>

      {/* Hiển thị các Story */}
      {stories.map((story) => (
        <div
          key={story._id}
          className="story-card position-relative text-white text-center rounded-4 shadow"
          onClick={() => setSelectedStory(story)}
          style={{
            width: "110px",
            height: "190px",
            backgroundImage: `url(${import.meta.env.VITE_BACKEND_URL}/api/story/all${story.mediaUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flex: "0 0 auto",
            cursor: "pointer",
          }}
        >
          {/* Avatar người dùng */}
          <div className="position-absolute top-2 start-2">
            <img
              src={story.user.avatar || "/Images/Avarta/default.jpg"}
              alt="user"
              className="rounded-circle border border-2 border-primary"
              style={{ width: "35px", height: "35px", objectFit: "cover" }}
            />
          </div>

          {/* Tên người dùng */}
          <div className="position-absolute bottom-0 w-100 bg-dark bg-opacity-50 rounded-bottom-4 py-1">
            <small className="text-white">{story.user.name}</small>
          </div>
        </div>
      ))}

      {/* Modal Upload Story */}
      <div className="modal fade" id="storyUploadModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tạo Story mới</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <StoryUploader onStoryUploaded={() => setReload(!reload)} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xem Story */}
      {selectedStory && (
        <div
          className="modal d-block fade show"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1055,
          }}
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <h5 className="modal-title">{selectedStory.user.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedStory(null)} />
              </div>
              <div className="modal-body text-center">
                {selectedStory.mediaType === "image" ? (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${selectedStory.mediaUrl}`}
                    className="img-fluid rounded"
                    alt="story"
                    style={{ maxHeight: "70vh" }}
                  />
                ) : (
                  <video controls autoPlay className="w-100 rounded" style={{ maxHeight: "70vh" }}>
                    <source src={`${import.meta.env.VITE_BACKEND_URL}${selectedStory.mediaUrl}`} type="video/mp4" />
                    Trình duyệt không hỗ trợ video.
                  </video>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorySection;
