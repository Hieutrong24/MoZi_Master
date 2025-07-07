import { useState, useContext } from "react";
import { login } from "../../services/api";
import { toast } from "react-toastify";
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = ({ setStage }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setAuthState, setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);

    if (!res?.success) {
      return toast.error(res?.msg || "Đăng nhập thất bại");
    }

    console.log('Login successful:', res);

    toast.success("Đăng nhập thành công!");
    localStorage.setItem("login_status", JSON.stringify(1));
    const user = res.data;
    localStorage.setItem("user", JSON.stringify(user));

    setAuthState({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
    setIsAuthenticated(true);

    navigate("/home");
  };

  return (
    <div className="container">
      <div className="row row-cols-2">
        <div className="col-lg-4 d-none d-lg-block mx-auto mt-5">
          <img
            className="img-fluid"
            src="/Images/Logo/custom_login_template-607e28ac.svg"
            alt="Logo"
          />
        </div>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 border bg-light rounded-4 p-4 p-md-5 mt-3 me-lg-5 mx-sm-auto">
          <a className="d-block text-danger text-center fw-bold mb-4 text-decoration-none">
            <h2>MoZi</h2>
          </a>
          <hr className="bg-dark" />


          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="Nhập email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <button type="submit" className="w-100 btn btn-primary fw-bold">
                Đăng nhập
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <h6>Connect with</h6>
          </div>

          <div className="d-flex flex-wrap justify-content-center mt-3">
            <div className="flex-fill mx-1 mb-2">
              <button className="btn btn-primary w-100 p-2">
                <FaFacebookF className="mx-auto" />
              </button>
            </div>
            <div className="flex-fill mx-1 mb-2">
              <button className="btn btn-info text-white w-100 p-2">
                <FaTwitter className="mx-auto" />
              </button>
            </div>
            <div className="flex-fill mx-1 mb-2">
              <button className="btn btn-danger w-100 p-2">
                <FaGoogle className="mx-auto" />
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-decoration-none fw-bold">
              <h6>Forget Password</h6>
            </a>
          </div>

          <div className="mt-3">
            <h6 className="text-center">
              Bạn chưa có tài khoản?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setStage("register")}
              >
                Đăng ký
              </button>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
