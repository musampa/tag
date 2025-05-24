import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Linking } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ setToken, setUtente }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('=== LOGIN BUTTON PREMUTO ==='); // LOG DEBUG INIZIO
    setError('');
    setLoading(true);
    console.log('Tentativo login con:', { email, password }); // LOG DEBUG
    try {
      const res = await fetch('http://192.168.1.108:3001/api/utenti/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errData = await res.json();
        setError('Credenziali errate');
        console.log('Errore login response:', res.status, errData); // LOG DEBUG
        return;
      }
      const data = await res.json();
      console.log('Risposta login:', data); // LOG DEBUG
      setToken(data.token);
      setUtente(data.utente);
    } catch (err) {
      setError('Errore di rete');
      console.log('Errore login:', err.message); // LOG DEBUG
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Presenze NFC</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Attendi...' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => Linking.openURL('http://192.168.1.108:3001/register')}>
        <Text style={styles.registerText}>Registrati</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6fafd',
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#d0e2ed',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#222',
  },
  button: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#0a7ea4',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  registerText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  error: {
    color: '#e53935',
    marginTop: 10,
    fontSize: 16,
  },
});
