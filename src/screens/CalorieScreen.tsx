import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { load, store } from '../lib/storage';

export default function CalorieScreen(){
  const [meals, setMeals] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');

  useEffect(()=>{(async()=>{const m = await load('meals') || []; setMeals(m)})()},[]);

  async function add(){
    if(!name || !kcal) return;
    const item = { id: Date.now().toString(), name, kcal: Number(kcal) };
    const next = [item, ...meals];
    setMeals(next);
    await store('meals', next);
    setName(''); setKcal('');
  }

  async function remove(id:string){
    const next = meals.filter(m=>m.id!==id);
    setMeals(next);
    await store('meals', next);
  }

  const total = meals.reduce((s,m)=>s + (m.kcal||0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kalori Takibi</Text>
      <View style={styles.inputRow}>
        <TextInput value={name} onChangeText={setName} placeholder="Öğün adı" placeholderTextColor="#666" style={styles.input} />
        <TextInput value={kcal} onChangeText={setKcal} placeholder="kcal" keyboardType="numeric" placeholderTextColor="#666" style={[styles.input,{width:100}]} />
        <TouchableOpacity style={styles.addBtn} onPress={add}><Text style={{color:'#fff',fontWeight:'700'}}>Ekle</Text></TouchableOpacity>
      </View>
      <Text style={styles.total}>Toplam: {total} kcal</Text>
      <FlatList data={meals} keyExtractor={i=>i.id} renderItem={({item})=> (
        <View style={styles.mealRow}><Text style={styles.mealName}>{item.name}</Text><Text style={styles.mealK}>{item.kcal} kcal</Text><TouchableOpacity onPress={()=>remove(item.id)}><Text style={{color:'#ff6b6b'}}>Sil</Text></TouchableOpacity></View>
      )} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#000',padding:16},
  title:{color:'#fff',fontSize:20,fontWeight:'800',marginBottom:12},
  inputRow:{flexDirection:'row',alignItems:'center',marginBottom:12},
  input:{flex:1,height:44,backgroundColor:'#111',borderRadius:10,paddingHorizontal:12,color:'#fff',marginRight:8},
  addBtn:{backgroundColor:'#0580FF',padding:12,borderRadius:10},
  total:{color:'#9aa0a6',marginBottom:8},
  mealRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#0f0f0f',padding:12,borderRadius:10,marginBottom:8},
  mealName:{color:'#fff',fontWeight:'700'},
  mealK:{color:'#9aa0a6'}
})
