import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Switch, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import URL_API from './URL';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const mainStackNavigation = useNavigation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const locationResult = await Location.getCurrentPositionAsync({});
        setLocation(locationResult.coords);
      } else {
       // console.error('Location permission denied');
      }
    } catch (error) {
     // console.error('Error getting location:', error);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
  
      const response = await axios.post(URL_API.url_api + 'open_user.php', {
        username: username,
        password: password,
      });
  
      if (response.status === 200) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const user = response.data[0];
          setUser(user);
  
          setLoading(false);

          //console.log('User data:', user);
  
          if (user.id_sales) {
            checkAbsenStatus(user);
          } else {
           // console.error('ID Sales is undefined in user object:', user);
            alert('ID Sales is undefined. Check user data structure.');
          }
        } else {
          alert('Login failed. User not found.');
          setLoading(false);
        }
      } else if (response.status === 401) {
        alert('Login failed. Invalid credentials.');
        setLoading(false);
      } else {
        alert('Login failed. An error occurred.');
        setLoading(false);
      }
    } catch (error) {
      //console.error('Login error:', error);
      alert('An error occurred during login.');
      setLoading(false);
    }
  };
  
  
  const checkAbsenStatus = async (user) => {
    try {
      const absenResponse = await axios.post('https://twistxd.com/apitraces/sudah_absen.php', {
        sales: user.id_sales,  
      });
  
      if (absenResponse.status === 200) {
        const status = absenResponse.data;
        //console.log('Absen Status:', status);
  
        if (status === 'Sudah') {
          mainStackNavigation.navigate('MainStack', {
            user: user,
          });
        } else {
          setShowModal(true);
        }
      } else {
       // console.error('Failed to fetch absen status:', absenResponse.data);
        alert('Failed to fetch absen status.');
      }
    } catch (error) {
      //console.error('Error checking absen status:', error);
      alert('An error occurred while checking absen status.');
    }
  };
  
  const handleContinue = async () => {
    setShowModal(false);
  
    try {
      const response = await axios.post(
        URL_API.url_api + 'input_absensi_uzu.php',
        {
          usridnya: username,
          mobile_idnya: null,
          absensi_mode_idnya: '0',
          latitudenya: location ? location.latitude : 0,
          longitudenya: location ? location.longitude : 0,
        }
      );
  
      //console.log('Response from input_absensi_uzu.php:', response.data);
  
      if (response.data.msg === 'Successfully') {
        setShowModal(false);
        mainStackNavigation.navigate('MainStack', {
          user: user,
        });
      } else {
        //console.error('Absensi failed:', response.data);
        alert('Absensi failed.');
      }
    } catch (error) {
      //console.error('Absensi error:', error);
      alert('An error occurred during absensi.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logoo.png')} style={{ width: 250, height: 80 }} />
      <Image source={require('../assets/fronlogo.png')} style={{ width: 300, height: 200 }} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
        >
          <Image
            source={
              showPassword
                ? require('../assets/eye_visible.png')
                : require('../assets/eye_hidden.png')
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.rememberMeContainer}>
        <Switch
          value={rememberMe}
          onValueChange={(value) => setRememberMe(value)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={rememberMe ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Image source={require('../assets/logoo.png')} style={styles.modalImage} />
          <View style={styles.modalContent}>
            {user && (
              <>
                <Text style={styles.modalText}>Welcome, {user.nama_sales}!</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleContinue}
                >
                  <Text style={styles.modalButtonText}>START YOUR DAYS</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#52C5D8',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    width: '50%',
    height: 40,
    backgroundColor: '#ffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#52C5D8',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 20,
  },
  modalButton: {
    width: '100%',
    height: 50,
    width: 200,
    backgroundColor: '#FFCD00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalImage: {
    width: 250,
    height: 150,
    marginTop: -300,
    marginVertical: 20,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: [{ translateY: -16 }],
  },
  eyeIcon: {
    width: 22,
    height: 22,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  rememberMeText: {
    marginRight: 10,
    color: 'white',
  },
});

export default LoginScreen;
