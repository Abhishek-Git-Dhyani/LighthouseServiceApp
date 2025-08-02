import {Text, Button, View, StatusBar, StyleSheet, Modal} from 'react-native';
import * as React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Dashboard from './_AppComponents/Dashboard';
import Recharge from './_AppComponents/Recharge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ColorBlueTheme} from '../GlobalStyles';
import ReportScreen from './_AppComponents/ReportScreen';
import ConsumerProfile from './_AppComponents/ConsumerProfile';
import BillProfile from './_AppComponents/BillProfile';
import EvDashboard from './_EvComponents/EvDashBoard';
const HomeComponent = props => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={Styles.main}>
      <StatusBar backgroundColor="white" hidden={false} />
      <Tab.Navigator screenOptions={{tabBarStyle: {backgroundColor: 'white'}}}>
        <Tab.Screen name="DashBoard" component={Dashboard} />
        <Tab.Screen name="Recharge" component={Recharge} />
        <Tab.Screen name ="Reports" component= {ReportScreen} />
        <Tab.Screen name ="Bill" component= {BillProfile} />
        <Tab.Screen name ="Profile" component= {ConsumerProfile} />
      </Tab.Navigator>
    </View>
  );
};

const Styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default HomeComponent;
