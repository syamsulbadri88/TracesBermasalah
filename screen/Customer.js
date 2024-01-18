import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Platform, View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Camera } from 'expo-camera';
import { Dropdown } from 'react-native-searchable-dropdown-kj';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Location from 'expo-location';
import { ScrollView } from 'react-native-virtualized-view';
import mime from 'mime';
import AsyncStorage from "@react-native-async-storage/async-storage";
//import daerah from 'https://twistxd.com/api/tracesjson/daerah.json';
import URL_API from './URL';

export default function App({ navigation, route }) {
  const [name, setName] = useState('');
  const [pic, setPic] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [selectedTestItems, setSelectedTestItems] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
  const [selectednamePhoto, setselectednamePhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCategory2, setSelectedCategory2] = useState([]);
  const [selectedCategory3, setSelectedCategory3] = useState([]);
  const [selectedCategory4, setSelectedCategory4] = useState([]);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(null);
  const [test, setTest] = useState('');
  const { photo } = route.params;
  const { user } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://twistxd.com/api/tracesjson/daerah.json');
        const jsonData = await response.json();
        setItems(jsonData);
      } catch (error) {
        //console.error('Error fetching JSON data:', error);
      }
    };

    fetchData();
  }, []);
  const categories = [
    { id: 1, name: 'Distributor Depo' },
    { id: 2, name: 'SubDist Depo' },
    { id: 3, name: 'Wholesaler Depo' },
    { id: 4, name: 'Retailer Outlet' },
  ];
  const categories3 = [
    { id: 1, name: 'Kantin' },
    { id: 2, name: 'Warung' },
    { id: 3, name: 'CVS' },
    { id: 4, name: 'Supermarket' },
    { id: 5, name: 'Pasar Outlet' },
    { id: 6, name: 'Horeka' },
    { id: 7, name: 'Apotik' },
  ];
  const categories4 = [
    { id: 1, name: 'Modern' },
    { id: 2, name: 'Tradisonal' },
  ];
  const dropdownStyles = {
    container: {
      flex: 1,
      marginTop: 8,
      paddingRight: 120
    },
    textInputStyle: {
      padding: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      backgroundColor: '#fff',
      width: 210,
    },
    itemStyle: {
      padding: 10,
      marginTop: 2,
      backgroundColor: '#F7F7F6',
      borderColor: '#52C5D8',
      borderWidth: 1,
      borderRadius: 5,
      width: 210,
    },
    itemTextStyle: {
      color: '#222',
    },
    itemsContainerStyle: {
      maxHeight: 180,
      position: 'absolute',
      width: 210,
      top: 50,
      zIndex: 999,
    },
  };

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
        height: 108,
      },
      headerTintColor: 'white',
      headerTitleAlign: 'center',

    });

  }, [navigation]);

  const openCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setIsModalVisible(false);
        navigation.navigate('CameraScreen');
      } else {
        //console.log('Camera permission denied');
      }
    } catch (error) {
      //console.error('Error requesting camera permission:', error);
    }
  };
  // const handleSubmit = async () => {
  //   try {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     const location = await Location.getCurrentPositionAsync({});
  //     const lat_input = location.coords.latitude;
  //     const lon_input = location.coords.longitude;
  //     //const formData = new FormData();
  //     const body = new FormData();
  //         body.append('name', name);
  //         body.append('position', position);
  //         body.append ('address', address);
  //         body.append ('pic', pic);
  //         body.append ('phone', phone);
  //         body.append ('lat', lat_input);
  //         body.append ('lon', lon_input);
  //         body.append ('sales', user.id_sales);
  //         body.append ('manager', "atasan");
  //         body.append ('distric', selectedDistrict?.name);
  //         body.append ('province', selectedProvince?.name);
  //         body.append ('subdistric', selectedSubDistrict?.name);
  //         body.append ('katagori', selectedCategory?.name);
  //         body.append ('retail_order', selectedCategory2?.name);
  //         body.append ('tipe_outlet', selectedCategory4?.name);
  //         body.append ('retail_outlet',selectedCategory3?.name);
  //     //console.log('photouri',photo.uri);
     

  //     if (photo) {
  //       body.append('images', {
  //         name: photo.uri ? photo.uri.split('/').pop() : '',
  //         type: mime.getType(photo.uri),
  //         uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
  //       });
  //     }
  //     // console.log('nama',photo.name);
  //     // console.log('type',type);
  //     // console.log('photo',photo);
  //     const response = await fetch(URL_API.url_api + 'input_customer_subdistric_new.php', {
  //       method: 'POST',
  //       body: body,

  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log('Data sent in the request:', body);

      
  //     setName('');
  //     setPic('');
  //     setPosition('');
  //     setPhone('');
  //     setAddress('');
  //     setSelectedProvince(null);
  //     setSelectedDistrict(null);
  //     setSelectedSubDistrict(null);
  //     setselectednamePhoto(null);
  //     setSelectedCategory(null);
  //     setSelectedCategory2(null);
  //     setSelectedCategory4(null);
  //     setSelectedCategory3(null);

  //     alert('Submission successful!');
  //   } catch (error) {
  //     console.error(
  //       'Error submitting data:',
  //       error.response?.data || error.message
  //     );
  //     alert('Error submitting data. Please try again.');
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      const lat_input = location.coords.latitude;
      const lon_input = location.coords.longitude;
  
      const data = new FormData();
      data.append('name', name);
      data.append('position', position);
      data.append('address', address);
      data.append('pic', pic);
      data.append('phone', phone);
      data.append('lat', lat_input);
      data.append('lon', lon_input);
      data.append('sales', user.id_sales);
      data.append('manager', 'atasan');
      data.append('distric', selectedDistrict?.name);
      data.append('province', selectedProvince?.name);
      data.append('subdistric', selectedSubDistrict?.name);
      data.append('katagori', selectedCategory?.name);
      data.append('retail_order', selectedCategory2?.name);
      data.append('tipe_outlet', selectedCategory4?.name);
      data.append('retail_outlet', selectedCategory3?.name);
  
      if (photo) {
        data.append('images', {
          name: photo.uri ? photo.uri.split('/').pop() : '',
          type: mime.getType(photo.uri),
          uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        });
      }
  
      //console.log('photo', photo);
  
      const response = await fetch(URL_API.url_api + 'input_customer_subdistric_new.php', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const responseBody = await response.text();
      //console.log('Response from backend:', responseBody);
      
      //console.log('data finis :', data);
      // setName('');
      // setPic('');
      // setPosition('');
      // setPhone('');
      // setAddress('');
      // setSelectedProvince(null);
      // setSelectedDistrict(null);
      // setSelectedSubDistrict(null);
      // setselectednamePhoto(null);
      // setSelectedCategory(null);
      // setSelectedCategory2(null);
      // setSelectedCategory4(null);
      // setSelectedCategory3(null);

      alert('Submission successful!');
    } catch (error) {
      
      alert('Error submitting data. Please try again.');
    }
  };

  
  return (

    <SafeAreaView style={{ flex: 1 }}>
     <FlatList
        data={[1]} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
      <View style={styles.container}>
        <View style={styles.card}>

          <View style={styles.inputContainer}>
            <Text style={styles.Title}>CUSTOMER</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.underlineInput}
              onChangeText={(text) => setName(text)}
              value={name}
              placeholder="Enter name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>PIC:</Text>
            <TextInput
              style={styles.underlineInput}
              onChangeText={(text) => setPic(text)}
              value={pic}
              placeholder="Enter PIC"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Position:</Text>
            <TextInput
              style={styles.underlineInput}
              onChangeText={(text) => setPosition(text)}
              value={position}
              placeholder="Enter position"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone:</Text>
            <TextInput
              style={styles.underlineInput}
              onChangeText={(text) => setPhone(text)}
              value={phone}
              keyboardType="phone-pad"
              placeholder="Enter phone"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address:</Text>
            <TextInput
              style={styles.underlineInput}
              onChangeText={(text) => setAddress(text)}
              value={address}
              placeholder="Enter address"
            />
          </View>
         
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category :</Text>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)}
          selectedItems={selectedCategory}
          onItemSelect={(item) => setSelectedCategory(item)}
          containerStyle={dropdownStyles.container}
          textInputStyle={dropdownStyles.textInputStyle}
          itemStyle={dropdownStyles.itemStyle}
          itemTextStyle={dropdownStyles.itemTextStyle}
          itemsContainerStyle={dropdownStyles.itemsContainerStyle}
          items={categories}
          placeholder={"Category"}
          resetValue={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tipe Outlet :</Text>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)}
          selectedItems={selectedCategory4}
          onItemSelect={(item) => setSelectedCategory4(item)}
          containerStyle={dropdownStyles.container}
          textInputStyle={dropdownStyles.textInputStyle}
          itemStyle={dropdownStyles.itemStyle}
          itemTextStyle={dropdownStyles.itemTextStyle}
          itemsContainerStyle={dropdownStyles.itemsContainerStyle}
          items={categories4}
          placeholder={"Tipe Outlet"}
          resetValue={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Retailer Outlet :</Text>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)}
          selectedItems={selectedCategory3}
          onItemSelect={(item) => setSelectedCategory3(item)}
          containerStyle={dropdownStyles.container}
          textInputStyle={dropdownStyles.textInputStyle}
          itemStyle={dropdownStyles.itemStyle}
          itemTextStyle={dropdownStyles.itemTextStyle}
          itemsContainerStyle={dropdownStyles.itemsContainerStyle}
          items={categories3}
          placeholder={"Retailer Outlet"}
          resetValue={false}
        />
      </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Province: {selectedTestItems ? selectedTestItems.name : ""}</Text>

            <SearchableDropdown
              onTextChange={(text) =>
                console.log(text)}
                selectedItems={selectedProvince}
                onItemSelect={(item) => setSelectedProvince(item)}
                
                
                containerStyle={dropdownStyles.container}
                textInputStyle={dropdownStyles.textInputStyle}
                itemStyle={dropdownStyles.itemStyle}
                itemTextStyle={dropdownStyles.itemTextStyle}
                itemsContainerStyle={dropdownStyles.itemsContainerStyle}
                items={items}
                placeholder={ "Province"}
                resetValue={false} 
                listProps={
                  {
                    nestedScrollEnabled: true,
                  }
                }
                />
          </View>

          {/* {selectedProvince && ( */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>District:</Text>
            <SearchableDropdown
              onTextChange={(text) => console.log(text)}
              selectedItems={selectedDistrict}
              onItemSelect={(item) => setSelectedDistrict(item)}
              containerStyle={dropdownStyles.container}
              textInputStyle={dropdownStyles.textInputStyle}
              itemStyle={dropdownStyles.itemStyle}
              itemTextStyle={dropdownStyles.itemTextStyle}
              itemsContainerStyle={dropdownStyles.itemsContainerStyle}
              items={selectedProvince?.regions || []}
              placeholder={"District"}
              resetValue={false}
            />
          </View>
          {/* )} */}

          {/* {selectedDistrict && ( */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sub District:</Text>
            <SearchableDropdown
              onTextChange={(text) => console.log(text)}
              selectedItems={selectedSubDistrict}
              onItemSelect={(item) => setSelectedSubDistrict(item)}
              containerStyle={dropdownStyles.container}
              textInputStyle={dropdownStyles.textInputStyle}
              itemStyle={dropdownStyles.itemStyle}
              itemTextStyle={dropdownStyles.itemTextStyle}
              itemsContainerStyle={dropdownStyles.itemsContainerStyle}
              items={selectedDistrict?.subdistricts || []}
              placeholder={"Sub District"}
              resetValue={false}
            />
          </View>

          {/* )} */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Image</Text>
            {photo && photo.uri && <Image source={{ uri: photo.uri }} style={styles.image} />}
          </View>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => openCamera(setIsModalVisible)}
          >
            <Image source={require('../assets/takefotonew.png')} style={styles.cameraIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

        </View>
      </View>
)}
      keyboardShouldPersistTaps="always"
      />
  </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  // dropdown: {
  //   margin: 16,
  //   height: 50,
  //   borderBottomColor: 'gray',
  //   borderBottomWidth: 0.5,
  // },
  // icon: {
  //   marginRight: 5,
  // },
  // placeholderStyle: {
  //   fontSize: 16,
  // },
  // selectedTextStyle: {
  //   fontSize: 16,
  // },
  // iconStyle: {
  //   width: 20,
  //   height: 20,
  // },
  // inputSearchStyle: {
  //   height: 40,
  //   fontSize: 16,
  // },
  // scrollContainer: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginHorizontal: 20,
  // },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: 360,
    height: 980,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: -40,
  },
  label: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  underlineInput: {
    flex: 2,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#52C5D8',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 50,
    borderRadius: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  // card: {
  //   backgroundColor: 'white',
  //   borderRadius: 15,
  //   padding: 16,
  //   shadowColor: 'black',
  //   shadowOffset: {
  //     width: 0,
  //     height: 4,
  //   },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 6,
  //   elevation: 14,
  //   width: 360,
  //   height: 780,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  cameraButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  cameraIcon: {
    width: 50,
    height: 50,
  },
});
