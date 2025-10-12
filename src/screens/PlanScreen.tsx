import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { load } from '../lib/storage';
import { dailyCalories } from '../lib/planEngine';

export default function PlanScreen(){
  const [profile, setProfile] = useState<any>(null);
  const [weekly, setWeekly] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const p = await load('user_profile');
      setProfile(p);
      if (p) {
        const base = dailyCalories(p);
        // simple weekly plan: vary +/-10% across the week
        const week = [0,1,2,3,4,5,6].map(i => Math.round(base * (0.9 + 0.03 * i)));
        setWeekly(week);
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding:16}}>
      <Text style={styles.title}>Haftalık Beslenme Planı</Text>
      {!profile && <Text style={styles.help}>Profiliniz eksik. Lütfen profil oluşturun.</Text>}
      {profile && (
        <View>
          <Text style={styles.sub}>Günlük hedef (ortalama): {dailyCalories(profile)} kcal</Text>
          {weekly.map((v, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.day}>{['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][idx]}</Text>
              <Text style={styles.kcal}>{v} kcal</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#000'},
  title:{color:'#fff',fontSize:20,fontWeight:'800',padding:16},
  help:{color:'#9aa0a6',paddingHorizontal:16},
  sub:{color:'#fff',paddingHorizontal:16,marginBottom:12},
  row:{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#0f0f0f',padding:12,marginHorizontal:16,borderRadius:12,marginBottom:8},
  day:{color:'#fff',fontWeight:'700'},
  kcal:{color:'#9aa0a6'}
})
