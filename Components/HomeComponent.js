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
import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Drawer } from 'react-native-paper';

const HomeComponent = props => {
  const Tab = createMaterialTopTabNavigator();
  const [submerchant, setSubmerchant] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
        const tokenDetail = await AsyncStorage.getItem('user_Token');
        const data = JSON.parse(tokenDetail);
        if (data?.token) {
            global.submerchant = data.subMerchantId;
            setSubmerchant(data.subMerchantId);
        }
    };

    fetchData();
  }, []);
  

  return (
    <View style={Styles.main}>
      <StatusBar backgroundColor="white" hidden={false} />
      <Tab.Navigator screenOptions={{tabBarStyle: {backgroundColor: 'white'}}}>
        <Tab.Screen name="DashBoard" component={Dashboard} />
        <Tab.Screen name="Recharge" component={Recharge} />
        {
          !(["S1168445NEF"].includes(submerchant)) && <>
            <Tab.Screen name ="Reports" component= {ReportScreen} /> 
            <Tab.Screen name ="Bill" component= {BillProfile} />
          </>
        }
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
