import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;

export default function ProgressScreen(){
  const data = {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [
      {
        data: [1800, 1750, 1900, 2000, 1850, 1950, 1880],
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İlerleme</Text>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        yAxisSuffix=" kcal"
        chartConfig={{
          backgroundGradientFrom: '#000',
          backgroundGradientTo: '#000',
          color: (opacity = 1) => `rgba(5,128,255, ${opacity})`,
          labelColor: () => '#9aa0a6',
          propsForDots: { r: '4', strokeWidth: '2', stroke: '#0580FF' },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16, alignItems: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', alignSelf: 'flex-start', marginLeft: 8 },
});
