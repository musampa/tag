import React, { useState } from 'react';
import LoginScreen from './src/components/LoginScreen';
import HomeScreen from './src/components/HomeScreen';

export default function App() {
  const [token, setToken] = useState(null);
  const [utente, setUtente] = useState(null);

  if (!token) {
    return <LoginScreen setToken={setToken} setUtente={setUtente} />;
  }
  return <HomeScreen token={token} utente={utente} />;
}
