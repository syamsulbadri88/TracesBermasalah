import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import URL_API from './URL';

const EODSComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params;
  const [usridnya, setusridnya] = useState('');
  const [location, setLocation] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');

  const handleYesButton = async () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to submit the End of Day Summary with "Yes"?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch(URL_API.url_api + 'input_absensi_uzu.php', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  usridnya: user.id_sales,
                  mobile_idnya: 1,
                  absensi_mode_idnya: '1',
                  latitudenya: location ? location.latitude : 0,
                  longitudenya: location ? location.longitude : 0,
                }),
              });

              if (!response.ok) {
                alert('Absensi failed.');
                return;
              }

              const responseBody = await response.json();

              if (responseBody.msg === 'Successfully') {
                navigation.navigate('Login');
              } else {
                alert('Absensi failed.');
              }
            } catch (error) {
              alert('An error occurred during absensi.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const locationResult = await Location.getCurrentPositionAsync({});
        setLocation(locationResult.coords);
      } else {
        // Handle location permission denied
      }
    } catch (error) {
      // Handle error getting location
    }
  };

  const handleNoButton = () => {
    setSelectedOption('No');
    navigation.navigate('HomeTab');
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={require('../assets/logoo.png')}
          style={{ width: 100, height: 80 }}
        />
      ),
      headerStyle: { backgroundColor: '#52C5D8' },
      headerTintColor: 'white',
      headerTitleAlign: 'center',
    });

    getCurrentLocation();
  }, [user, navigation]);

  return (
    <View style={styles.eodsContainer}>
      <Text style={styles.title}>End of Day Summaries</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedOption === 'Yes' && styles.activeButton]}
          onPress={handleYesButton}
        >
          <Text style={[styles.buttonText, selectedOption === 'Yes' && styles.activeButtonText]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedOption === 'No' && styles.activeButton]}
          onPress={handleNoButton}
        >
          <Text style={[styles.buttonText, selectedOption === 'No' && styles.activeButtonText]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eodsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderColor: '#52C5D8',
    paddingBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#52C5D8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#52C5D8',
  },
  activeButton: {
    backgroundColor: '#6BB9F0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
});

export default EODSComponent;
