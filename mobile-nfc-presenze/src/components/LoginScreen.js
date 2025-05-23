import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ setToken, setUtente }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    console.log('Tentativo login con:', { email, password }); // LOG AGGIUNTO
    try {
      const res = await axios.post('http://192.168.1.108:3001/api/utenti/login', { email, password });
      console.log('Risposta login:', res.data);
      setToken(res.data.token);
      setUtente(res.data.utente);
    } catch (err) {
      setError('Credenziali errate');
      // Log dettagliato errore
      if (err.response) {
        console.log('Errore login response:', err.response.status, err.response.data);
      } else {
        console.log('Errore login:', err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 12 },
  error: { color: 'red', marginTop: 10 },
});
