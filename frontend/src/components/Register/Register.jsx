import { useState } from "react";
import { register } from "../../services/api";
import { toast } from "react-toastify";

const Register = ({ setStage }) => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dob: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register(
        form.email,
        form.name,
        form.password,
        form.gender,
        form.phone,
        form.dob,
        form.address
      );

      if (!res?.success) {
        return toast.error(res?.msg);
      }

      toast.success(res?.msg);
      setForm({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
        phone: "",
        gender: "",
        dob: "",
        address: ""
      });
      setStage("login");
    } catch (error) {
      console.error(error);
    }


    let loading = 1;
    const duration = 5000;
    const max = 100;
    const intervalTime = duration / max;
    //const biteIds = []
    const biteIds = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
    const numBites = biteIds.length;
    const biteTime = Math.floor(max / numBites);
    let bitesTaken = 0

    const interval = setInterval(() => {
      if (loading <= max) {
        if (loading == biteTime * (bitesTaken + 1)) {
          document.getElementById(biteIds[bitesTaken]).style.opacity = '1';
          bitesTaken++;
        }
        loading++;
      } else {
        // just cycle again
        // otherwise use clearInterval(interval);
        for (id in biteIds) {
          document.getElementById(biteIds[id]).style.opacity = '0';
        }
        loading = 0
        bitesTaken = 0
      }
    }, intervalTime);

    //====nut dieu huong
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el))

    //==========
    const currentPath = window.location.pathname.replace(/\/$/, "").toLowerCase();

    document.querySelectorAll(".nav-btn").forEach(btn => {
      const anchor = btn.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href").replace(/\/$/, "").toLowerCase();
        if (href === currentPath) {
          btn.classList.add("active");
        }
      }
    });
  };

  
  return (
      <div className="container">
        <div className="row justify-content-lg-end justify-content-center">
          <div className="body col-6 d-none d-lg-block">
            <div className="cookie-box">
              <div id="first" className="bite"></div>
              <div id="second" className="bite"></div>
              <div id="third" className="bite"></div>
              <div id="fourth" className="bite"></div>
              <div id="fifth" className="bite"></div>
              <div id="sixth" className="bite"></div>
              <div className="choc-chip-box">
                <div className="choc-chip regular" style={{ transform: "translate(80px, 15px) rotate(40deg)" }}></div>
                <div className="choc-chip regular" style={{ transform: "translate(10px, 15px) rotate(70deg)" }}></div>
                <div className="choc-chip triangle" style={{ transform: "translate(120px, 10px) rotate(45deg)" }}></div>
                <div className="choc-chip triangle" style={{ transform: "translate(60px, -10px)" }}></div>
                <div className="choc-chip triangle" style={{ transform: "translate(95px, 5px) rotate(130deg)" }}></div>
                <div className="choc-chip regular" style={{ transform: "translate(30px, -20px)" }}></div>
              </div>
              <span className="cookie"></span>
              <span className="cookie2"></span>
            </div>
            <h2 className="loading">
              <span>L</span>
              <span>O</span>
              <span>A</span>
              <span>D</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </h2>
          </div>

          <div className="border rounded-4 col-12 col-sm-10 col-md-8 col-lg-6 p-4 p-md-5 bg-dark text-white ui">
            <h5 className="fw-bold text-center mb-4 text-danger">ĐĂNG KÝ</h5>
            <hr className="border-secondary" />

            <div className="mb-3">
              <label className="form-label">Tên tài khoản</label>
              <input type="text" name="name" placeholder="Nhập tên tài khoản" className="form-control rounded-3" value={form.name} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input type="password" name="password" placeholder="Nhập mật khẩu" className="form-control rounded-3" value={form.password} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Nhập lại mật khẩu</label>
              <input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" className="form-control rounded-3" value={form.confirmPassword} onChange={handleChange} />
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label className="form-label">Email</label>
                <input type="email" name="email" placeholder="Nhập email" className="form-control rounded-3" value={form.email} onChange={handleChange} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Số điện thoại</label>
                <input type="text" name="phone" placeholder="Nhập số điện thoại" className="form-control rounded-3" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label className="form-label">Giới tính</label>
                <select name="gender" className="form-select rounded-3" value={form.gender} onChange={handleChange}>
                  <option value="">Chọn giới tính...</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="khac">Khác</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Ngày sinh</label>
                <input type="date" name="dob" className="form-control rounded-3" value={form.dob} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Địa chỉ</label>
              <input type="text" name="address" placeholder="Nhập địa chỉ" className="form-control rounded-3" value={form.address} onChange={handleChange} />
            </div>

            <div>
              <button type="button" className="btn btn-primary w-100 p-2 fw-bold mt-5" onClick={handleRegister}>
                <h6>ĐĂNG KÝ</h6>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;
