import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen(){
  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:120}}>
      <Image source={require('../../assets/stitch/onboarding_screen.png')} style={styles.hero} resizeMode="cover" />
      <Text style={styles.header}>Günün Özeti</Text>

      <View style={styles.row}>
        <View style={styles.bigCard}>
          <Text style={styles.cardTitle}>Kalori</Text>
          <Text style={styles.cardSub}>1800 / 2200 kcal</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>Hedef</Text>
          <Text style={styles.cardSub}>Kilo Verme</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bugünkü Öneriler</Text>
        <View style={styles.card}><Text style={styles.cardTitle}>30 dk Kardiyo</Text><Text style={styles.cardSub}>Orta tempo</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>Protein Takviyesi</Text><Text style={styles.cardSub}>20 g ekstra</Text></View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}><Text style={styles.actionText}>Öğün Ekle</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}><Text style={styles.actionText}>Aktivite Ekle</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}><Text style={styles.actionText}>Planım</Text></TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#000',padding:16},
  hero:{width:'100%',height:220,borderRadius:24,marginBottom:12},
  header:{fontSize:22,fontWeight:'800',color:'#fff',marginBottom:8},
  row:{flexDirection:'row',gap:12,marginBottom:12},
  bigCard:{flex:1,backgroundColor:'#111',borderRadius:20,padding:16},
  smallCard:{width:120,backgroundColor:'#111',borderRadius:20,padding:12,justifyContent:'center',alignItems:'center'},
  section:{marginTop:6},
  sectionTitle:{fontSize:18,color:'#fff',fontWeight:'800',marginBottom:8},
  card:{backgroundColor:'#0f0f0f',borderRadius:20,padding:14,marginBottom:10},
  cardTitle:{color:'#fff',fontWeight:'800',fontSize:16},
  cardSub:{color:'#9aa0a6',marginTop:6},
  actions:{flexDirection:'row',justifyContent:'space-between',marginTop:18},
  actionButton:{backgroundColor:'#0580FF',paddingVertical:12,paddingHorizontal:18,borderRadius:14,flex:1,marginHorizontal:6,alignItems:'center'},
  actionText:{color:'#fff',fontWeight:'700'}
})
