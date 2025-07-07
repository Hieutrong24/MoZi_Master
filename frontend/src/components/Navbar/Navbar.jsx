import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faHome,
  faTv,
  faStore,
  faUsers,
  faGamepad,
  faTh,
  faCommentAlt,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import MessagePopup from '../Conversation/Message/Message';
import LogoutButton from '../Logout/Logout';

const MainNavbar = () => {
  const { authState } = useContext(AuthContext);
  const { name, avatar } = authState || {};
  const navigate = useNavigate();
  const location = useLocation();

  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const isActive = (path) => location.pathname === path;
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  const handleToggleMessage = () => {
    setShowMessagePopup(!showMessagePopup);
  };

  return (
    <div className="bg-white shadow sticky-top" style={{ zIndex: 1000, top: 0 }}>
      <Container fluid>
        <Navbar expand="lg">
          <Container>
            {/* Logo */}
            <Navbar.Brand
              className="fw-bold fs-3"
              style={{ color: '#ff8906', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              MoZi
            </Navbar.Brand>

            {/* Toggle */}
            <Navbar.Toggle aria-controls="navbarNav" className="btn btn-outline-secondary" />

            <Navbar.Collapse id="navbarNav" className="mt-2 mt-lg-0">
              {/* Search */}
              <Form className="d-flex mx-auto mb-3 mb-lg-0 w-100 justify-content-center" role="search">
                <FormControl type="search" placeholder="Tìm kiếm..." className="me-2 w-75" />
                <Button variant="outline-dark" type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Form>

              {/* Main Navigation */}
              <Nav className="w-100 d-flex flex-column flex-lg-row align-items-center justify-content-center">
                {[
                  { icon: faHome, text: 'Home', path: '/home' },
                  { icon: faTv, text: 'Video', path: '/video' },
                  { icon: faStore, text: 'Marketplace', path: '/marketplace' },
                  { icon: faUsers, text: 'Groups', path: '/groups' },
                  { icon: faGamepad, text: 'Games', path: '/games' },
                ].map(({ icon, text, path }) => (
                  <Nav.Item className="p-2 text-center" key={text}>
                    <OverlayTrigger placement="bottom" overlay={renderTooltip(text)}>
                      <Button
                        variant={
                          isActive(path)
                            ? 'light text-primary border-bottom border-3 border-primary'
                            : 'light'
                        }
                        className="rounded-4 w-100"
                        onClick={() => navigate(path)}
                      >
                        <FontAwesomeIcon icon={icon} className="fs-4" />
                        <span className="d-inline d-lg-none ms-2">{text}</span>
                      </Button>
                    </OverlayTrigger>
                  </Nav.Item>
                ))}
              </Nav>

              {/* Action Buttons */}
              <Nav className="w-100 d-flex flex-column flex-lg-row align-items-center justify-content-center mt-2 gap-1">
                {[
                  { icon: faTh, text: 'Menu' },
                  { icon: faCommentAlt, text: 'Messages', onClick: handleToggleMessage },
                  { icon: faBell, text: 'Notifications' },
                ].map(({ icon, text, onClick }) => (
                  <Nav.Item className="p-2 text-center" key={text}>
                    <OverlayTrigger placement="bottom" overlay={renderTooltip(text)}>
                      <Button variant="outline-info" className="w-100" onClick={onClick}>
                        <FontAwesomeIcon icon={icon} />
                        <span className="d-inline d-lg-none ms-2">{text}</span>
                      </Button>
                    </OverlayTrigger>
                  </Nav.Item>
                ))}
              </Nav>

              {/* Avatar + Name */}
              <Nav className="ms-lg-3 d-flex align-items-center mt-3 mt-lg-0">
                <NavDropdown
                  align="end"
                  title={
                    <>
                      <img
                        src={avatar || 'https://via.placeholder.com/40'}
                        className="rounded-circle border border-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        alt="User Avatar"
                      />
                      <span className="ms-2 d-inline d-lg-none fw-semibold">{name || 'User'}</span>
                    </>
                  }
                  id="nav-profile-dropdown"
                  className="d-flex align-items-center"
                >
                  <NavDropdown.Item onClick={() => navigate('/viewprofile')}>View Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/settings')}>Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <div className="flex justify-center text-center w-full">
                    <LogoutButton />
                  </div>
                </NavDropdown>
              </Nav>

            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>

      <MessagePopup show={showMessagePopup} onClose={() => setShowMessagePopup(false)} />
    </div>
  );
};

export default MainNavbar;
