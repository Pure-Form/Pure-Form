import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [activityLevel, setActivityLevel] = useState<'sedentary'|'light'|'moderate'|'active'|'very_active'>('moderate');
  const [goal, setGoal] = useState<'lose'|'maintain'|'gain'>('maintain');

  async function submit() {
    const profile = {
      name: name || 'User',
      age: Number(age || 30),
      weightKg: Number(weight || 70),
      heightCm: Number(height || 175),
      activityLevel,
      goal,
    };
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
    // navigate to main tabs
    const nav = useNavigation();
    // @ts-ignore - dynamic route names
    nav.navigate('Main');
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/stitch/onboarding_screen.png')} style={styles.hero} resizeMode="cover" />
      <View style={styles.card}>
        <Text style={styles.headline}>Sağlıklı Yaşam Yolculuğunuza Başlayın</Text>
        <Text style={styles.lead}>Kilo verme, kas yapma veya daha sağlıklı bir yaşam için başlayın.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={submit}>
          <Text style={styles.primaryButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => alert('Kaydol - demo')}>
          <Text style={styles.secondaryButtonText}>Kaydol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 },
  picker: { height: 44, marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  option: { padding: 8, borderWidth: 1, borderColor: '#ccc', marginRight: 8, marginTop: 8, borderRadius: 6 },
  optionActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  hero: { width: '100%', height: 300, backgroundColor: '#eee' },
  card: { backgroundColor: '#000', padding: 20, alignItems: 'center' },
  headline: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  lead: { color: '#bfc7d0', textAlign: 'center', marginBottom: 20 },
  primaryButton: { backgroundColor: '#0580FF', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 40, width: '90%', alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  secondaryButton: { backgroundColor: '#2b2b2b', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 40, width: '90%', alignItems: 'center' },
  secondaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 18 }
});
