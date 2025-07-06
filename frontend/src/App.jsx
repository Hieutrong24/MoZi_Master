import { useContext, useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { toast, ToastContainer } from "react-toastify";
import { fetchAccount } from "./services/api";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Home from "./components/Home/Home";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import VideoPage from "./components/Video/Video";
import MainNavbar from "./components/Navbar/Navbar";
import MarketplacePage from "./components/Marketplace/Marketplace";
import GroupPage from "./components/Groups/Groups";
import GamesPage from "./components/Games/Games";
import MessageAllPage from "./components/Conversation/Message/MessageAll";
import ViewProfilePage from "./components/ViewProfile/ViewProfile";
import Friends from "./components/FriendList/Friends";
import UserProfilePage from "./components/ViewProfile/UserProfilePage";

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

function App() {
  const [stage, setStage] = useState("login");
  const [loading, setLoading] = useState(true);
  const { setAuthState, setIsAuthenticated } = useContext(AuthContext);

  const login_status = Number(localStorage.getItem("login_status")) || 0;

  useEffect(() => {
    const handleFetchAccount = async () => {
      try {
        const res = await fetchAccount();
        if (!res.success) {
          return toast.error(res.msg);
        }
        setAuthState(res.data);
        setIsAuthenticated(true);
        setStage("dashboard");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (login_status === 1) {
      handleFetchAccount();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        {login_status === 1 ? (
          <SocketProvider>
            <AppRouter />
          </SocketProvider>
        ) : (
          <div className="flex justify-center items-center h-screen">
            {stage === "login" && <Login setStage={setStage} />}
            {stage === "register" && <Register setStage={setStage} />}
          </div>
        )}
      </Router>
      <ToastContainer />
    </>
  );
}

function AppRouter() {
  const location = useLocation();
  const login_status = Number(localStorage.getItem("login_status")) || 0;

  const showNavbar = login_status === 1;

  return (
    <>
      {showNavbar && <MainNavbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/groups" element={<GroupPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/messageall" element={<MessageAllPage />} />
        <Route path="/viewprofile" element={<ViewProfilePage />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/messageall/:friendId" element={<MessageAllPage />} />
        <Route path="/message" element={<MessageAllPage />} />
        <Route path="/message/:friendId" element={<MessageAllPage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />

        <Route
          path="*"
          element={
            <div className="text-center mt-5">
              <h2>404 - Không tìm thấy trang</h2>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default AppWrapper;
