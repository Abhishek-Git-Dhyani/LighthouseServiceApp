import React from "react";
import { View,Text,StyleSheet, Image,TouchableOpacity } from "react-native";
import {Color, ColorBlueTheme, FontFamily, FontSize} from '../../GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const ConsumerProfile = props => {
    let data;

    const [token, setToken] = React.useState('');
    const [accountNo , setAccountNo] = React.useState();
    const [accountName , setAccountName] = React.useState();
    const [billAmount , setBillAmount] = React.useState();
    const [rechargeDate , setRechargeDate] = React.useState();
    const [meterSerialNumber , setMeterSerialNumber] = React.useState();
    const [address ,setAddress] = React.useState();
    const [email , setEmail] = React.useState();
    const [mobileNumber , setMobileNumber] = React.useState();
    const [userID , setUserID] = React.useState();

    const [maintenanceCharge , setMaintenanceCharge] = React.useState();
    const [waiverCharges , setWaiverCharges] = React.useState();
    const [waterCharges , setWaterCharges] = React.useState();
    const [sewageCharges ,setSewageCharges] = React.useState();
    const [chequeCharges , setChequeCharges] = React.useState();
    const [otherCharges , setOtherCharges] = React.useState();
    const [ebRATE, setEbRate] = React.useState();
    const [dgRATE, setDgRate] = React.useState();

    React.useEffect(() => {
        const fetchData = async () => {
            const tokenDetail = await AsyncStorage.getItem('user_Token');
            const data = JSON.parse(tokenDetail);
            if (data?.token) {
                setToken(data.token);
            }
        };

        fetchData();
    }, []);

    
    React.useEffect(() => {
        if(token.length > 0)
        {
            console.log('user-token ' +token)
            fetchUserDetail();
            fetchTariffDetail();
        }
    },[token])


    
    const fetchUserDetail = async () => {

        console.log(token);

        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/MyProfile';
        let userData = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        });
        userData = await userData.json();

        console.log(userData);

        setAccountNo(userData.data.accountNo);
        setAccountName(userData.data.accountName);
        setBillAmount(userData.data.billAmount);
        setRechargeDate(userData.data.rechargeDate);
        setMeterSerialNumber(userData.data.meterSerialNumber);
        setAddress(userData.data.address);
        setEmail(userData.data.email);
        setMobileNumber(userData.data.mobileNumber);
        setUserID(userData.data.userID);
    };
    
    const fetchTariffDetail = async () => {
        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/GetTariffRate';
        let rateResponse = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        let responseData = await rateResponse.json();

        setMaintenanceCharge(responseData.data.maintenanceCharge);
        setWaiverCharges(responseData.data.waiverCharges);
        setWaterCharges(responseData.data.waterCharges);
        setSewageCharges(responseData.data.sewageCharges);
        setChequeCharges(responseData.data.chequeCharges);
        setOtherCharges(responseData .data.otherCharges);
        setEbRate(JSON.stringify(responseData.data.ebRate).replace(/"/g, ''));
        setDgRate(JSON.stringify(responseData.data.dgRate).replace(/"/g, ''));
    }

    const logout = async () => {
        let tokenExist = await AsyncStorage.getItem('user_Token');
        if (tokenExist != null) {
            AsyncStorage.removeItem('user_Token');
            props.navigation.replace('Login');
        }
    };

    const [EvUserName, setEvUserName] = React.useState('drvinay2610@gmail.com');
    const [EvPassword, setEvPassword] = React.useState('0000000000000062');

    const EvLogin = async () => {
        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/Login';

        const loginData = {
        UserName: EvUserName,
        Password: EvPassword,
        DeviceType: 'android',
        DeviceTokenID: 'string',
        UserId: 0,
        };

        let result = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loginData),
        });

        result = await result.json();

        if (result.success) {
        //  console.log(result);
        await AsyncStorage.setItem('Ev_user_Token', JSON.stringify(result.data));
        props.navigation.replace('Ev');
        } else {
        console.warn(result.message);
        }
    };
    
    return(
        <View style={{flex:1,justifyContent : 'center',alignItems: 'center'}}>
            <View style={styles.card}>
                <Image
                      style={styles.userImage}
                      source={require('../../assets/images/user.png')}
                    />
                <View style={styles.cardContainer}>
                    <View style={styles.listHeader}>
                        <Image style={styles.headerIcon} source={require('../../assets/Icons/userbasicinfo.png')}/>
                        <Text style={styles.headerText}>User Basic Info</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>UserName</Text>
                        <Text style={styles.userDetails}>{accountName}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>Email</Text>
                        <Text style={styles.userDetails}>{email}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>Mobile No.</Text>
                        <Text style={styles.userDetails}>{mobileNumber}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>Meter Serial No.</Text>
                        <Text style={styles.userDetails}>{meterSerialNumber}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>Address</Text>
                        <Text style={styles.userDetails}>{address}</Text>
                    </View>
                    
                </View>

                <View style={styles.cardContainer}>
                    <View style={styles.listHeader}>
                        <Image style={styles.headerIcon} source={require('../../assets/Icons/tariff.png')}/>
                        <Text style={styles.headerText}>User Tariff Details</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>Maintenance Charge</Text>
                        <Text style={styles.userDetails}>{maintenanceCharge}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>Other Charge</Text>
                        <Text style={styles.userDetails}>{otherCharges}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>Eb Rate</Text>
                        <Text style={styles.userDetails}>{ebRATE}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <Text>Dg Rate</Text>
                        <Text style={styles.userDetails}>{dgRATE}</Text>
                    </View>
                </View>
                <View style={{flexDirection : 'row' , justifyContent:'space-between'}}>


            <TouchableOpacity style={styles.functionBox} onPress={() => EvLogin()}>
                    <Image
                        style={styles.icon}
                        source={require('../../assets/Icons/charging.png')}
                    />
                    <Text
                        style={{
                        color: 'white',
                        position: 'absolute',
                        bottom: 3,
                        fontFamily: 'Poppins-Light',
                        fontSize: 10,
                        }}>
                       Ev
                    </Text>
                </TouchableOpacity>
                    <TouchableOpacity style={styles.functionBox} onPress={logout}>
                    <Image
                        style={styles.icon}
                        source={require('../../assets/Icons/logout.png')}
                    />
                    <Text
                        style={{
                        color: 'white',
                        position: 'absolute',
                        bottom: 3,
                        fontFamily: 'Poppins-Light',
                        fontSize: 10,
                        }}>
                           Log-Out
                    </Text>
                </TouchableOpacity>


                </View>
                
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
  card:{
    height: 'auto',
    width: '90%',
    margin : 5,
    backgroundColor: 'white',
    overflow: 'hidden',
    // padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 15,
    borderRadius : 15,
    alignItems : 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    borderRadius: 10,
    backgroundColor:'white',
    // paddingHorizontal: 10,
    width: '95%',
    overflow: 'hidden',
    marginBottom: 10,
        shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 5,
  },
  userImage: {
    height: 80,
    width: 80,
    marginTop: '5%',
    marginBottom: 10,
  },
  svgImage: {
    height: 17,
    width: 17,
  },
    userDetails: {
    color: ColorBlueTheme.Blue10,
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    textAlign: 'right',
    textAlignVertical: 'center',
    // paddingRight: '5%',
  },
      headerText: {
    color: 'white',
    textAlign: 'left',
    fontFamily: 'Poppins-Light',
    fontSize: 12,
     padding: 8,
  },
    functionBox: {
    height: 80,
    width: 80,
    margin: 5,
    borderRadius: 20,
    shadowColor: 'grey',
    shadowOpacity: 0.7,
    elevation: 10,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f4ebb',
  },
  icon: {
    height: 50,
    width: 50,
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
      headerIcon :{
   height :20,
   width :20,
  },
});

export default ConsumerProfile;