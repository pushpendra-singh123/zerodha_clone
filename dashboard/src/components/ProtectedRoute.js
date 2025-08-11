import React from "react";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";

const ProtectedRoute = ({ children }) => {
  const { user, loading, login } = useAuth();
  const [showLogin, setShowLogin] = React.useState(true);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <Login onLogin={login} switchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup onSignup={login} switchToLogin={() => setShowLogin(true)} />
    );
  }

  return children;
};

export default ProtectedRoute;
