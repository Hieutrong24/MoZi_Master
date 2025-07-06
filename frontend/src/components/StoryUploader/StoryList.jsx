import React from "react";

const StoryList = ({ stories, onStoryClick }) => {
  const address = "http://localhost:3000";

  return (
    <>
      {stories.map((story) => (
        <div
          key={story._id}
          className="story-card position-relative text-white text-center rounded-4 shadow"
          style={{
            width: "110px",
            height: "190px",
            backgroundImage: `url(${address}${story.mediaUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flex: "0 0 auto",
            cursor: "pointer",
          }}
          onClick={() => onStoryClick(story)} // Gọi hàm callback khi click
        >
          {/* Avatar góc trái */}
          <div className="position-absolute top-2 start-2">
            <img
              src={story.user.avatar || "/Images/Avarta/default.jpg"}
              alt="user"
              className="rounded-circle border border-2 border-primary"
              style={{ width: "35px", height: "35px", objectFit: "cover" }}
            />
          </div>

          {/* Tên người đăng */}
          <div className="position-absolute bottom-0 w-100 bg-dark bg-opacity-50 rounded-bottom-4 py-1">
            <small className="text-white">{story.user.name}</small>
          </div>
        </div>
      ))}
    </>
  );
};

export default StoryList;
