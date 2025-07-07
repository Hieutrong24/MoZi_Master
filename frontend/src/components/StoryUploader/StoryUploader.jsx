import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

const StoryUploader = ({ onStoryUploaded }) => {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/story`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      onStoryUploaded(res.data.story);  // callback để reload story list
      setShow(false);
      setFile(null);
    } catch (err) {
      console.error("Lỗi đăng story:", err);
    }
  };

  return (
    <>
      {/* Trigger Add Story (Hiển thị nút +) */}
      <div
        className="story-card position-relative text-white text-center rounded-4 shadow"
        onClick={() => setShow(true)}
        style={{
          width: '110px',
          height: '190px',
          backgroundImage: 'url(/Images/Avarta/default.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flex: '0 0 auto',
          cursor: 'pointer',
        }}
      >
        {/* Nút + */}
        <div
          className="position-absolute top-50 start-50 translate-middle bg-primary rounded-circle d-flex justify-content-center align-items-center"
          style={{
            width: '36px',
            height: '36px',
            fontSize: '22px',
            border: '3px solid white',
          }}
        >
          +
        </div>

        {/* Label */}
        <div className="position-absolute bottom-0 w-100 bg-dark bg-opacity-50 rounded-bottom-4 py-1">
          <small>Tạo tin</small>
        </div>
      </div>

      {/* Modal Upload Story */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tạo tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            accept="image/*,video/*"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={!file}>
            Đăng Story
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoryUploader;
