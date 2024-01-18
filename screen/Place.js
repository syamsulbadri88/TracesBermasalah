import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as Location from 'expo-location';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from 'lodash';
import URL_API from './URL';

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={require("../assets/logoo.png")}
          style={{ width: 100, height: 80 }}
        />
      ),
      headerStyle: { backgroundColor: "#52C5D8" },
      headerTintColor: "white",
      headerTitleAlign: "center",
    });
  }, []);

  const [userLocation, setUserLocation] = useState(null);
  const [isMapMoving, setIsMapMoving] = useState(false);
  const [draggingCoords, setDraggingCoords] = useState(null);
  const [lastCoordinate, setLastCoordinate] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const mapRef = useRef(null);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [placeNameInputValue, setPlaceNameInputValue] = useState("");
  const [inputAddress12, setInputAddress12] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const debouncedFetchAddress = useRef(
    _.debounce(async (latitude, longitude) => {
      try {
        const apiKey = "AIzaSyD0m2EPFPRRjNzpqWrV0LIeC_6B0wff53Y";
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );

        if (response.data.results.length > 0) {
          const formattedAddress = response.data.results[0].formatted_address;
          setAddress(formattedAddress);
          setInputAddress12("");
        } else {
          setAddress("Address not available");
          setInputAddress12("");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Address not available");
        setInputAddress12("");
      }
    }, 1000)
  );

  const latestTimeout = useRef(null);

  useEffect(() => {
    getUserLocation();
  }, []);
  
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
  
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setMarkerCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
  
        debouncedFetchAddress.current(
          location.coords.latitude,
          location.coords.longitude
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  if (!userLocation || !markerCoords) {
    return <Text>Loading...</Text>;
  }

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoords({ latitude, longitude, draggable: markerCoords.draggable });
  
    debouncedFetchAddress.current(latitude, longitude);
  };

  const openCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setIsModalVisible(false);
        navigation.navigate("CameraScreen2");
      } else {
        console.log("Camera permission denied");
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setInputAddress12("");
  
    setMarkerCoords((prevCoords) => ({ ...prevCoords, draggable: false }));
  };

  const ButtonSave = async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    try {
      console.log("Authorization Token:", authToken);

      if (authToken) {
        const requestBody = {
          address: inputAddress12,
          lat: markerCoords.latitude.toFixed(6),
          lng: markerCoords.longitude.toFixed(6),
          address12: address,
          status_active: "1",
        };

        console.log("Request Body:", requestBody);

        const response = await axios.post(
          URL_API.url_api + "aPlace",
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 201) {
          console.log("Location saved successfully!");
        } else {
          console.error("Error saving location:");
        }
      } else {
        console.error("Token not available");
      }
    } catch (error) {
      console.error("Error saving location:", error);
    }
    console.log("Address:", address);

    setIsModalVisible(false);
    setInputAddress12("");
  };


    const handleReturnToMarker = () => {
      if (mapRef.current && markerCoords) {
        mapRef.current.animateToRegion({
          latitude: markerCoords.latitude,
          longitude: markerCoords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    };


  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {userLocation && markerCoords ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onRegionChange={(region) => {
              if (markerCoords && markerCoords.draggable && isDragging) {
                setLastCoordinate(region);
                setInputAddress12("");
              }
            }}
            onRegionChangeComplete={(region) => {
              if (!isDragging) {
                setMarkerCoords(lastCoordinate || region);
                setLastCoordinate(null);
              }
              setIsDragging(false); 
            }}
            onMoveShouldSetResponder={() => {
              setIsDragging(true); 
              return false;
            }}
          >
            <Marker
              coordinate={markerCoords}
              title="Jakarta"
              draggable
              onPress={() => setMarkerCoords((prevCoords) => ({ ...prevCoords, draggable: true }))}
              onDragStart={() => {
                setLastCoordinate(null);
                setIsDragging(true); 
              }}
              onDrag={(e) => {
                const { coordinate } = e.nativeEvent;
                setLastCoordinate(coordinate);
              }}
              onDragEnd={() => {
                handleMarkerDragEnd({ nativeEvent: { coordinate: lastCoordinate } });
                setIsDragging(false); 
              }}
              onLongPress={toggleModal}
            />
          </MapView>
        ) : (
          <Text>Loading Map...</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReturnToMarker}>
          <Text style={styles.buttonText}>Kembali ke Titik</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>OPEN</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleModal}
              >
                <Image
                  source={require("../assets/batal.png")}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Location</Text>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={openCamera}
              >
                <Image
                  source={require("../assets/takefotonew.png")}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Place Name"
              onChangeText={setPlaceNameInputValue}
              value={placeNameInputValue}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              onChangeText={setInputAddress12}
              value={inputAddress12}
            />
            <View style={styles.coordsContainer}>
              <Text style={styles.coordsText}>
                Latitude: {markerCoords.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordsText}>
                Longitude: {markerCoords.longitude.toFixed(6)}
              </Text>
              <Text style={styles.addressText}>Address: {address}</Text>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={ButtonSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    width: "100%",
    height: "70%",
    marginTop: -180,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#52C5D8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  coordsContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  coordsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 5,
    borderRadius: 5,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  saveButton: {
    backgroundColor: "#52C5D8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  cameraButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 8,
  },
  cameraIcon: {
    width: 30,
    height: 30,
  },
});