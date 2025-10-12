import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { store } from '../lib/storage';
import { useNavigation } from '@react-navigation/native';

export default function ProfileOnboarding(){
  const [name,setName] = useState('');
  const [age,setAge] = useState('30');
  const [weight,setWeight] = useState('70');
  const [height,setHeight] = useState('175');
  const nav = useNavigation();

  async function save(){
    const profile = { name, age: Number(age), weightKg: Number(weight), heightCm: Number(height), activityLevel: 'moderate', goal: 'maintain' };
    await store('user_profile', profile);
    // go to main
    // @ts-ignore
    nav.navigate('Main');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Oluştur</Text>
      <TextInput placeholder="İsim" placeholderTextColor="#666" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Yaş" placeholderTextColor="#666" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Kilo (kg)" placeholderTextColor="#666" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Boy (cm)" placeholderTextColor="#666" value={height} onChangeText={setHeight} keyboardType="numeric" style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={save}><Text style={{color:'#fff',fontWeight:'800'}}>Kaydet ve Devam Et</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#000',padding:16},title:{color:'#fff',fontSize:20,fontWeight:'800',marginBottom:12},input:{backgroundColor:'#111',color:'#fff',padding:12,borderRadius:10,marginBottom:10},btn:{backgroundColor:'#0580FF',padding:14,borderRadius:12,alignItems:'center',marginTop:8}})
