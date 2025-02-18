import React, { useEffect, useState } from "react";
import Editing from "../../assets/editing.png";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../api/ApiService";
import { logout } from "../../redux/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../utils/helperFunc";
import { clearCart } from "../../redux/slice/CartSlice";

const Account = () => {
  const [userDetails, setUserDetails] = useState([]);
  const userId = useSelector((state) => state.auth.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAccount = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getUserProfile(userId._id);
      setUserDetails(res.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  const handleLogout = () => {
    dispatch(setLoading(true));
    dispatch(logout());
    navigate("/login");
    dispatch(clearCart());
    dispatch(setLoading(false));
  };

  useEffect(() => {
    getAccount();
  }, [userId]);

  return (
    <Box className="account-page">
      <header className="header">
        <h1>My Account</h1>
        <Box className="icons">
          <i className="fa fa-calendar" title="Calendar"></i>
          <i className="fa fa-bell" title="Notifications"></i>
        </Box>
      </header>
      <Box className="profile-section">
        <Box className="profile-info">
          <img
            src="https://walnuteducation.com/static/core/images/icon-profile.png"
            alt="Profile"
            className="profile-image"
          />
          <Box className="user-details">
            <h2>{userDetails.username}</h2>
            <p>{userDetails.email}</p>
          </Box>
        </Box>
        <button className="edit-btn">
          <img src={Editing} alt="Not Found" />
        </button>
      </Box>
      <Box className="options">
        <h3>General</h3>

        <ul>
          <Link to={"/profile"}>
            <li>
              <i className="fa fa-ticket"></i> Account
              <i className="fa fa-chevron-right"></i>
            </li>
          </Link>
          <li>
            <i className="fa fa-heart"></i> My Tickets
            <i className="fa fa-chevron-right"></i>
          </li>
          <li>
            <i className="fa fa-info-circle"></i> About Us
            <i className="fa fa-chevron-right"></i>
          </li>
          <li>
            <i className="fa fa-file-alt"></i> Privacy Policy
            <i className="fa fa-chevron-right"></i>
          </li>
          <li>
            <i className="fa fa-question-circle"></i> Help Center
            <i className="fa fa-chevron-right"></i>
          </li>
          <li>
            <i className="fa fa-bell"></i> Terms & Conditions
            <i className="fa fa-chevron-right"></i>
          </li>
          <li onClick={handleLogout}>
            <i className="fa fa-bell"></i> Logout
            <i className="fa fa-chevron-right"></i>
          </li>
        </ul>
      </Box>
    </Box>
  );
};

export default Account;
