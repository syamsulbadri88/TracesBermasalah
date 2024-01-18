import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import URL_API from './URL';
import moment from 'moment';

const HomeScreen = ({ navigation, route }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateVisits, setSelectedDateVisits] = useState(null);
  const [selectedDateAttends, setSelectedDateAttends] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryVisits, setSearchQueryVisits] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [VisitsData, setVisitsData] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVisitDetails, setSelectedVisitDetails] = useState(null);
  const { user } = route.params;

  const formattedSelectedDate = selectedDateVisits
  ? moment(selectedDateVisits).format('YYYY-MM-DD')
  : '';

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
  
    const formattedSelectedDate = moment(date).format('YYYY-MM-DD');
   // console.log('Formatted Selected Date:', formattedSelectedDate);
  
    const filteredVisits = VisitsData.filter((visit) => {
      const formattedVisitDate = moment(visit.date_in).format('YYYY-MM-DD');
      return formattedVisitDate === formattedSelectedDate;
    });
  
   // console.log('Filtered visit data:', filteredVisits);
  
    setFilteredVisits(filteredVisits);
    setSelectedDateVisits(date);
  };
    

  const handleButtonPress = useCallback(async (buttonText, item) => {
    setSelectedButton(buttonText);

    if (buttonText === 'Visit') {
      if (!selectedDateVisits) {
        setFilteredVisits(VisitsData);
      } else {
        const selectedDate = moment(selectedDateVisits).startOf('day');
        const filteredData = VisitsData.filter((visit) => {
          const visitDate = moment(visit.date_in).startOf('day');
          return selectedDate.isSame(visitDate);
        });

        setFilteredVisits(filteredData);
      }
    }

    if (buttonText === 'Customer' && item) {
      setModalVisible(true);
      setSelectedItem(item);
    }
  }, [selectedDateVisits, VisitsData]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    const filteredData = customerData.filter((customer) => {
      const firstLetter = query.toLowerCase();
      return customer.name_cus.toLowerCase().startsWith(firstLetter);
    });
    setFilteredCustomers(filteredData);
  }, [customerData]);
  

  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   const filteredData = customerData.filter((customer) => {
  //     const firstLetter = query.toLowerCase();
  //     return customer.name_cus.toLowerCase().startsWith(firstLetter);
  //   });
  //   setFilteredCustomers(filteredData);
  // };


  const handleSearchVisits = (query) => {
    setSearchQueryVisits(query);
    const filteredData = VisitsData.filter((visit) => {
      const firstLetter = query.toLowerCase();
      return visit.name_cus.toLowerCase().startsWith(firstLetter);
    });
    setFilteredVisits(filteredData);
  };
  const fetchVisitData = async () => {
    try {
      const response = await fetch(URL_API.url_api + 'open_visit.php', {
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
      setVisitsData(data);
      setFilteredVisits(data);
    } catch (error) {
     // console.error('Error fetching visit data:', error);
    }
  };

  const renderCustomerItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.customerItem}
        onPress={() => handleButtonPress('Customer', item)}
      >
        <Image source={{ uri: item.images }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.customerItemText}>Nama: {item.name_cus}</Text>
          <Text>Phone: {item.phone_cus}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderVisitItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.customerItem}
      >
        <Image source={{ uri: item.image_in }} style={styles.cardImage1} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.customerItemText}>Cus: {item.name_cus}</Text>
          <Text>Pic: {item.pic}</Text>
          <Text>Note: {item.notes}</Text>
          <Text>Alamat: {item.address}</Text>
          <Text>Date: {item.date_in}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

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
      setCustomerData(data);
      setFilteredCustomers(data);
   
    } catch (error) {
     // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    setSelectedButton('Customer');
    fetchData();
    fetchVisitData();
  }, [user]);

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
  }, [selectedButton]);

  return (
    <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === 'Customer' && styles.selectedButton,
        ]}
        onPress={() => handleButtonPress('Customer', null)}
      >
        <Text style={styles.buttonText}>Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === 'Visit' && styles.selectedButton,
        ]}
        onPress={() => handleButtonPress('Visit', null)}
      >
        <Text style={styles.buttonText}>Visit</Text>
      </TouchableOpacity>
    </View>

    {selectedButton === 'Customer' && (
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers"
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <FlatList
          data={filteredCustomers.slice(0, 20)}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderCustomerItem}
        />
      </View>
    )}

      {selectedButton === 'Customer' && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Image source={{ uri: selectedButton === 'Customer' ? selectedItem?.images : selectedItem?.images }} style={styles.modalImage} />
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Nama:</Text>{selectedButton === 'Customer' ? selectedItem?.name_cus : selectedItem?.name_cus}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Phone:</Text> {selectedButton === 'Customer' ? selectedItem?.phone_cus : selectedItem?.phone_cus}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Alamat:</Text> {selectedButton === 'Customer' ? selectedItem?.address : selectedItem?.address}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Pic:</Text> {selectedButton === 'Customer' ? selectedItem?.pic : selectedItem?.pic}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Position:</Text> {selectedButton === 'Customer' ? selectedItem?.positionnya : selectedItem?.positionnya}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Address:</Text> {selectedButton === 'Customer' ? selectedItem?.address : ''}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>District:</Text> {selectedButton === 'Customer' ? selectedItem?.distric : ''}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Province:</Text> {selectedButton === 'Customer' ? selectedItem?.province : ''}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Sub District:</Text> {selectedButton === 'Customer' ? selectedItem?.subdistric : ''}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Category:</Text> {selectedButton === 'Customer' ? selectedItem?.katagori : ''}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Retail Order:</Text> {selectedButton === 'Customer' ? selectedItem?.retail_order : ''}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Tipe Outlet:</Text> {selectedButton === 'Customer' ? selectedItem?.tipe_outlet : ''}</Text>
          <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Retail Outlet:</Text> {selectedButton === 'Customer' ? selectedItem?.retail_outlet : ''}</Text>
           <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
       )}

        {selectedButton === 'Customer' && (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderCustomerItem}
        />
      )}

      {selectedButton === 'Visit' && (
              <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                  <Text style={styles.dateButtonText}>
                    {formattedSelectedDate || moment().format('YYYY-MM-DD')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

      {selectedButton === 'Visit' && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      )}


      {/* {selectedButton === 'Visit' && selectedVisitDetails && (
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedButton === 'Visit' ? selectedVisitDetails?.image_in : selectedVisitDetails?.images }} style={styles.modalImage} />
          <View style={styles.modalContent}>
          <Text style={styles.modalText}>Nama: {selectedButton === 'Visit' ? selectedVisitDetails?.name_cus : selectedVisitDetails?.name_cus}</Text>
          <Text style={styles.modalText}>Phone: {selectedButton === 'Visit' ? selectedVisitDetails?.phone_cus : selectedVisitDetails?.phone_cus}</Text>
          <Text style={styles.modalText}>Alamat: {selectedButton === 'Visit' ? selectedVisitDetails?.address : selectedVisitDetails?.address}</Text>
          <Text style={styles.modalText}>Pic: {selectedButton === 'Visit' ? selectedVisitDetails?.pic : selectedVisitDetails?.pic}</Text>
          <Text style={styles.modalText}>Position: {selectedButton === 'Visit' ? selectedVisitDetails?.positionnya : selectedVisitDetails?.positionnya}</Text>
          <Text style={styles.modalText}>Address: {selectedButton === 'Visit' ? selectedVisitDetails?.address : ''}</Text> */}
       
              {/* <View>
                <Text>Status: {selectedVisitDetails?.status_visit}</Text>
                <Text>Date In: {moment(selectedVisitDetails?.date_in).format('YYYY-MM-DD HH:mm:ss')}</Text>
              </View> */}
            
          {/* </View>
        </View>
        )} */}

      {/* {selectedButton === 'Visit' && (
      <FlatList
              data={selectedButton === 'Visit' ? filteredVisits : filteredVisits}
              //keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
              renderItem={selectedButton === 'Visit' ? renderVisitItem : renderVisitItem}
            />
      )} */}
      {selectedButton === 'Visit' && (
        <FlatList
          data={filteredVisits.slice(0, 20)}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderVisitItem}
          />
          )}

    </View>
  );
};

const styles = StyleSheet.create({
  customerItemText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  dateButton: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
  dateButtonText: {
    color: 'gray',
    fontWeight: 'bold',
    marginTop: 7,
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#52C5D8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 0,
    marginHorizontal: 0,
    borderWidth: 1, 
    borderColor: 'white', 
  },
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#3498db',
  },
  dateContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
    width: 350,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  customerItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 16,
  },
  cardImage1: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    width: 200,
  },
});

export default HomeScreen;
