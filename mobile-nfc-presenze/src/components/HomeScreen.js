import React from 'react';
import { View, Button, Text, Alert, StyleSheet } from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import * as Location from 'expo-location';
import axios from 'axios';

export default function HomeScreen({ token, utente }) {
  const handleTimbratura = async (tipo_evento) => {
    try {
      // NFC
      // const tag = await NfcManager.getTag();
      // const luogo_id = tag.id; // oppure leggi il payload NDEF
      const luogo_id = '04:42:DE:1A:7F:61:80'; // UID fisso per test
      // await NfcManager.cancelTechnologyRequest();

      // GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso posizione negato');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Chiamata backend
      await axios.post('http://192.168.196.235:3001/api/presenze/timbra', {
        utente_id: utente.id,
        luogo_id,
        timestamp: new Date().toISOString(),
        lat: latitude,
        lng: longitude,
        tipo_evento
      }, { headers: { Authorization: `Bearer ${token}` } });

      Alert.alert('Timbratura registrata!');
    } catch (err) {
      Alert.alert('Errore timbratura', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Benvenuto, {utente.nome}</Text>
      <Button title="Entrata" onPress={() => handleTimbratura('entrata')} />
      <Button title="Uscita" onPress={() => handleTimbratura('uscita')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 24 },
});
