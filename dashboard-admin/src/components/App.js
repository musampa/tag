import React, { useState } from "react";
import Login from "./login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLogin = (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return token ? (
    <Dashboard token={token} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}

export default App;