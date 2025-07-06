// backend/deleteUser.js

import mongoose from "mongoose";
import User from "./models/user.model.js"; // Đảm bảo đường dẫn đúng đến user.model.js

const MONGO_URI = "mongodb://localhost:27017/mozi"; // Đảm bảo URI này khớp với URI của bạn

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Đã kết nối MongoDB");

        // Thay đổi email này thành email của người dùng bạn muốn xóa
        const emailToDelete = "tronghieungo20@gmail.com"; 

        const result = await User.deleteOne({ email: emailToDelete });

        if (result.deletedCount > 0) {
            console.log(`🎉 Đã xóa thành công người dùng với email: ${emailToDelete}`);
        } else {
            console.log(`Không tìm thấy người dùng với email: ${emailToDelete} để xóa.`);
        }
        process.exit(0);
    } catch (err) {
        console.error("Lỗi:", err.message);
        process.exit(1);
    }
};

run();