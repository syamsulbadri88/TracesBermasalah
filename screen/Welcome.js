import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const openImageModal = () => {
    setShowModal(true);
  };

  const closeImageModal = () => {
    setShowModal(false);
  };

  return (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={openImageModal}>
            <Image
              source={{
                uri: user.image,
                method: 'POST',
                headers: {
                  Pragma: 'no-cache',
                },
                body: 'Your Body goes here',
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Profile</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <UserInfoRow icon="person" label={`Name: ${user.nama_sales}`} />
          <UserInfoRow icon="briefcase" label={`Position: ${user.posisi}`} />
          <UserInfoRow icon="mail" label={`Email: ${user.email}`} />
          <UserInfoRow icon="location" label={`Area: ${user.area}`} />
        </View>
        <Modal visible={showModal} transparent={true} onRequestClose={closeImageModal}>
          <View style={styles.modalContainer}>
            <Image
              source={{
                uri: user.image,
                method: 'POST',
                headers: {
                  Pragma: 'no-cache',
                },
                body: 'Your Body goes here',
              }}
              style={styles.fullImage}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={closeImageModal}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Animated.View>
  );
};

const UserInfoRow = ({ icon, label }) => (
  <View style={styles.userInfoRow}>
    <Icon name={icon} size={20} color="#2c3e50" />
    <Text style={styles.userInfo}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    minWidth: 300,
    margin: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  heading: {
    fontSize: 28,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  userInfoContainer: {
    width: '100%',
    marginTop: 10,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    marginLeft: 15,
    fontSize: 18,
    color: '#2c3e50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeModalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
});

export default ProfileScreen;
