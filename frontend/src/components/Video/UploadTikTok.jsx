import React, { useEffect, useRef } from "react";

const TikTokEmbed = ({ videoId, authorUsername }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Xóa script cũ nếu có
    const oldScript = document.getElementById("tiktok-embed-script");
    if (oldScript) {
      oldScript.remove();
    }

    // Thêm script mới
    const script = document.createElement("script");
    script.id = "tiktok-embed-script";
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, [videoId, authorUsername]);

  return (
    <blockquote
      className="tiktok-embed"
      cite={`https://www.tiktok.com/@${authorUsername}/video/${videoId}`}
      data-video-id={videoId}
      style={{ maxWidth: "605px", minWidth: "325px", margin: "0 auto" }}
      ref={ref}
    >
      <section>Đang tải video TikTok...</section>
    </blockquote>
  );
};

export default TikTokEmbed;
