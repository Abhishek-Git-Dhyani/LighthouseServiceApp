import React from 'react';
import LoginComponent from './Components/LoginComponent';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeComponent from './Components/HomeComponent';
// App/Components/HomeComponent.js
import ReportScreen from './Components/_AppComponents/ReportScreen';
import EvDashboard from './Components/_EvComponents/EvDashBoard';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginComponent} />
        <Stack.Screen name="Home" component={HomeComponent} />
        <Stack.Screen name="Ev" component={EvDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
