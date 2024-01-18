import React, { useState, useEffect } from 'react';
import mime from "mime";
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions, Platform
} from 'react-native';
import { Camera } from 'expo-camera';
import { ScrollView } from 'react-native-virtualized-view'
import axios from 'axios';
import * as Location from 'expo-location';
import URL_API from './URL';
const windowWidth = Dimensions.get('window').width;

const SearchableDropdown = ({ data, onSelect, selectedItem, filteredData, setFilteredData }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    try {
      const filteredItems = data.filter((item) =>
        item.label?.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredData(filteredItems.length > 0 ? filteredItems : []);
      onSelect(null);
    } catch (error) {
      //console.error('Error while handling search:', error);
    }
  };


  const handleSelectItem = (item) => {
    try {
      onSelect(item);
      setSearchQuery('');
    } catch (error) {
      //console.error('Error while handling item selection:', error);
    }
  };

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={selectedItem ? selectedItem.label : searchQuery}
          onChangeText={handleSearch}
          onFocus={() => onSelect(null)}
        />
      </View>
      {searchQuery && (
        <ScrollView style={styles.dropdownList}>

          {filteredData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => {
                handleSelectItem(item);
              }}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const App = ({ navigation, route }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = route.params;

  const openCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setIsModalVisible(false);
        navigation.navigate('CameraScreen2');
      } else {
        //console.log('Camera permission denied');
      }
    } catch (error) {
      //console.error('Error requesting camera permission:', error);
    }
  };

  useEffect(() => {
    try {
      navigation.setOptions({
        headerTitle: () => (
          <Image source={require('../assets/logoo.png')} style={{ width: 100, height: 80 }} />
        ),
        headerStyle: { backgroundColor: '#52C5D8' },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      });
    } catch (error) {
      //console.error('Error setting navigation options:', error);
    }
  }, [user]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [fetchedIdCus, setFetchedIdCus] = useState(null);
  const { photo } = route.params;

  const fetchData = async () => {
    try {
      const response = await fetch(URL_API.url_api + 'open_customer.php', {
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
      const idCus = data.length > 0 ? data[0].id_cus : null;

      setFetchedIdCus(idCus);
      const customerData = data.map((customer) => ({
        label: customer.name_cus,
        value: customer.id_cus,
        address: customer.pic,
      }));
  
      setInitialData(customerData);
      setFilteredData(customerData);
    } catch (error) {
      //console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectItem = (item) => {
    try {
      setSelectedItem(item);
      if (item) {
        setAddress(item.address);
      } else {
        setAddress('');
      }
    } catch (error) {
      //console.error('Error handling selected item:', error);
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        //console.log('Latitude: ', latitude);
        //console.log('Longitude: ', longitude);
      } else {
        //console.log('Location permission denied');
      }
    } catch (error) {
      //console.error('Error getting user location:', error);
    }
  };
  
  const handleCheckIn = async () => {
    //console.log('fetchedIdCus:', fetchedIdCus);
  
    try {
      setIsCheckingIn(true);
      await fetchData();
      //console.log('fetchedIdCus:', fetchedIdCus);
  
      const { status } = await Location.requestForegroundPermissionsAsync();
  
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const lat_input = location.coords.latitude;
        const lon_input = location.coords.longitude;
  
        const body = new FormData();
        body.append('pic', address);
        body.append('name', fetchedIdCus);
        body.append('note', note);
        body.append('lat', lat_input);
        body.append('lon', lon_input);
        body.append('sales', user.id_sales);
  
        if (photo) {
          body.append('imagein', {
            name: photo.uri ? photo.uri.split('/').pop() : '',
            type: mime.getType(photo.uri),
            uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
          });
        }
  
        const response1 = await fetch(URL_API.url_api + 'input_visitasi_bfoto_uzu.php', {
          method: 'POST',
          body: body,
        });
  
        //console.log('Data sent in the request:', body);
  
        if (!response1.ok) {
          //console.error('Check-in failed:', response1.statusText);
          setIsCheckingIn(false);
          return;
        } else {
          const contentType = response1.headers.get('Content-Type');
          if (!contentType || !contentType.includes('application/json')) {
            setIsCheckingIn(false);
            return;
          }
  
          const responseData = await response1.json();
          if (responseData.msg === '1') {
            setIsCheckingIn(false);
          } else {
            //console.error('Check-in failed:', responseData);
            setIsCheckingIn(false);
            return;
          }
        }
        const response2 = await fetch(URL_API.url_api + 'open_chekin.php', {
          method: 'POST',
          body: JSON.stringify({
            sales: user.id_sales,
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
  
        if (!response2.ok) {
          //console.log('Network response was not ok');
          setIsCheckingIn(false);
          return;
        }
  
        const responseText2 = await response2.text();
        //console.log('Response from open_chekin:', responseText2);
  
        try {
          const data1 = JSON.parse(responseText2);
          const idVisitFromResponse2 = data1.length > 0 ? data1[0].id_visit : '';
  
          //console.log('Visitnya =>' + idVisitFromResponse2);
        } catch (error) {
          //console.error('Error parsing response from open_chekin:', error);
        }
      } else {
        //console.log('Location permission denied');
        setIsCheckingIn(false);
      }
    } catch (error) {
      //console.error('Error during check-in:', error);
      setIsCheckingIn(false);
    }
  };
  
  

  const handleCheckOut = async () => {
    try {
      setIsCheckingIn(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      const response22 = await fetch(URL_API.url_api + 'open_chekin.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sales: user.id_sales,
        }),
      });

      //console.log(response22);

      if (!response22.ok) {
        //console.log('Network response was not ok');
      }

      const data12 = await response22.json();
      const idVisitFromResponse2 = data12.length > 0 ? data12[0].id_visit : '';

      //console.log('Visitnya =>' + idVisitFromResponse2);

      if (!idVisitFromResponse2) {
        //console.error('No valid visit available.');
        setIsCheckingIn(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat_input = location.coords.latitude;
      const lon_input = location.coords.longitude;

      const response = await fetch(URL_API.url_api + 'updatevisit_uzu.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: note,
          lat: lat_input,
          lon: lon_input,
          sales: user.id_sales,
          idvisit: idVisitFromResponse2,
        }),
      });

      //console.log('Check-out response status:', response.status);

      if (!response.ok) {
        //console.error('Check-out failed:', response.statusText);
        setIsCheckingIn(false);
      } else {
        const responseData = await response.json();
        if (responseData !== null && typeof responseData === 'object') {
          //console.log('Check-out response data:', responseData);
        } else {
          //console.error('Check-out failed with server error: Response data is null');
          setIsCheckingIn(false);
        }
      }
    } catch (error) {
      ////console.error('Error during check-out:', error);
      setIsCheckingIn(false);
    }
  };

  const [isCheckingIn, setIsCheckingIn] = useState(true);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
      <View style={styles.container}>
        <Text style={styles.title}>Record</Text>
        <View style={[styles.fieldContainer, { width: windowWidth * 0.8 }]}>
          <Text style={styles.fieldLabel}>Name</Text>
          <SearchableDropdown
            data={initialData}
            onSelect={handleSelectItem}
            selectedItem={selectedItem}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            itemsContainerStyle={styles.itemsContainerStyle}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Pic</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            style={[styles.input, { width: windowWidth * 0.8 }]}
            editable={false}
            pointerEvents="none"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Note</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Enter note"
            style={[styles.input, { width: windowWidth * 0.8 }]}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>image</Text>
          {photo && photo.uri && <Image source={{ uri: photo.uri }} style={styles.image} />}
        </View>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => openCamera(setIsModalVisible)}
        >
          <Image source={require('../assets/takefotonew.png')} style={styles.cameraIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isCheckingIn ? '#52C5D8' : 'red',
            },
          ]}
          onPress={() => {
            if (isCheckingIn) {
              handleCheckIn();
            } else {
              handleCheckOut();
            }
          }}
        >
          <Text style={styles.buttonText}>{isCheckingIn ? 'Check In' : 'Check Out'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 100,
    height: 50,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  // dropdownContainer: {
  //   width: '100%',
  // },
  // item: {
  //   padding: 10,
  //   borderBottomWidth: 1,
  //   borderColor: 'lightgray',
  // },
  item: {
    padding: 10,
    backgroundColor: '#F7F7F6',
    borderColor: '#52C5D8',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownContainer: {
    //position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: 'white',
  },


  itemText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#52C5D8',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: 'white',
    zIndex: 999,
  },
});

export default App;
