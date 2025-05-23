import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import * as Location from 'expo-location';
import axios from 'axios';

export default function HomeScreen({ token, utente, setToken }) {
  const [loading, setLoading] = useState(false);

  const handleTimbratura = async (tipo_evento) => {
    setLoading(true);
    try {
      // NFC
      await NfcManager.start();
      Alert.alert('NFC', 'Avvicina il telefono al tag NFC...');
      await NfcManager.requestTechnology(NfcTech.NfcA);
      let tag = await NfcManager.getTag();
      let luogo_id = tag?.id || 'UNKNOWN';
      await NfcManager.cancelTechnologyRequest();
      if (!luogo_id || luogo_id === 'UNKNOWN') {
        Alert.alert('Errore', 'Tag NFC non valido o non letto');
        setLoading(false);
        return;
      }
      // GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso posizione negato');
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      // Chiamata backend
      await axios.post('http://192.168.1.108:3001/api/presenze/timbra', {
        utente_id: utente.id,
        luogo_id,
        timestamp: new Date().toISOString(),
        lat: latitude,
        lng: longitude,
        tipo_evento
      }, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert('Successo', 'Timbratura registrata con successo!');
    } catch (err) {
      Alert.alert('Errore timbratura', err?.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Benvenuto, {utente.nome}</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#43a047' }]} onPress={() => handleTimbratura('entrata')} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Attendi...' : 'Entrata'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#e53935' }]} onPress={() => handleTimbratura('uscita')} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Attendi...' : 'Uscita'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    maxWidth: 340,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#0a7ea4',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  logout: {
    marginTop: 30,
    padding: 10,
  },
  logoutText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
