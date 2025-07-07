import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewProfilePage = () => {
  const address = import.meta.env.VITE_BACKEND_URL
  const { authState } = useContext(AuthContext);
  const { name, avatar, _id } = authState || {};
  const [friendCount, setFriendCount] = useState(0);
  const [friends, setFriends] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (!_id) return;

    const fetchFriendData = async () => {
      try {
        const res = await axios.get(`${address}/api/friends/list`, {
          withCredentials: true,
        });
        setFriends(res.data.data || []);
        setFriendCount(res.data.data?.length || 0);
      } catch (err) {
        console.error("Lỗi lấy danh sách bạn bè:", err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`${address}/api/posts/user/${_id}`, {
          withCredentials: true,
        });
        setUserPosts(res.data.posts || []);
      } catch (err) {
        console.error("Lỗi lấy bài viết người dùng:", err);
      }
    };

    fetchFriendData();
    fetchUserPosts();
  }, [_id]);

  const handlePostSubmit = async () => {
    if (!content && !imageFile && !videoFile) return;

    const formData = new FormData();
    formData.append("content", content);
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      const res = await axios.post(`${address}/api/posts`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUserPosts([res.data.post, ...userPosts]);
      setContent("");
      setImageFile(null);
      setVideoFile(null);
    } catch (err) {
      console.error("Lỗi đăng bài:", err);
    }
  };

  return (
    <div className="container bg-body-secondary">
      <div className="row">
        <div className="col-12 col-lg-7 scroll-on-hover" style={{ height: '600px' }}>
          <div className="bg-white border border-2 rounded-3 p-2 position-relative">
            <img
              src="./Images/AnhBia/bai-hat-ve-hoa-anh-dao-nhat-ban_113553327.jpg"
              className="img-fluid"
              style={{ height: '200px', width: '100%', objectFit: 'cover' }}
              alt="cover"
            />
            <div className="d-flex align-items-center position-absolute" style={{ top: '170px', left: '30px' }}>
              <img
                src={avatar}
                alt="avatar"
                className="rounded-circle border border-4 border-white"
                style={{ height: '100px', width: '100px', objectFit: 'cover' }}
              />
              <div className="ms-3 mt-5">
                <h4 className="mb-0">{name}</h4>
                <p className="text-muted">{friendCount} bạn bè</p>
              </div>
            </div>
            <div className="custom-mt-responsive d-flex justify-content-end">
              <Button variant="outline-danger" className="me-2">
                <i className="fas fa-pen"></i> <span>Edit profile</span>
              </Button>
              <Button variant="outline-secondary">
                <i className="fas fa-ellipsis-h"></i>
              </Button>
            </div>
          </div>

          {/* Post Input */}
          <div className="bg-white border border-2 rounded-2 mt-3 p-3">
            <div className="d-flex align-items-start mb-2">
              <img src={avatar} className="rounded-circle me-3" alt="Avatar" style={{ height: '40px', width: '40px', objectFit: 'cover' }} />
              <textarea
                className="form-control border-0 bg-light"
                rows={2}
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <label className="btn btn-light rounded-pill shadow-sm">
                <i className="fas fa-image text-success me-2"></i>Photo
                <input type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files[0])} />
              </label>
              <label className="btn btn-light rounded-pill shadow-sm">
                <i className="fas fa-video text-primary me-2"></i>Video
                <input type="file" accept="video/*" hidden onChange={(e) => setVideoFile(e.target.files[0])} />
              </label>
              <Button onClick={handlePostSubmit} className="ms-auto btn btn-primary rounded-pill shadow-sm">Đăng bài</Button>
            </div>
          </div>

          {/* User Posts */}
          <div className="mt-3">
            {userPosts.length === 0 ? (
              <div className="text-muted text-center">Chưa có bài viết nào.</div>
            ) : (
              userPosts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={post.author.avatar || "./Images/Avarta/th (1).jpg"}
                      className="rounded-circle me-3"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      alt="User Avatar"
                    />
                    <div>
                      <h6 className="mb-0">{post.author.name}</h6>
                      <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                  <p>{post.content}</p>
                  {post.image && (
                    <img
                      src={`${address}${post.image}`}
                      className="img-fluid rounded mb-3"
                      alt="Post"
                    />
                  )}
                  {post.video && (
                    <div className="ratio ratio-16x9">
                      <video controls className="w-100 rounded mb-3">
                        <source src={`${address}${post.video}`} type="video/mp4" />
                        Trình duyệt không hỗ trợ video.
                      </video>
                    </div>
                  )}
                  <div className="d-flex justify-content-between text-muted">
                    <span><i className="far fa-heart me-1"></i>{post.likes.length} Likes</span>
                    <span><i className="far fa-comment me-1"></i>{post.comments.length} Comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar - Friend & Photo info */}
        <div className="mt-3 col-lg-4 d-none d-lg-inline bg-body-secondary scroll-on-hover" style={{ height: '580px' }}>
          <div className="mt-3 col-lg-4 d-none d-lg-inline bg-body-secondary scroll-on-hover" style={{ height: '580px' }}>
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h5 className="mb-3" style={{ fontWeight: 'bold' }}>About</h5>
              <p className="text-muted mb-4">
                He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire
                difficulty gay assistance joy.
              </p>

              <div className="d-flex align-items-center mb-2">
                <i className="fa-solid fa-calendar-days me-3" style={{ color: '#6c757d' }}></i> {/* Icon lịch */}

                <span className="text-dark">Born: <span style={{ fontWeight: 'bold' }}>October 20, 1990</span></span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <i className="fa-solid fa-heart me-3" style={{ color: '#6c757d' }}></i> {/* Icon trái tim */}

                <span className="text-dark">Status: <span style={{ fontWeight: 'bold' }}>Single</span></span>
              </div>

              <div className="d-flex align-items-center mb-0"> {/* mb-0 để không có margin dưới cùng */}
                <i className="fa-solid fa-envelope me-3" style={{ color: '#6c757d' }}></i> {/* Icon email */}

                <span className="text-dark">Email: <span style={{ fontWeight: 'bold' }}>example@gmail.com</span></span>
              </div>
            </div>


            <div className="bg-white mt-3 rounded-3">
              <div className="row p-3">
                <h5 className="col">Photos</h5> <Button variant="outline-info" className=" col-4 bg-light-info ms-auto">See all photo</Button>
              </div>

              <div className="row row-cols-2 justify-content-center">
                <div className="col-5"><img src="./Images/Post/01.jpg" className="img img-fluid rounded-3 " /></div>
                <div className="col-5"><img src="./Images/Post/02.jpg" className="img img-fluid rounded-3 " /></div>
              </div>
              <div className="row row-cols-3 justify-content-center p-3">
                <div className="col-4"><img src="./Images/Post/03.jpg" className="img img-fluid rounded-3 " /></div>
                <div className="col-4"><img src="./Images/Post/04.jpg" className="img img-fluid rounded-3 " /></div>
                <div className="col-4"><img src="./Images/Post/05.jpg" className="img img-fluid rounded-3 " /></div>
              </div>
            </div>

            <div className="bg-white mt-3 rounded-3">
              <div className="d-flex p-3">
                <h4 className="">Friends</h4> <span className="ms-1 p-1 bg-danger bg-opacity-25">{friendCount}</span><Button variant="outline-info" className="ms-auto bg-light-info">See all friends</Button>
              </div>
              <div className="row row-cols-2 p-4">
                {friends.length > 0 ? (
                  friends.map((friend, index) => (
                    <Link to={`/profile/${friend._id}`} key={friend._id} className="col-5 mb-4 rounded-3 p-3 border border-2 text-center ms-3">
                      {/* <div key={friend._id || index} className="col-5 mb-4 rounded-3 p-3 border border-2 text-center ms-3"> */}
                      <img
                        className="img img-fluid rounded-circle mb-2"
                        src={friend.avatar || "./Images/Avarta/th (1).jpg"}
                        alt="avatar"
                        style={{ height: "70px", width: "70px", objectFit: "cover" }}
                      />
                      <h5>{friend.name}</h5>
                      <p style={{ fontSize: "12px" }}>{friend.mutualCount || 0} mutual connections</p>
                      <div>
                        <Button variant="info" className="p-1 text-white p-2" title="Message">
                          <i className="fa-solid fa-comment-dots"></i>
                        </Button>
                        <Button
                          variant="danger"
                          className="p-1 text-white ms-2 p-2"
                          title="Remove friend"
                          onClick={() => handleRemoveFriend(friend._id)}
                        >
                          <i className="fa-solid fa-user-slash"></i>
                        </Button>
                      </div>
                      {/* </div> */}
                    </Link>
                  ))
                ) : (
                  <div className="col-12 text-muted text-center">Bạn chưa có bạn bè nào.</div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
