import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screen/Login';
import LoginScreen2 from './screen/Welcome';
import CameraScreen from './screen/CameraScreen';
import CameraScreen2 from './screen/CameraScreen2';
import HomeScreen from './screen/Home';
import ReportScreen from './screen/Reports';
import RecordScreen from './screen/Records';
import EodScreen from './screen/Eods';
import CostumerScreen from './screen/Customer';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabScreen = ({ route }) => {
  const { user, photo } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Customer':
              iconName = focused ? 'person-add' : 'person-outline';
              break;
            case 'Reports':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'Records':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Eods':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            default:
              iconName = 'help-circle';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1f91c3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} initialParams={{ user, photo }} />
      <Tab.Screen name="Customer" component={CostumerScreen} initialParams={{ user, photo }} />
      <Tab.Screen name="Records" component={RecordScreen} initialParams={{ user, photo }} />
      <Tab.Screen name="Reports" component={ReportScreen} initialParams={{ user, photo }} options={{ tabBarLabel: 'Reports' }} />
      <Tab.Screen name="Eods" component={EodScreen} initialParams={{ user, photo }} options={{ tabBarLabel: 'Eods' }} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainStack" component={MainTabScreen} options={({ route }) => ({
          headerShown: false,
          initialParams: {
            user: route.params.user,
            authToken: route.params.authToken,
          },
        })}
        />
        <Stack.Screen name="login2" component={LoginScreen2} options={{ headerShown: false }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CameraScreen2" component={CameraScreen2} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
