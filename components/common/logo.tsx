import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

type LogoProps = {
  title?: string;
};

export const Logo: React.FC<LogoProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Map-Marker.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop:20,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,

  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});
