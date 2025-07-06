import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js"; 

export const register = async(req , res )=> {
    const {name, email, password, gender, phone, dob, address} =req.body;

    try{
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            gender,
            phone,
            dob,
            address
        });

        await user.save();
        res.json({sucess: true, msg: "Đăng ký thành công"});

    }
    catch (err){
        console.error(err);
        res.status(500).json({sucess: false, msg:  "Lỗi server" });
    }
};