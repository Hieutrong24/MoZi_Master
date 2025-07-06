import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// ======= [1] Tạo bài viết mới =======
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    let imageUrl = null;
    let videoUrl = null;

    if (req.files?.image) {
      imageUrl = `/uploads/images/${req.files.image[0].filename}`;
    }
    if (req.files?.video) {
      videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }

    const newPost = new Post({
      author: userId,
      content,
      image: imageUrl,
      video: videoUrl,
    });

    await newPost.save();

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    res.status(500).json({ success: false, message: "Lỗi tạo bài viết" });
  }
};


// ======= [2] Lấy bài viết bạn bè + bản thân =======
export const getFriendPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "_id");

    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    const friendIds = (user.friends || []).map(friend => new mongoose.Types.ObjectId(friend._id));
    friendIds.push(new mongoose.Types.ObjectId(req.user._id));

    const posts = await Post.find({ author: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar");

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Lỗi lấy bài viết bạn bè:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy bài viết bạn bè" });
  }
};

// ======= [3] Xoá bài viết =======
export const deletePost = async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ msg: "Bài viết không tồn tại" });
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Bạn không có quyền xóa bài viết này" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ msg: "Đã xóa bài viết thành công", success: true });
  } catch (err) {
    console.error("Lỗi xóa bài viết:", err);
    res.status(500).json({ msg: "Lỗi máy chủ", success: false });
  }
};

// ======= [4] Cập nhật bài viết =======
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: "Không tìm thấy bài viết" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Không có quyền sửa bài viết" });
    }

    post.content = content || post.content;

    // Cập nhật ảnh/video nếu có
    if (req.files?.image) {
      post.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.video) {
      post.video = `/uploads/${req.files.video[0].filename}`;
    }

    await post.save();
    res.status(200).json({ msg: "Cập nhật bài viết thành công", post });
  } catch (err) {
    console.error("Lỗi cập nhật bài viết:", err);
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// ======= [5] Lấy bài viết của 1 người dùng cụ thể =======
export const getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar");

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Lỗi lấy bài viết theo user:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy bài viết" });
  }
};

// controllers/post.controller.js
export const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes.pull(userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }

    await post.save();
    res.status(200).json({ success: true, liked: !liked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xử lý like" });
  }
};

export const commentPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.status(201).json({ success: true, comment: post.comments[post.comments.length - 1] });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi bình luận" });
  }
};

