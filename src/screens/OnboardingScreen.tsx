import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/stitch/onboarding_screen.png')} style={styles.hero} />
      <Text style={styles.title}>Sağlıklı Yaşam Yolculuğunuza Başlayın</Text>
      <TouchableOpacity style={styles.cta} onPress={() => nav.navigate('Login' as any)}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  hero: { width: '90%', height: 320, marginBottom: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  cta: { backgroundColor: '#0580FF', padding: 14, borderRadius: 40 }
});
