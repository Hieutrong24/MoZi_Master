import React, { useContext, useEffect, useRef, useState } from 'react';
import SidebarLeft from '../SidebarLeft/SidebarLeft';
import FriendList from '../FriendList/FriendList';
import { AuthContext } from '../../context/AuthContext';
import { FaEllipsisV, FaHeart } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import StorySection from '../StoryUploader/StorySectionPage';

const address = 'http://localhost:3000';

const Home = () => {
  const { authState } = useContext(AuthContext);
  const { avatar, _id: currentUserId } = authState || {};

  console.log('Current User:', authState);
  console.log('Avatar URL:', avatar);

  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedMediaPreview, setSelectedMediaPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [commentText, setCommentText] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [reload, setReload] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 300, once: true });
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${address}/api/posts/feed`, { withCredentials: true });
      const postsWithDefaults = res.data.posts.map(post => ({
        ...post,
        likes: Array.isArray(post.likes) ? post.likes : [],
        comments: Array.isArray(post.comments) ? post.comments : [],
      }));
      setPosts(postsWithDefaults);
    } catch (err) {
      toast.error('Không thể tải bài viết');
    }
  };

  const handlePostSubmit = async () => {
    if (!content.trim()) {
      toast.warning('Bạn chưa nhập nội dung bài viết!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) {
        if (file.type.startsWith('image/')) formData.append('image', file);
        else if (file.type.startsWith('video/')) formData.append('video', file);
      }

      await axios.post(`${address}/api/posts`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Đăng bài thành công!');
      setContent('');
      setSelectedMediaPreview(null);
      setFile(null);
      fetchPosts();
    } catch (err) {
      toast.error('Không thể đăng bài');
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedMediaPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    try {
      await axios.delete(`${address}/api/posts/${postId}`, { withCredentials: true });
      toast.success('Đã xóa bài viết');
      fetchPosts();
    } catch (err) {
      toast.error('Không thể xóa bài viết');
    }
  };

  const handleEditPost = async () => {
    if (!editContent.trim()) {
      toast.warning('Bạn chưa nhập nội dung!');
      return;
    }

    try {
      await axios.put(`${address}/api/posts/${editPostId}`, { content: editContent }, {
        withCredentials: true
      });
      toast.success('Đã cập nhật bài viết!');
      setEditPostId(null);
      setEditContent('');
      fetchPosts();
    } catch (err) {
      toast.error('Không thể cập nhật bài viết');
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`${address}/api/posts/${postId}/like`, {}, { withCredentials: true });
      fetchPosts();
    } catch (err) {
      toast.error('Không thể like bài viết');
    }
  };

  const openCommentModal = (postId) => {
    setActivePostId(postId);
    setShowCommentModal(true);
  };

  const handleComment = async () => {
    const text = commentText[activePostId];
    if (!text?.trim()) return;
    try {
      await axios.post(`${address}/api/posts/${activePostId}/comment`, { text }, { withCredentials: true });
      setCommentText(prev => ({ ...prev, [activePostId]: '' }));
      fetchPosts();
      setShowCommentModal(false);
    } catch (err) {
      toast.error('Không thể bình luận');
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5' }}>
      <div className="container container-body">
        <div className="row row-cols-3 mt-2">
          <SidebarLeft />

          <div className="col-lg-5 col-12 border border-2 rounded-3 mx-auto bg-body-secondary scroll-on-hover" style={{ maxHeight: '85vh' }}>
            {/* Story */}
            <StorySection />


            {/* Create Post */}
            <div className="bg-white border border-2 rounded-2 p-3 mt-2">
              <div className="row align-items-center">
                <div className="col-2">
                  <img
                    src={avatar}
                    className="img-fluid rounded-circle"
                    alt="User Avatar"
                  />
                </div>
                <div className="col-10">
                  <input type="text" className="form-control border-0 bg-light" placeholder="Share your thoughts..." value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
              </div>

              {selectedMediaPreview && (
                <div className="mt-2">
                  {file?.type.startsWith('image/') ? (
                    <img src={selectedMediaPreview} alt="Preview" className="img-fluid rounded" />
                  ) : (
                    <div className="ratio ratio-16x9">
                      <video controls className="w-100 rounded">
                        <source src={selectedMediaPreview} type={file?.type} />
                        Trình duyệt không hỗ trợ video.
                      </video>
                    </div>
                  )}
                </div>
              )}

              <input
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageChange}
              />

              <div className="d-flex gap-2 flex-wrap mt-2">
                <button className="btn btn-light d-flex align-items-center gap-2 rounded-pill shadow-sm" onClick={() => fileInputRef.current.click()}>
                  <i className="fas fa-image text-success"></i> Photo/Video
                </button>
                <button className="btn btn-primary rounded-pill ms-auto" onClick={handlePostSubmit}>
                  Đăng bài
                </button>
              </div>
            </div>

            {/* Feed */}
            <div className="container p-3">
              <h5 className="text-xl font-bold mb-4">Your Feed</h5>

              {posts.length === 0 ? (
                <p className="text-muted">Chưa có bài viết nào...</p>
              ) : (
                posts.map((post) => (
                  <div className="bg-white p-4 rounded-lg shadow mb-4" key={post._id}>
                    <div className="d-flex align-items-center mb-3">
                      <img src={post.author?.avatar} className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} alt="User Avatar" />
                      <div>
                        <h6 className="mb-0">{post.author?.name}</h6>
                        <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                      </div>
                    </div>

                    {editPostId === post._id ? (
                      <>
                        <textarea className="form-control mb-2" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                        <div className="d-flex gap-2 justify-content-end">
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditPostId(null)}>Hủy</button>
                          <button className="btn btn-sm btn-success" onClick={handleEditPost}>Lưu</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>{post.content}</p>
                        {post.image && <img src={`http://localhost:3000${post.image}`} className="img-fluid rounded-2" alt="Post" />}
                        {post.video && (
                          <video controls className="w-100 rounded">
                            <source src={`http://localhost:3000${post.video}`} type="video/mp4" />
                            Trình duyệt không hỗ trợ video.
                          </video>
                        )}
                      </>
                    )}

                    {/* Menu */}
                    {post.author?._id === currentUserId && (
                      <div className="position-relative text-end mb-2">
                        <button className="btn btn-light btn-sm" onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)}>
                          <FaEllipsisV />
                        </button>
                        {openMenuId === post._id && (
                          <div className="position-absolute bg-white border rounded shadow-sm p-2" style={{ right: 0, zIndex: 1000 }}>
                            <button className="dropdown-item text-start" onClick={() => {
                              setEditPostId(post._id);
                              setEditContent(post.content);
                              setOpenMenuId(null);
                            }}>✏️ Sửa bài viết</button>
                            <button className="dropdown-item text-start text-danger" onClick={() => {
                              handleDeletePost(post._id);
                              setOpenMenuId(null);
                            }}>🗑️ Xoá bài viết</button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Like & Comment */}
                    <div className="d-flex justify-content-between text-muted mt-2">
                      <span onClick={() => handleLike(post._id)} style={{ cursor: 'pointer' }}>
                        <FaHeart color={post.likes.includes(currentUserId) ? 'red' : 'gray'} className="me-1" /> {post.likes.length} Likes
                      </span>
                      <span style={{ cursor: 'pointer' }} onClick={() => openCommentModal(post._id)}>
                        <i className="far fa-comment me-1"></i> {post.comments.length} Comments
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <FriendList />
        </div>
      </div>

      {/* Modal bình luận */}
      {showCommentModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="bg-white rounded shadow p-4" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h5 className="mb-3">Bình luận</h5>

            {/* Form nhập bình luận */}
            <input
              type="text"
              className="form-control"
              placeholder="Nhập bình luận..."
              value={commentText[activePostId] || ''}
              onChange={(e) => setCommentText(prev => ({ ...prev, [activePostId]: e.target.value }))}
            />
            <div className="mt-3 d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowCommentModal(false)}>Đóng</button>
              <button className="btn btn-primary" onClick={handleComment}>Gửi</button>
            </div>

            <hr />

            {/* Danh sách bình luận */}
            <div className="mt-3">
              {posts.find(p => p._id === activePostId)?.comments.length === 0 ? (
                <p className="text-muted">Chưa có bình luận nào.</p>
              ) : (
                posts.find(p => p._id === activePostId)?.comments.map((c, index) => (
                  <div key={index} className="mb-3 border-bottom pb-2">
                    <strong>{c.user?.name || 'Người dùng'}:</strong>
                    <p className="mb-0">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
