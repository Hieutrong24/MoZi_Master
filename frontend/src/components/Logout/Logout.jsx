import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
  
    localStorage.setItem("login_status", JSON.stringify(0));  
    window.location.href = "/login";
    navigate("/login");  
  };

  return (
    <Button variant="outline-danger" onClick={handleLogout}>
      Đăng xuất <i className="fas fa-sign-out-alt ms-2"></i>
    </Button>
  );
};

export default LogoutButton;
