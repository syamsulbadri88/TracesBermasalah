import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [attendance, setAttendance] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://twistxd.com/apitraces/open_absen_new.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sales: user.id_sales,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAttendance(data.slice(0, 30));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={require('../assets/logoo.png')}
          style={{ width: 100, height: 80 }}
        />
      ),
      headerStyle: {
        backgroundColor: '#52C5D8',
        height: 120,
      },
      headerTintColor: 'white',
      headerTitleAlign: 'center',
    });
  }, [user, navigation]);

  const handleProfileButton = () => {
    navigation.navigate('login2', { user });
  };

  return (
    <View style={styles.container}>
    <View style={styles.profileContainer}>
      <TouchableOpacity style={styles.profileButton} onPress={handleProfileButton}>
        <Image
          source={{
            uri: user.image,
            method: 'POST',
            headers: {
              Pragma: 'no-cache',
            },
            body: 'Your Body goes here',
          }}
          style={styles.profileButtonImage}
        />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Halo, {user.nama_sales}!</Text>
      <Text style={styles.infoText}>{user.posisi}</Text>
    </View>

    <View style={styles.tableContainer}>
      <View style={styles.tableRow}>
        <Text style={styles.columnHeader}>DATE</Text>
        <Text style={styles.columnHeader}>Clock IN</Text>
        <Text style={styles.columnHeader}>Clock OUT</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {attendance.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>{item.On_Duty}</Text>
            <Text style={styles.cell}>{item.Clock_Duty_IN}</Text>
            <Text style={styles.cell}>{item.clock_duty_out}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  profileButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 100,
    marginTop: 10,
    backgroundColor: '#52C5D8',
  },
  profileButtonImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#777777',
  },
  tableContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#9EEDFA',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 1,
    backgroundColor: '#FFF',
    width: '100%',
    marginRight: 1,
  },
  columnHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    width:'40%',
    color: '#555555',
  },
  cell: {
    fontSize: 16,
    color: '#555555',
    width: '40%',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
});

export default HomeScreen;
