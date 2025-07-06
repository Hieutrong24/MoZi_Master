import React, { useEffect, useState } from "react";
import NavbarleftVideo from "../Video/NavbarLeftVideo";
import TikTokEmbed from "../Video/UploadTikTok";
import axios from "axios";
import { toast } from "react-toastify";

const VideoPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [videoPosts, setVideoPosts] = useState([]);

  const fetchVideoPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/posts/feed", {
        withCredentials: true,
      });

      const postsWithVideo = res.data.posts.filter((post) => post.video);
      setVideoPosts(postsWithVideo);
    } catch (err) {
      toast.error("Không thể tải video bài viết");
    }
  };

  useEffect(() => {
    fetchVideoPosts();
  }, []);

  return (
    <div className="container-fluid mt-2">
      <div className="row">
        {/* Menu Mobile */}
        <div className="col-12 d-md-none mb-2">
          <button
            className="btn btn-outline-dark"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰ Menu
          </button>
        </div>

        {/* Sidebar */}
        <div className={`col-md-3 ${showMenu ? "d-block" : "d-none"} d-md-block`}>
          <NavbarleftVideo />
        </div>

        {/* Nội dung chính */}
        <div className="col-12 col-md-9">
          <div
            className="bg-body-secondary rounded p-3 scroll-on-hover overflow-auto"
            style={{ height: "90vh" }}
          >
            {/* YouTube demo */}
            <div className="bg-white p-4 rounded shadow mb-4">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="/Images/Avarta/th (1).jpg"
                  className="rounded-circle me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  alt="User Avatar"
                />
                <div>
                  <h6 className="mb-0">Tên người dùng đăng bài</h6>
                  <small className="text-muted">2 giờ trước</small>
                </div>
              </div>
              <p>Đây là nội dung của một bài đăng mẫu</p>
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <div className="d-flex justify-content-between text-muted mt-2">
                <span><i className="far fa-heart me-1"></i> 120 Likes</span>
                <span><i className="far fa-comment me-1"></i> 45 Comments</span>
              </div>
            </div>

            {/* TikTok Demo 1 */}
            <div className="bg-white p-4 rounded shadow mb-4">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="/Images/Avarta/th (1).jpg"
                  className="rounded-circle me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  alt="User Avatar"
                />
                <div>
                  <h6 className="mb-0">Tên người dùng đăng bài</h6>
                  <small className="text-muted">2 giờ trước</small>
                </div>
              </div>
              <p>Đây là nội dung của một bài đăng mẫu</p>
              <TikTokEmbed
                videoId="7277028720219573536"
                authorUsername="dangdung66188"
              />
              <div className="d-flex justify-content-between text-muted mt-2">
                <span><i className="far fa-heart me-1"></i> 120 Likes</span>
                <span><i className="far fa-comment me-1"></i> 45 Comments</span>
              </div>
            </div>

            {/* TikTok Demo 2 */}
            <div className="bg-white p-4 rounded shadow mb-4">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="/Images/Avarta/th (1).jpg"
                  className="rounded-circle me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  alt="User Avatar"
                />
                <div>
                  <h6 className="mb-0">Tên người dùng đăng bài</h6>
                  <small className="text-muted">2 giờ trước</small>
                </div>
              </div>
              <p>Đây là nội dung của một bài đăng mẫu</p>
              <TikTokEmbed
                videoId="7510935962680184080"
                authorUsername="chuyencuaaike"
              />
              <div className="d-flex justify-content-between text-muted mt-2">
                <span><i className="far fa-heart me-1"></i> 120 Likes</span>
                <span><i className="far fa-comment me-1"></i> 45 Comments</span>
              </div>
            </div>

            {/* Bài viết có video thật từ bạn bè hoặc bản thân */}
            {videoPosts.length === 0 ? (
              <p className="text-muted">Chưa có bài viết video nào...</p>
            ) : (
              videoPosts.map((post) => (
                <div className="bg-white p-4 rounded shadow mb-4" key={post._id}>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={post.author?.avatar || "/Images/Avarta/th (1).jpg"}
                      className="rounded-circle me-3"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      alt="User Avatar"
                    />
                    <div>
                      <h6 className="mb-0">{post.author?.name || "Không rõ tên"}</h6>
                      <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                   <div className="ratio ratio-16x9">
                    <p>{post.content}</p>
                    <video controls className="w-60 rounded mx-auto d-block">
                      <source src={`http://localhost:3000${post.video}`} type="video/mp4" />
                      Trình duyệt không hỗ trợ video.
                    </video>
                  </div>
                  <div className="d-flex justify-content-between text-muted mt-2">
                    <span><i className="far fa-heart me-1"></i> {post.likes.length} Likes</span>
                    <span><i className="far fa-comment me-1"></i> {post.comments.length} Comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
