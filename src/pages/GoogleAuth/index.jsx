import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode"; 
import { useNavigate } from "react-router-dom";
import { config } from "../../api/config";

const CLIENT_ID =
  "810184338477-pmsdub9rnjnfuki59auk38m0ktcl5u2v.apps.googleusercontent.com";

const GoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded User:", decoded);

      const idToken = credentialResponse.credential;
      const email = decoded.email;

      if (!idToken) {
        throw new Error("Google ID Token is missing");
      }

      if (!email) {
        throw new Error("User email is missing");
      }

      // Send token to backend for verification
      const res = await fetch(`${config.BASEURL}/user/auth/validate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken, email }),
      });

      const data = await res.json();
      console.log("Server Response:", data);

      if (data?.error) {
        setError(data.error.message);
        alert("Login Failed: User does not exist. Please try again.");
      } else if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user in localStorage
        setUser(data.user);
        navigate("/enable-location"); // Redirect after login
      }
    } catch (apiError) {
      console.error("Login API Error:", apiError);
      alert(apiError?.message || "Something went wrong");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign-In Error:", error);
    setError("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Google Authentication</h2>
        {user ? (
          <div>
            <h3>Welcome, {user.name}</h3>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
