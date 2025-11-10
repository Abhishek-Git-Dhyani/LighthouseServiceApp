
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import * as React from 'react';
import {Color, ColorBlueTheme} from '../../GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

import notifee from '@notifee/react-native';

const Dashboard = props => {

  const [userName, setUserName] = React.useState('');
  const [meterNumber, setMeterNumber] = React.useState('');
  const [token, setToken] = React.useState('');

  const [updatedOn, setUpdatedOn] = React.useState();
  const [unitNumber, setUnitNumber] = React.useState();
  const [rechargeOn, setRechargeOn] = React.useState();
  const [consumerNo, setConsumerNo] = React.useState();
  const [gridReading, setGridReading] = React.useState();
  const [dgReading, setDgReading] = React.useState();
  const [todayConsumption, setTodayConsumption] = React.useState();
  const [currentMonthConsumption, setCurrentMonthConsumption] = React.useState();
  const [balance, setBalance] = React.useState(undefined);
  const [consumerName, setConsumerName] = React.useState(undefined);
  const [deviceID, setDeviceID] = React.useState();

  const [meterSerialNumber, setMeterSerialNumber] = React.useState();

  const [voltage1, setvoltage1] = React.useState();
  const [voltage2, setvoltage2] = React.useState();
  const [voltage3, setvoltage3] = React.useState();
  const [watts1, setwatts1] = React.useState();
  const [watts2, setwatts2] = React.useState();
  const [watts3, setwatts3] = React.useState();


  const NotifyAlert = async () => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      vibration: true,
      sound: "defaul",
    });

    await notifee.displayNotification({
      title: 'Low Balance',
      body: 'Your Meter is Running on Low balance Please Recharge ASAP.',
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // // pressAction is needed if you want the notification to open the app when pressed
        // pressAction: {
        //   id: 'default',
        // },
      },
    });
  };

  React.useEffect(() => {
    setTimeout(() => {
      if (balance < 200) {
        NotifyAlert();
      }
      console.log(global.submerchant);
      console.log(["S1168445NEF","ascasc"].includes(global.submerchant));
    }, 2000);
  }, [balance]);

  React.useEffect(() => {
    const fetchData = async () => {
        const tokenDetail = await AsyncStorage.getItem('user_Token');
        const data = JSON.parse(tokenDetail);
        if (data?.token) {
            setUserName(data.fullName);
            setMeterNumber(data.userName);
            setToken(data.token);
            global.submerchant = data.subMerchantId;
        }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
      if(token.length > 0)
      {
        DashboardData();
        getStatics();
        getOngoingData();
      }
  },[token])

  const DashboardData = async () => {
    
    const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/Dashboard';
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization:`Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

   // console.log("Shikhu singh : "+response);


    response = await response.json();

    console.log(response.data);

    setBalance(response.data.balance);
    setConsumerName(response.data.consumerName);
    // setDeviceId(response.data.deviceID);
    // setEbRate(response.data.eBRATE);
    // setIsDeleted(response.data.isDeleted);
    // setLastUpdatedDate(response.data.lastUpdatedDate);
    // setNotificationCount(response.data.notificationCount);
    // setTodayActiveEnergy(response.data.todayActiveEnergy);
    // setYesterdayCummEnergy(response.data.yesterdayCummulativeActiveEnergy);
  };

    const getOngoingData = async () => {
    const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/OnGoingReport';
    let result = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    let response = await result.json();

    console.log(response);

    // setactivePower(response.data.activePower);
    // setapparentPower(response.data.apparentPower);
    // setkvahDG(response.data.kvahDG);
    // setkvahGrid(response.data.kvahGrid);
    // setkwhDG(response.data.kwhDG);
    // setkwhGrid(response.data.kwhGrid);
    // setpowerFactor(response.data.powerFactor);
    // setregistersID(response.data.registersID);
    // setupdatedDate(response.data.updatedDate);
    setvoltage1(response.data.voltage1);
    setvoltage2(response.data.voltage2);
    setvoltage3(response.data.voltage3);
    setwatts1(response.data.watts1);
    setwatts2(response.data.watts2);
    setwatts3(response.data.watts3);

  };

  const getStatics = async () => {
    
    const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/GetStatics';

    let result = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    let response = await result.json();

    console.log("Meter Static data   "+ result);

    setUpdatedOn(response.data.updatedOn);
    setUnitNumber(response.data.unitNumber);
    setRechargeOn(response.data.rechargeOn);
    setConsumerNo(response.data.consumerNo);
    setGridReading(response.data.gridReading);
    setDgReading(response.data.dgReading);
    setTodayConsumption(response.data.todayConsumption);
    setDeviceID(response.data.deviceID);
    setCurrentMonthConsumption(response.data.currentMonthConsumption);
    setMeterSerialNumber(response.data.meterSerialNumber);


  }

  const resetSettings = () => {
    setLowBalanceAlert(false);
    setNotificationAlert(false);
    setPowercutAlert(false);
    setdgsenseAlert(false);
    setshowSettingModal(false);
  };

  const submitRequest = () => {
    setshowSettingModal(false);
  };

  return (
    <View style={Styles.main}>
      <View style={Styles.cardContainer}>
        <View style={{flexDirection: 'row',justifyContent:'flex-start', padding: 20}}>
          <Image
            style={Styles.userImage}
            source={require('../../assets/images/user.png')}
          />
          <View style={{alignItems: 'center', alignContent:'center', justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '10%', alignItems: 'center'}}>
              <Image
                style={Styles.svgImage}
                source={require('../../assets/svg/usersvg.png')}
              />
            </View>
            <Text style={[Styles.userDetails,{color: 'white', flexWrap: 'wrap', width : 200}]}>Welcome! {userName}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '10%', alignItems: 'center'}}>
              <Image
                style={Styles.svgImage}
                source={require('../../assets/svg/metersvg.png')}
              />
            </View>
            <Text style={[Styles.userDetails,{color: 'white'}]}>{meterNumber}</Text>
          </View>
        </View>
        </View>
        
        
      </View>

      <View style={Styles.infoCard}>
        <Text style={{color: 'black'}}>LightHouseIoT Solutions Pvt ltd</Text>
      </View>

      <View style={[Styles.dataCard,{backgroundColor:'white'}]}>
        <View style={Styles.listHeader}>
          <Image style={Styles.headerIcon} source={require('../../assets/Icons/BasicInfo.png')}
                    />
            <Text style={Styles.headerText}>Basic Information</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
            <Text style={{color: 'black'}}>Consumer Number</Text>
            <Text style={Styles.userDetails}>{consumerNo}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
            <Text style={{color: 'black'}}>Consumer Name</Text>
            <Text style={[Styles.userDetails,{flexWrap: 'wrap', width : 200}]}>{consumerName}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
            <Text style={{color: 'black'}}>Meter number</Text>
            <Text style={Styles.userDetails}>{meterSerialNumber}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
            <Text style={{color: 'black'}}>Remaining Balance</Text>
            <Text style={Styles.userDetails}>{balance}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
            <Text style={{color: 'black'}}>UpdatedOn</Text>
            <Text style={Styles.userDetails}>{updatedOn}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
            <Text style={{color: 'black'}}>Recharge On</Text>
            <Text style={Styles.userDetails}>{rechargeOn}</Text>
        </View>
        {
          !(["S1168445NEF"].includes(submerchant)) && 
          <>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}> 
                <Text style={{color: 'black'}}>Unit Rate</Text>
                <Text style={Styles.userDetails}>{unitNumber}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                <Text style={{color: 'black'}}>Grid Reading</Text>
                <Text style={Styles.userDetails}>{gridReading}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                <Text style={{color: 'black'}}>Dg Reading</Text>
                <Text style={Styles.userDetails}>{dgReading}</Text>
            </View>
          </>
        }
        {
          !(["S1168445NEF"].includes(submerchant)) && 
          <>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                <Text style={{color: 'black'}}>Today Consumption</Text>
                <Text style={Styles.userDetails}>{todayConsumption}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                <Text style={{color: 'black'}}>Current Month Consumption</Text>
                <Text style={Styles.userDetails}>{currentMonthConsumption}</Text>
            </View>
          </>
        }

      </View>

      <View style={[Styles.dataCard,{backgroundColor:'white'}]}>
        <View style={Styles.listHeader}>
          <Image style={Styles.headerIcon} source={require('../../assets/Icons/energyIcon.png')}/>
            <Text style={Styles.headerText}>Energy Profile</Text>
        </View>
        <View style={{flexDirection:'row', width: '100%'}}>
          <View style={{flex:1, backgroundColor:'#ff6c55', margin: 2, marginVertical : 10, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
            <Text style={{color:'white', fontSize:12}}>Voltage-{voltage1}</Text>
            <Text style={{color:'white', fontSize:12}}>Load-{watts1}/kw</Text>
          </View>
          <View style={{flex:1, backgroundColor:'#cfd649', margin: 2, marginVertical : 10, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
            <Text style={{color:'white', fontSize:12}}>Voltage-{voltage2}</Text>
            <Text style={{color:'white', fontSize:12}}>Load-{watts2}/kw</Text>
          </View>
          <View style={{flex:1, backgroundColor:'#4978d6', margin: 2, marginVertical : 10, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
            <Text style={{color:'white', fontSize:12}}>Voltage - {voltage3}</Text>
            <Text style={{color:'white', fontSize:12}}>Load - {watts3}/kw</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
  },
  cardContainer: {
    height: '27%',
    width: '99%',
    shadow: 'grey',
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: Color.colorBlue,
    // backgroundColor: ColorBlueTheme.Blue8,
    alignItems: 'center',
  },
    headerIcon :{
   height :20,
   width :20,
  },
  backImage: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  userImage: {
    height: 80,
    width: 80,
  },
  svgImage: {
    height: 23,
    width: 23,
  },
  userDetails: {
    color: ColorBlueTheme.Blue10,
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    textAlign: 'right',
    textAlignVertical: 'center',
    // paddingRight: '5%',
  },
  infoCard: {
    height: '12%',
    width: '93%',
    marginTop: -70,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.98)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadow: 'gray',
    shadowOffset: 15,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  listText: {
    fontSize: 24,
    padding: 10,
    color: 'white',
    backgroundColor: 'skyblue',
    margin: 10,
    textAlign: 'center',
  },
  listBox: {
    width: '105%',
  },
  dataCard: {
    width: '90%',
    backgroundColor: 'rgba(240, 241, 249,1)',
    marginBottom: 10,
    shadowColor: 'grey',
    shadowOffset: 20,
    shadowOpacity: 0.6,
    elevation: 5,
    borderRadius: 10,
    overflow:'hidden'
    // alignItems: 'center',
  },
  dataImage: {
    backgroundColor: 'white',
    width: '25%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    elevation: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  rocketImage: {
    height: 80,
    width: 80,
  },
  analytics: {
    height: 90,
    width: '100%',
    borderRadius: 20,
    backgroundColor: Color.colorBlue,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickIcons: {
    height: '50%',
    width: '50%',
  },
  headerText: {
    color: 'white',
    textAlign: 'left',
    fontFamily: 'Poppins-Light',
    fontSize: 12,
     padding: 8,
  },
  listHeader: {
    flexDirection: 'row',
    backgroundColor: Color.colorNative,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 5,
    alignItems: 'center',
    paddingHorizontal: 10
  },
});

export default Dashboard;
