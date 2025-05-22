import React from 'react';
import { View, Button, Text, Alert, StyleSheet } from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import * as Location from 'expo-location';
import axios from 'axios';

export default function HomeScreen({ token, utente }) {
  const handleTimbratura = async (tipo_evento) => {
    try {
      // NFC reale
      await NfcManager.start();
      setTimeout(() => {
        Alert.alert('Avvicina il telefono al tag NFC...');
      }, 100); // Mostra il messaggio dopo un tick
      try {
        await NfcManager.requestTechnology(NfcTech.NfcA);
      } catch (e) {
        Alert.alert('Errore', 'NFC non disponibile o non abilitato');
        return;
      }
      let tag = null;
      try {
        tag = await NfcManager.getTag();
        if (!tag) throw new Error('Tag NFC non letto');
      } catch (e) {
        try { await NfcManager.cancelTechnologyRequest(); } catch {}
        Alert.alert('Errore', 'Tag NFC non letto');
        return;
      }
      // Debug: logga il tag letto
      console.log('TAG LETTO:', JSON.stringify(tag));
      if (!tag || typeof tag !== 'object' || (!('id' in tag) && !(tag.ndefMessage && tag.ndefMessage.length > 0))) {
        try { await NfcManager.cancelTechnologyRequest(); } catch {}
        Alert.alert('Errore', 'Tag NFC non letto o non compatibile');
        return;
      }
      let luogo_id = null;
      if (tag.id) {
        luogo_id = tag.id;
      } else if (tag.ndefMessage && tag.ndefMessage[0] && tag.ndefMessage[0].payload) {
        // Decodifica payload NDEF (buffer -> stringa)
        try {
          const textDecoder = new TextDecoder('utf-8');
          luogo_id = textDecoder.decode(tag.ndefMessage[0].payload);
        } catch {
          luogo_id = String(tag.ndefMessage[0].payload);
        }
      } else {
        luogo_id = 'UNKNOWN';
      }
      try { await NfcManager.cancelTechnologyRequest(); } catch {}
      if (!luogo_id || luogo_id === 'UNKNOWN') {
        Alert.alert('Errore', 'Tag NFC non valido o non letto');
        return;
      }

      // GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso posizione negato');
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
      }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        console.log('Risposta timbratura:', res.data);
        Alert.alert('Successo', 'Timbratura registrata con successo!');
      })
      .catch(err => {
        console.log('Errore timbratura:', err?.response?.data || err.message);
        Alert.alert('Errore timbratura', err?.response?.data?.error || err.message);
      });
    } catch (err) {
      Alert.alert('Errore timbratura', err.message);
      try { await NfcManager.cancelTechnologyRequest(); } catch {}
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
