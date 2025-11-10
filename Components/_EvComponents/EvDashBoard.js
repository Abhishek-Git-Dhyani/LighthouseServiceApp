
import {
    View,
    Button,
    Text,
    TextInput,
    StyleSheet,
    ImageBackground,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
    Linking,
    Alert,
    StatusBar
  } from 'react-native';
  import * as React from 'react';
  import {Color, ColorBlueTheme, FontFamily, FontSize,easeBuzzCredintial} from '../../GlobalStyles';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import DatePicker from 'react-native-date-picker';
  import {constructFrom, format} from 'date-fns';
  import notifee from '@notifee/react-native';

  import CryptoJS from 'crypto-js';
  // import {AndroidColor} from '@notifee/react-native';
  
  import RNHTMLtoPDF from 'react-native-html-to-pdf';
  import { PermissionsAndroid } from 'react-native';
  import RNFetchBlob from 'rn-fetch-blob'
  
  import moment from 'moment';


import EasebuzzCheckout from 'react-native-easebuzz-kit'
import { ActivityIndicator } from 'react-native-paper';

const EvDashboard = props => {
      let data;
      let response;
    
      let currentData =  moment().format('YYYY-MM-DD');

      const [isLoading, setIsLoading] = React.useState(false);
      const [isOn, setIsOn] = React.useState(true);
      const [recentRecharge, setRecentRecharge] = React.useState();
      const [consumerId, setConsumerId] = React.useState();
      const [meterBalance, setMeterBalance] = React.useState();
      const [showModal, setShowModal] = React.useState(false);
    
      const [amount, setAmount] = React.useState('');
      const [firstName, setFirstName] = React.useState();
      const [subMerchantId,setSubMerchantId] = React.useState();
    
      const [userName, setUserName] = React.useState('');
      const [meterNumber, setMeterNumber] = React.useState('');
      const [token, setToken] = React.useState('');
    
      const [balance, setBalance] = React.useState(undefined);
      const [consumerName, setConsumerName] = React.useState(undefined);
      const [deviceId, setDeviceId] = React.useState(null);
      const [eBRate, setEbRate] = React.useState(undefined);
      const [dGRate, setDgRate] = React.useState(undefined);
      const [isDeleted, setIsDeleted] = React.useState(undefined);
      const [lastUpdatedData, setLastUpdatedDate] = React.useState(undefined);
      const [notificationCount, setNotificationCount] = React.useState(undefined);
      const [todayActiveEnergy, setTodayActiveEnergy] = React.useState(undefined);
      const [yesterdayCummEnergy, setYesterdayCummEnergy] =
        React.useState(undefined);
      const [peakLoad, setPeakLoad] = React.useState(0);
      const [operatingMode, setOperatingMode] = React.useState('EB');
    
      const [showConsumptionModal, setConsumptionModal] = React.useState(false);
      const [showSettingsModal, setshowSettingModal] = React.useState(false);
      const [showHelpModal, setShowHelpModal] = React.useState(false);
    
      const [consumptionDataType, setConsumptionDataType] = React.useState('none');
    
      //Settings Modal
      const [lowBalanceAlert, setLowBalanceAlert] = React.useState(false);
      const [notificationAlert, setNotificationAlert] = React.useState(false);
      const [powercutAlert, setPowercutAlert] = React.useState(false);
      const [dgSenseAlert, setdgsenseAlert] = React.useState(false);
    
      //userProfile
      const [profileName, setProfileName] = React.useState();
      const [phoneNumber, setPhoneNumber] = React.useState();
      const [email, setEmail] = React.useState();
      const [meterSerialNumber, setMeterSerialNumber] = React.useState();
    
      const [activePower, setactivePower] = React.useState();
      const [apparentPower, setapparentPower] = React.useState();
      const [kvahDG, setkvahDG] = React.useState();
      const [kvahGrid, setkvahGrid] = React.useState();
      const [kwhDG, setkwhDG] = React.useState();
      const [kwhGrid, setkwhGrid] = React.useState();
      const [powerFactor, setpowerFactor] = React.useState();
      const [updatedDate, setupdatedDate] = React.useState();
      const [voltage1, setvoltage1] = React.useState();
      const [voltage2, setvoltage2] = React.useState();
      const [voltage3, setvoltage3] = React.useState();
      const [registersID, setregistersID] = React.useState();
      const [watts1, setwatts1] = React.useState();
      const [watts2, setwatts2] = React.useState();
      const [watts3, setwatts3] = React.useState();
    
      const [fromdate, setfromDate] = React.useState(new Date());
      const [todate, setToDate] = React.useState(new Date());
      const [fromOpen, setfromOpen] = React.useState(false);
      const [toOpen, settoOpen] = React.useState(false);
      const [rechargeData, setRechargeData] = React.useState([]);
    
      const [showColorModal, setColorMoodal] = React.useState(false);
    
      const [filePath, setFilePath] = React.useState('');

      React.useEffect(() => {
        getToken();
      }, []);

      React.useEffect(() => {
        if (deviceId && token) {
          fetchConnectionStatus();
        }
      }, [deviceId, token]);
      
      const getToken = async () => {
        let tokenDetail = await AsyncStorage.getItem('Ev_user_Token');
        data = await JSON.parse(tokenDetail);

        console.log(data);

        setUserName(data.fullName);
        setMeterNumber(data.userName);
        setDeviceId(data.userID);
        setToken(data.token);
        DashboardData();
      };

      const fetchConnectionStatus = async () =>
      {
        console.log('fetch Connection status');
        console.log('device Id '+ deviceId);
        if(deviceId != null)
        {
          const intervalId = setInterval(() => {
              GetConnectionStatus();
          }, 2000);

          return () => clearInterval(intervalId);
        }else{
          setTimeout(() => {
            console.log('retry attempt');
            fetchConnectionStatus();
          }, 10000);
        }
      }

      const GetConnectionStatus = async () =>
      {
        // const url = `https://api.lighthouseiot.in/api/v1.0/Devices/GetDeviceConnectionStatus?id=${deviceId}`;
        const url = `https://api.lighthouseiot.in/api/v1.0/Consumer/LoadConnectionStatus`;
        let result = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        response = await result.json();
        console.log(response);
        if(isOn == !response)
        {
          setIsLoading(false);
        }
        setIsOn(response);        
      }

      const getStatics = async () => {
        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/GetStatics';
        let staticResponse = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        staticResponse = await staticResponse.json();
        staticResponse = staticResponse.data;
        // console.log(staticResponse);
        const staticData = {
          balance: staticResponse.balance,
          consumerName: staticResponse.consumerName,
          consumerNo: staticResponse.consumerNo,
          currentMonthConsumption: staticResponse.currentMonthConsumption,
          deviceID: staticResponse.deviceID,
          dgReading: staticResponse.dgReading,
          gridReading: staticResponse.gridReading,
          meterSerialNumber: staticResponse.meterSerialNumber,
          rechargeOn: staticResponse.rechargeOn,
          todayConsumption: staticResponse.todayConsumption,
          unitNumber: staticResponse.unitNumber,
          updatedOn: staticResponse.updatedOn,
        };
    
        return staticData;
      };
    
      const getRecentRecharges = async () => {
        setOnGoingReport(true);
        const url =
          'https://api.lighthouseiot.in/api/v1.0/Consumer/GetRechargeBasicRecentData';
        let response = await fetch(url, {
          method: 'GET',
          headers: {
           // Authorization: `Bearer ${data.token}`,
           Authorization: token == undefined ? `Bearer ${data.token}` : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        response = await response.json();
        // console.log(response);
        setConsumerId(response.data.consumerID);
        setMeterBalance(response.data.currentAmount);
        setRecentRecharge(response.data.getRecents);
        setMeterNumber(response.data.consumerID);
      };
    
      const initiatePaymentAPI = async () => {
        if(amount > 50)
        {
          setShowModal(false);
    
          let transactionId = `LHT${consumerId.slice(-5)}${Date.now()}`;
          // let transactionId = `LHT${consumerId.slice(-5)}${Date.now()}${performance.now().toString().slice(-5)}`;
          // console.log(transactionId);
    
          let easebuzKey = easeBuzzCredintial.key;
    
          const urlBody = {
            key: easebuzKey,
            txnid: transactionId,
            amount: 0,
            productinfo: 'Android',
            firstname: '',
            phone: '9999999999',
            email: 'abhi@gmail.com',
            surl: 'https://api.lighthouseiot.in/api/v1.0/MeterBill/updateRechargeStatus?model_id=',
            furl: 'https://api.lighthouseiot.in/api/v1.0/MeterBill/updateRechargeStatus?model_id=',
            hash: '',
            udf1: '',
            udf2: '',
            udf3: '',
            udf4: '',
            udf5: '',
            udf6: '',
            udf7: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            country: '',
            zipcode: '',
            show_payment_mode: '',
            sub_merchant_id: '',
            payment_category: '',
            account_no: '',
            ifsc: '',
          };
    
          urlBody.key = easeBuzzCredintial.key.toString();
          urlBody.amount = amount;
          urlBody.firstname = firstName;
          // urlBody.firstname = firstName.replace(/\s+/g, '');
          urlBody.hash = generateInitiateHash(urlBody);
          //for Production
          // console.log(subMerchantId);
          urlBody.sub_merchant_id = subMerchantId == null ? easeBuzzCredintial.subMerchantId : subMerchantId;
          //Testing envronment
          // urlBody.sub_merchant_id = easeBuzzCredintial.subMerchantId;
    
          const formBody = Object.keys(urlBody)
            .map(
              key => encodeURIComponent(key) + '=' + encodeURIComponent(urlBody[key]),
            )
            .join('&');
    
          const url = easeBuzzCredintial.easebuzzUrl;
    
          response = await fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
          });
          response = await response.json();
          // console.log(response);
          callPaymentGateway();
        }
        else{
          Alert.alert(
            "Minimum Recharge Amount",
            "Please Enter a minimum of 50₹ to proceeed further",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
          setAmount('');
        }
        
      };
    
      const callPaymentGateway = () => {
        console.log(
          `This is the hash Key coming and is working fine: ${response.data}`,
        );
        var options = {
          access_key: response.data,
          pay_mode: easeBuzzCredintial.payMode,
        };
        EasebuzzCheckout.open(options)
          .then(data => {
            //handle the payment success & failed response here
            // console.log('Payment Response:');
            let paymentInfo = data.payment_response;
    
            let paymentInformation = {
              PG_TYPE: paymentInfo.PG_TYPE,
              addedon: paymentInfo.addedon,
              amount: paymentInfo.amount,
              auth_code: paymentInfo.auth_code,
              bank_name: paymentInfo.bank_name,
              bank_ref_num: paymentInfo.bank_ref_num,
              bankcode: paymentInfo.bankcode,
              cardCategory: paymentInfo.cardCategory,
              card_type: paymentInfo.card_type,
              cardnum: paymentInfo.cardnum,
              cash_back_percentage: paymentInfo.cash_back_percentage,
              deduction_percentage: paymentInfo.deduction_percentage,
              easepayid: paymentInfo.easepayid,
              email: paymentInfo.email,
              error: paymentInfo.error,
              error_Message: paymentInfo.error_Message,
              error_code: paymentInfo.error_code,
              firstname: paymentInfo.firstname,
              flag: paymentInfo.flag,
              furl: paymentInfo.furl,
              hash: paymentInfo.hash,
              issuing_bank: paymentInfo.issuing_bank,
              key: paymentInfo.key,
              merchant_logo: paymentInfo.merchant_logo,
              mode: paymentInfo.mode,
              name_on_card: paymentInfo.name_on_card,
              net_amount_debit: paymentInfo.net_amount_debit,
              payment_source: paymentInfo.payment_source,
              phone: paymentInfo.phone,
              productinfo: paymentInfo.productinfo,
              response_code: paymentInfo.response_code,
              status: paymentInfo.status,
              surl: paymentInfo.surl,
              txnid: paymentInfo.txnid,
              udf1: paymentInfo.udf1,
              udf10: paymentInfo.udf10,
              udf2: paymentInfo.udf2,
              udf3: paymentInfo.udf3,
              udf4: paymentInfo.udf4,
              udf5: paymentInfo.udf5,
              udf6: paymentInfo.udf6,
              udf7: paymentInfo.udf7,
              udf8: paymentInfo.udf8,
              udf9: paymentInfo.udf9,
              unmappedstatus: paymentInfo.unmappedstatus,
              upi_va: paymentInfo.upi_va,
            };
    
            let getStaticsData;
            getStatics()
              .then(async data => {
                getStaticsData = data;
                // console.log(getStaticsData);
                let bodyData = {
                  ConsumerId: meterNumber,
                  Amount: parseInt(paymentInformation.amount, 10).toString(),
                  TransactionId: paymentInformation.txnid,
                  Status: paymentInformation.status,
                  DeviceID: getStaticsData.deviceID,
                  BankName: paymentInformation.bank_name,
                  Mode: paymentInformation.mode,
                  EasepayId: paymentInformation.easepayid,
                  Remarks: paymentInformation.Remarks,
                  RechargeBy: paymentInformation.firstname,
                };
                // console.log(bodyData);
    
                if (paymentInformation.status == 'success') {
                  const url =
                    'https://api.lighthouseiot.in/api/v1.0/Consumer/RechargeMeter';
                  let apiResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyData),
                  });
                  setAmount('');
                  getRecentRecharges();
                }
                else
                {
                  const url =
                    'https://api.lighthouseiot.in/api/v1.0/Consumer/RechargeMeter';
                  let apiResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyData),
                  });
                  setAmount('');
                  getRecentRecharges();
                }
              })
              .catch(error => {
                
              });
          })
          .catch(error => {
            //handle sdk failure issue here
            console.log('SDK Error:');
            console.log(error);
          });
      };

      const requestStoragePermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your storage to save the PDF file.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
      
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      };
    
      const createPDF = async () => {
        try {
          requestStoragePermission();
    
          let PDFOptions = {
            html: `
            <body style="padding:20px; display:flex; flex-direction:column; align-items:center; height:100vh; text-align:center;">
              <h2 style="color: ${(ColorBlueTheme.Blue8)}; font-weight: light; text-decoration: underline;">LightHouseIoT Solutions Pvt. Ltd.</h2>
              <h3 style="color: ${(ColorBlueTheme.Blue6)};">Recharge Invoice</h3>
    
              <div style="width: 80%; border: 0.5px solid blue; border-radius: 15px; padding: 10px; text-align: left;">
                <p style="color: ${(ColorBlueTheme.Blue6)};">User Name : ${userName}</p>
                <p style="color: ${(ColorBlueTheme.Blue6)};">Email : ${email}</p>
                <p style="color: ${(ColorBlueTheme.Blue6)};">Meter Serial No. : ${meterNumber}</p>
              </div>
    
              <hr>
    
              <table border="1" cellspacing="0" cellpadding="5">
                <tr style="background-color: ${Color.colorNative}; color: white;">
                  <th>Recharge Date</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
                ${rechargeData.map(item => {
                  // Only render rows where the status is "Success"
                  // if (item.status !== "Success" || item.status !== "success") return '';
    
                  return `
                    <tr>
                      <td>${item.rechargeDate}</td>
                      <td>${item.transactionID}</td>
                      <td>${item.amount}</td>                       
                      <td style="color: green;">${item.status}</td>  
                    </tr>
                  `;
                }).join('')}
              </table>
    
              <footer style="width: 100%; text-align: center;">
                <p style="color: black; font-weight: light; text-decoration: underline; position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; padding: 10px 0;">&#169; 2024 LightHouseIoT, All Right Reserved</p>
              </footer>
              
          </body>`,
            fileName: `LHT_Recharge_${currentData}`,
            directory: Platform.OS === 'android' ? 'Download' : 'Documents',
            base64: true
          };
          let file = await RNHTMLtoPDF.convert(PDFOptions);
    
          let filePath = RNFetchBlob.fs.dirs.DownloadDir + `/LHT_Recharge_${userName}_${currentData}.pdf`;
    
          // console.log(RNFetchBlob.fs.dirs.DownloadDir);
    
          RNFetchBlob.fs.writeFile(filePath, file.base64, 'base64').then(
            response => {
              console.log('Success log', response);
            }
          ).catch(errors => console.log('Error Log', errors))
    
          // console.log(file.filePath);
          setFilePath(file.filePath);
          Alert.alert("Recharge Invoice Downloaded Successfully", "Open it from Download folder", setRechargeHistory(false));
        } catch (error) {
          console.log('Failed to generate pdf', error.message);
          Alert.alert('Failed to generate pdf', error.message, setRechargeHistory(false));
        }
      };
    
      const logout = async () => {
        let tokenExist = await AsyncStorage.getItem('Ev_user_Token');
        if (tokenExist != null) {
          AsyncStorage.removeItem('Ev_user_Token');
          props.navigation.replace('Home')
        }
      };

      const ConnectDisconnect = async (props) => {
        setIsLoading(true);
        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/ConnectDisconnectMeter';
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            consumerId: deviceId,
            meterserialno: meterSerialNumber,
            CommandType: props,
          }),
        });
        response = await response.json();
        console.log(response);

        setTimeout(() => {
          fetchInstantData();
        }, 10000);
        
      }

      const fetchInstantData =  async () => {
        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/ConnectDisconnectMeter';
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            consumerId: deviceId,
            meterserialno: meterSerialNumber,
            CommandType: 'Instant',
          }),
        });
        response = await response.json();
        console.log(response);
      }
    
      const getRechargeHistory = async () => {
        let fromDate = format(fromdate, 'yyyy-MM-dd').toString();
        let toDate = format(todate, 'yyyy-MM-dd').toString();
    
        // console.log(token);
        const url = `https://api.lighthouseiot.in/api/v1.0/Consumer/GetRechargeHistory?FromDate=${fromDate}&ToDate=${toDate}`;
        let response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        response = await response.json();
        // console.log(response.data);
        setRechargeData(response.data);
        setShowList(true);
      };
    
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
    
      const [onGoingReport, setOnGoingReport] = React.useState(false);
      const [rechargeHistory, setRechargeHistory] = React.useState(false);
      const [showList, setShowList] = React.useState(false);
    
      
    
      React.useEffect(() => {
        setTimeout(() => {
          if (balance < 200) {
            NotifyAlert();
          }
        }, 2000);
      }, [balance]);
    

    
      const DashboardData = async () => {
        
        // console.log(data.token);
        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/Dashboard';
        let result = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization:`Bearer ${data.token}`,
            'Content-Type': 'application/json',
          },
        });

        // console.log(response);
    
        response = await result.json();
        
        // console.log(response.data);
    
        setBalance(response.data.balance);
        setConsumerName(response.data.consumerName);
        setDeviceId(response.data.deviceID);
        setEbRate(response.data.eBRATE);
        setDgRate(response.data.dGRate);
        // setIsDeleted(response.data.isDeleted);
        // setLastUpdatedDate(response.data.lastUpdatedDate);
        // setNotificationCount(response.data.notificationCount);
        // setTodayActiveEnergy(response.data.todayActiveEnergy);
        // setYesterdayCummEnergy(response.data.yesterdayCummulativeActiveEnergy);
      };
    
      const MyProfile = async () => {
        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/MyProfile';
        let userData = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
        });
        userData = await userData.json();
        // console.log('This is the my profile data ');
        // console.log(userData);
        // setProfileName(userData.data.accountName);
        // setPhoneNumber(userData.data.mobileNumber);
        // setEmail(userData.data.email);
        // setMeterSerialNumber(userData.data.accountNo);
      };
    
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

      const generateInitiateHash = keyData => {
        let key = easeBuzzCredintial.key;
        let salt = easeBuzzCredintial.salt;
        let udf8 = '',
          udf9 = '',
          udf10 = '';
      
        let HashSeq = `${key}|${keyData.txnid}|${keyData.amount}|${keyData.productinfo}|${keyData.firstname}|${keyData.email}|${keyData.udf1}|${keyData.udf2}|${keyData.udf3}|${keyData.udf4}|${keyData.udf5}|${keyData.udf6}|${keyData.udf7}|${udf8}|${udf9}|${udf10}|${salt}`;
      
        console.log(HashSeq);
        return generateHash512(HashSeq);
      };
      
      const generateTransactionHash = data => {
        let key = '2PBP7IABZ2';
        let salt = 'DAH88E3UWQ';
        let HashSeq = `${key}|${data.txnid}|${data.amount}|${data.email}|${data.phone}|${salt}`;
        console.log(HashSeq);
      
        return generateHash512(HashSeq);
      };
      
      const generateHash512 = text => {
        const hash = CryptoJS.SHA512(text);
        return hash.toString(CryptoJS.enc.Hex).toLowerCase();
      };
    
      return (
        <View style={Styles.main}>
          <StatusBar backgroundColor={isOn ? "#0f4ebb" : 'grey'} hidden={false} />
          <View style={[Styles.cardContainer,{backgroundColor: isOn ? Color.colorBlue : 'grey'}]}>
            <Image
              style={Styles.userImage}
              source={isOn ? require('../../assets/Icons/charging-station.png') : require('../../assets/Icons/charging-station-dis.png')}
            />
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <View style={{width: '10%', alignItems: 'center'}}>
                  <Image
                    style={Styles.svgImage}
                    source={require('../../assets/svg/usersvg.png')}
                  />
                </View>
                <Text style={Styles.userDetails}>{userName}</Text>
              </View>
            </View>
          </View>
          <View style={Styles.infoCard}>
            <Text>LightHouseIoT Solutions Pvt ltd</Text>
          </View>
    
          <TouchableOpacity style={{ 
            flexDirection: 'row', 
            justifyContent : 'space-evenly',
            backgroundColor: 'rgba(240, 241, 249,1)',
            width: '95%',
            height: '12%',
            backgroundColor: 'rgba(240, 241, 249,1)',
            marginBottom: 20,
            shadowColor: 'grey',
            shadowOffset: 20,
            shadowOpacity: 0.6,
            elevation: 5,
            alignItems: 'center',
            borderRadius: 5,}}
            onPress={() => getRecentRecharges()}>
            <View >
              <Text style={{fontSize:20, fontWeight:'bold'}}>EB Rate</Text>
              <Text style={{fontSize:20, fontWeight:'bold'}}>₹{eBRate}</Text>
            </View>
            <View >
              <Text style={{fontSize:20, fontWeight:'bold'}}>Balance</Text>
              <Text style={{fontSize:20, fontWeight:'bold'}}>₹{balance}</Text>
            </View>
          </TouchableOpacity>
          <View style={Styles.dataCard}>
            <View style={{width:'100%', alignItems: 'center'}}>
              <Text style={{fontSize:20, fontWeight:'bold'}}>Meter Connection Status</Text>
              <Text style={{fontSize:20, fontWeight:'bold', color: isOn? 'green': 'red'}}>{isOn ? 'Connected' : 'DisConnected'}</Text>
            </View>
          </View>
    
          <View style={staticStyles.main}>
            <TouchableOpacity
             disabled={isOn}
             onPress={() => ConnectDisconnect('Connect')}
             style={[staticStyles.functionBox,{ backgroundColor: !isOn ? '#1c9000' : 'grey' }]}>
              {
                (isLoading && !isOn) && <ActivityIndicator visible={false} style={{ position: 'absolute', top: 5, right: 5 }} color='white' />
              }
              <Image
                  style={[staticStyles.icon, {width:50, height: 50}]}
                  source={isOn ? require('../../assets/Icons/Connectdis.png') : require('../../assets/Icons/Connect.png')}
                />
                <Text
                  style={{
                    color: 'white',
                    position: 'absolute',
                    bottom: 3,
                    fontFamily: 'Poppins-Light',
                    fontSize: 10,
                  }}>
                  Connect
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
             disabled={!isOn}  
             onPress={() => ConnectDisconnect('DisConnect')}
             style={[staticStyles.functionBox,{backgroundColor: isOn ? '#901900' : 'grey'}]}>
              {
                (isLoading && isOn) && <ActivityIndicator visible={false} style={{ position: 'absolute', top: 5, right: 5 }} color='white' />
              }
              <Image
                  style={staticStyles.icon}
                  source={isOn ? require('../../assets/Icons/disconnect.png') : require('../../assets/Icons/disconnectdis.png')}
                />
                <Text
                  style={{
                    color: 'white',
                    position: 'absolute',
                    bottom: 3,
                    fontFamily: 'Poppins-Light',
                    fontSize: 10,
                  }}>
                  Disconnect
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={staticStyles.functionBox} onPress={() => logout()}>
              <Image
                  style={staticStyles.icon}
                  source={require('../../assets/Icons/home.png')}
                />
                <Text
                  style={{
                    color: 'white',
                    position: 'absolute',
                    bottom: 3,
                    fontFamily: 'Poppins-Light',
                    fontSize: 10,
                  }}>
                  Go Back
                </Text>
            </TouchableOpacity>
          </View>
    
          <Modal transparent={true} visible={onGoingReport} animationType="slide">
            <View style={staticModalStyle.centeredView}>
              <View style={staticModalStyle.modalView}>
                <View>
                    <View style={Styler.listHeader}>
                      <Text style={Styler.headerText}>Recent Recharges</Text>
                    </View>
                    <FlatList
                      data={recentRecharge}
                      keyExtractor={item => item.transactionID}
                      contentContainerStyle={{padding: 0}}
                      renderItem={({item}) => (
                        <View
                          style={[
                            Styler.dataCard,
                            {
                              height: 80,
                              backgroundColor:
                                item.status.toLowerCase() === 'success'
                                  ? 'rgba(240, 241, 249,1)'
                                  : 'rgba(250, 240, 240,1)',
                              shadowColor:
                                item.status.toLowerCase() === 'success' ? 'black' : 'black',
                            },
                          ]}>
                          <View style={Styles.resultContainer}>
                              <Image
                                style={{height: '80%', width: '80%'}}
                                source={require('../../assets/Icons/payment.png')}
                              />
                            </View>
                          <View style={Styler.idContainer}>
                            <Text style={Styler.textStyle}>{item.transactionID}</Text>
                            <Text style={{fontFamily: 'Poppins-Light'}}>
                              {item.rechargeDate}
                            </Text>
                          </View>
                          <View style={Styler.amountContainer}>
                            <Text style={[Styler.textStyle, {color: Color.colorNative}]}>
                              ₹{item.amount}
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: 'Poppins-Regular',
                                color:
                                  item.status.toLowerCase() === 'success' ? 'green' : 'red',
                              }}>
                              {item.status}
                            </Text>
                          </View>
                        </View>
                      )}
                    />
                  </View>
                <View style={{flexDirection: 'row',justifyContent: 'space-around'}}>
                  <TouchableOpacity
                    onPress={() => setShowModal(true)}
                    style={[staticModalStyle.closeBtn,{backgroundColor: 'green'}]}>
                    <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
                      Recharge Meter
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setOnGoingReport(false)}
                    style={staticModalStyle.closeBtn}>
                    <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
                      BACK
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
    
          <Modal transparent={true} visible={rechargeHistory} animationType="slide">
            <View style={staticModalStyle.centeredView}>
              <View style={staticModalStyle.modalView}>
                <Text style={staticModalStyle.modalText}>Recharge History</Text>
    
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginBottom: 20,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={() => setfromOpen(true)}>
                        <View
                          style={{
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Color.colorNative,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                          }}>
                          <Image
                            style={staticModalStyle.calendarImg}
                            source={require('../../assets/Icons/calendar.png')}
                          />
                        </View>
                      </TouchableOpacity>
                      <TextInput
                        editable={false}
                        value={fromdate.toDateString()}
                        style={{
                          borderWidth: 1,
                          borderColor: Color.colorNative,
                          backgroundColor: Color.colorWhitesmoke,
                          borderBottomRightRadius: 10,
                          borderTopRightRadius: 10,
                          borderTopLeftRadius: 0,
                          overflow: 'hidden',
                          height: 40,
                          width: 140,
                        }}
                      />
                      <DatePicker
                        modal
                        open={fromOpen}
                        date={fromdate}
                        onConfirm={date => {
                          setfromOpen(false);
                          setfromDate(date);
                        }}
                        onCancel={() => {
                          setfromOpen(false);
                        }}
                      />
                    </View>
    
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={() => settoOpen(true)}>
                        <View
                          style={{
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Color.colorNative,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                          }}>
                          <Image
                            style={staticModalStyle.calendarImg}
                            source={require('../../assets/Icons/calendar.png')}
                          />
                        </View>
                      </TouchableOpacity>
                      <TextInput
                        editable={false}
                        value={todate.toDateString()}
                        style={{
                          borderWidth: 1,
                          borderColor: Color.colorNative,
                          backgroundColor: Color.colorWhitesmoke,
                          borderBottomRightRadius: 10,
                          borderTopRightRadius: 10,
                          borderTopLeftRadius: 0,
                          overflow: 'hidden',
                          height: 40,
                          width: 140,
                        }}
                      />
                      <DatePicker
                        modal
                        open={toOpen}
                        date={todate}
                        onConfirm={date => {
                          settoOpen(false);
                          setToDate(date);
                        }}
                        onCancel={() => {
                          settoOpen(false);
                        }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={staticModalStyle.successBtn}
                    onPress={() => getRechargeHistory()}>
                    <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
                      Get Recharge History
                    </Text>
                  </TouchableOpacity>
                </View>
    
                <View style={{display: showList ? 'flex' : 'none'}}>
                  <View style={staticModalStyle.rechargeContainer}>
                    <FlatList
                      data={rechargeData}
                      renderItem={({item}) => (
                        <View style={staticModalStyle.listCard}>
                          <View style={{justifyContent: 'center', paddingLeft: 10}}>
                            <Image
                              style={staticModalStyle.calendarImg}
                              source={require('../../assets/Icons/right-arrow.png')}
                            />
                          </View>
                          <View style={{justifyContent: 'center'}}>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: 'black',
                                marginLeft: 20,
                                marginBottom: 5,
                              }}>
                              {item.transactionID.toString()}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: 'black',
                                marginLeft: 20,
                              }}>
                              {item.rechargeDate.toString()}
                            </Text>
                          </View>
                          <View style={{justifyContent: 'center', marginLeft: 30}}>
                            <Text style={{color: 'green', fontWeight: 'bold'}}>
                              ₹{item.amount.toString()}
                            </Text>
                            <Text style={{color: 'green'}}>
                              {item.status.toString()}
                            </Text>
                          </View>
                        </View>
                      )}
                      keyExtractor={item => item.transactionID}
                    />
    
                    <TouchableOpacity onPress={createPDF}>
                      <Image
                        style={staticModalStyle.fileIcon}
                        source={require('../../assets/Icons/file.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
    
                <TouchableOpacity
                  style={staticModalStyle.closeBtn}
                  onPress={() => {
                    setRechargeHistory(false);
                    setShowList(false);
                  }}>
                  <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal transparent={true} visible={showModal} animationType="slide">
            <View style={modalStyles.centeredView}>
              <View style={modalStyles.modalView}>
                <Text style={modalStyles.modalText}>Recharge Meter</Text>
                <TextInput
                  editable={false}
                  value={meterNumber}
                  style={modalStyles.textInput}
                  placeholder="Meter Number"
                />
                <TextInput
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={text => setAmount(text)}
                  style={modalStyles.textInput}
                  placeholder="Amount"
                />
    
                <View
                  style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      setAmount('');
                    }}>
                    <View style={modalStyles.abortBtn}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 15,
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Cancel Recharge
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => initiatePaymentAPI()}>
                    <View style={modalStyles.rechargeBtn}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 15,
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Recharge Meter
                      </Text>
                    </View>
                  </TouchableOpacity>
                      {/* <TouchableOpacity
                          onPress={() => {
                          if (!amount || parseInt(amount, 10) < 50) {
                            alert('Minimum recharge amount is ₹50');
                                } else {
                                    initiatePaymentAPI();
                                      }
                                        }}>
                                  <View style={modalStyle.rechargeBtn}>
                                <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Poppins-Regular' }}>
                              Recharge Meter
                            </Text>
                        </View>
                  </TouchableOpacity> */}
    
    
                </View>
              </View>
            </View>
          </Modal>

        </View>
      );
}


const Styles = StyleSheet.create({
    main: {
      alignItems: 'center',
      flex: 1,
    },
    cardContainer: {
      height: '30%',
      width: '99%',
      shadow: 'grey',
      elevation: 5,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      marginBottom: 20,
      overflow: 'hidden',
      backgroundColor: Color.colorBlue,
      alignItems: 'center',
    },
    backImage: {
      flex: 1,
      justifyContent: 'center',
      height: '100%',
    },
    userImage: {
      height: 80,
      width: 80,
      marginTop: '8%',
      marginBottom: 10,
    },
    svgImage: {
      height: 23,
      width: 23,
    },
    userDetails: {
      color: ColorBlueTheme.Blue3,
      fontSize: 16,
      fontFamily: 'Poppins-Light',
      textAlign: 'right',
      textAlignVertical: 'center',
      paddingRight: '5%',
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
      width: '95%',
      height: '12%',
      backgroundColor: 'rgba(240, 241, 249,1)',
      marginBottom: 20,
      shadowColor: 'grey',
      shadowOffset: 20,
      shadowOpacity: 0.6,
      elevation: 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
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
  });
  
  const staticStyles = StyleSheet.create({
    main: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      // alignItems: 'Left',
      width: '100%',
      // paddingTop: 10,
    },
    listText: {
      width: 110,
      height: 110,
      fontSize: 24,
      padding: 20,
      color: 'white',
      backgroundColor: 'skyblue',
      borderColor: 'black',
      borderWidth: 2,
      margin: 10,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    functionBox: {
      height: 100,
      width: 100,
      margin: 5,
      borderRadius: 20,
      shadowColor: 'grey',
      shadowOpacity: 0.7,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0f4ebb',
    },
    icon: {
      height: 70,
      width: 70,
    },
    logout: {
      height: 80,
      width: 80,
      shadowColor: 'yellow',
      elevation: 10,
    },
    userCard: {
      height: 300,
      width: '95%',
      backgroundColor: '#0f4ebb',
      shadowColor: '#0f4ebb',
      elevation: 10,
      position: 'absolute',
      bottom: 30,
      borderRadius: 10,
      padding: 20,
    },
    textStyle: {
      color: 'white',
      textShadowColor: 'white',
      elevation: 5,
    },
    cardText: {
      color: 'white',
      fontSize: 25,
      marginBottom: 10,
    },
  });
  
  const staticModalStyle = StyleSheet.create({
    main: {
      flex: 1,
    },
    Heading: {
      width: '100%',
      backgroundColor: Color.colorNative,
      color: 'white',
      textAlign: 'center',
      fontSize: 22,
      fontWeight: 'bold',
      padding: 15,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    },
    subHeading: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
      margin: 4,
    },
    subData: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    buttonView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(34 ,34 ,34 ,0.4)',
    },
    modalView: {
      width: '100%',
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 15,
      shadowColor: 'black',
      elevation: 10,
    },
    modalText: {
      backgroundColor: ColorBlueTheme.Blue10,
      color: ColorBlueTheme.Blue0,
      fontStyle: 'Poppins-Light',
      textAlign: 'center',
      borderTopEndRadius: 10,
      padding: 10,
      fontSize: 20,
      marginBottom: 20,
    },
    textInput: {
      borderWidth: 1,
      borderRadius: 5,
      width: 300,
      marginBottom: 20,
    },
    abortBtn: {
      borderRadius: 5,
      backgroundColor: '#fd6c6c',
      height: 50,
      width: 130,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'red',
      elevation: 10,
      overflow: 'hidden',
    },
    rechargeBtn: {
      borderRadius: 5,
      backgroundColor: '#6ecf7b',
      height: 50,
      width: 130,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'green',
      elevation: 10,
    },
    voltageContainer: {
      backgroundColor: 'lightgreen',
      width: '33.3%',
      alignItems: 'center',
    },
    powerContainer: {
      backgroundColor: 'lightgreen',
      width: '50%',
      alignItems: 'center',
    },
    powerHeading: {
      paddingLeft: '10%',
      padding: 10,
      textAlign: 'left',
      backgroundColor: '#61b5ef',
      width: '50%',
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    powerData: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      padding: 10,
      backgroundColor: '#e3e3e3',
      width: '50%',
    },
    btnClose: {
      width: '30%',
      marginTop: 30,
      alignSelf: 'flex-end',
      shadowColor: 'blue',
      elevation: 5,
      marginBottom: 30,
    },
    calendarImg: {
      height: 30,
      width: 30,
    },
    rechargeContainer: {
      marginTop: 20,
      borderRadius: 10,
      height: 400,
      width: '100%',
      borderWidth: 1,
      borderColor: Color.colorNative,
      padding: 5,
    },
    listText: {
      fontSize: 24,
      padding: 10,
      color: 'white',
      backgroundColor: 'skyblue',
      borderColor: 'black',
      borderWidth: 2,
      margin: 10,
      textAlign: 'center',
    },
    listCard: {
      width: '97%',
      marginBottom: 10,
      height: 70,
      backgroundColor: '#eae9ff',
      shadowColor: 'black',
      elevation: 5,
      alignSelf: 'center',
      borderRadius: 10,
      overflow: 'hidden',
      flexDirection: 'row',
    },
    downloadBtn: {
      height: 40,
      width: 150,
      backgroundColor: Color.colorNative,
      shadowColor: 'black',
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 5,
    },
    fileIcon: {
      height: 70,
      width: 70,
      position: 'absolute',
      bottom: -30,
      right: 0,
      shadowColor: 'black',
      elevation: 5,
    },
    successBtn: {
      backgroundColor: '#097900',
      color: 'white',
      fontFamily: 'Poppins-Regular',
      width: 'auto',
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      margin: 10,
      shadowColor: '#097900',
      shadowOpacity: 1,
      shadowOffset: 10,
      elevation: 10,
    },
    closeBtn: {
      backgroundColor: '#970000',
      width: 150,
      height: 35,
      alignSelf: 'flex-end',
      marginTop: 50,
      marginBottom: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      margin: 10,
      shadowColor: 'grey',
      shadowOpacity: 0.5,
      shadowOffset: 10,
      elevation: 10,
    },
  });

  const Styler = StyleSheet.create({
    main: {
      alignItems: 'center',
      padding: 5,
      flex: 1,
    },
    cardContainer: {
      height: '25%',
      width: '100%',
      marginBottom: 30,
      borderRadius: 5,
      backgroundColor: Color.colorNative,
      shadowColor: 'black',
      shadowOpacity: 0.7,
      shadowOffset: 10,
      elevation: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    watch: {
      height: '100%',
      width: '150%',
      alignItems: 'center',
      color: 'white',
    },
    listContainer: {
      width: '100%',
      marginTop: '5%',
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: ColorBlueTheme.Blue15,
      backgroundColor: 'white',
      shadowOpacity: 1,
      shadowOffset: 10,
      shadowColor: 'black',
      elevation: 10,
      margin: 5,
    },
    headerText: {
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Poppins-Light',
      fontSize: 20,
      padding: 5,
    },
    listHeader: {
      backgroundColor: Color.colorNative,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    dataCard: {
      width: '100%',
      height: 60,
      marginBottom: 10,
      elevation: 2,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      flex: 1,
      overflow: 'hidden',
    },
    resultContainer: {
      height: '100%',
      width: 90,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      shadow: 'grey',
      elevation: 2,
    },
    idContainer: {
      height: '100%',
      width: '70%',
      paddingLeft: 10,
      backgroundColor: 'transparent',
      color: Color.colorNative,
      justifyContent: 'center',
    },
    amountContainer: {
      height: '100%',
      width: '30%',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      fontSize: 15,
      fontFamily: 'Poppins-Medium',
      marginBottom: 10,
      color: 'black',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: -35,
      right: 25,
      borderRadius: 50,
      shadowColor: 'red',
      elevation: 5,
    },
    rechargeButton: {
      height: 90,
      width: 90,
      right: 0,
    },
    meterIcon: {
      height: '80%',
      width: '100%',
    },
  });

  const modalStyles = StyleSheet.create({
    main: {
      flex: 1,
    },
    buttonView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(34 ,34 ,34 ,0.4)',
    },
    modalView: {
      backgroundColor: '#fff',
      width: '80%',
      padding: 25,
      borderRadius: 15,
      shadowColor: 'black',
      elevation: 10,
    },
    modalText: {
      fontFamily: 'Poppins-Regular',
      color: 'grey',
      textAlign: 'center',
      fontSize: 20,
      marginBottom: 20,
    },
    textInput: {
      borderColor: Color.colorBlue,
      backgroundColor: ColorBlueTheme.Blue1,
      borderRadius: 5,
      fontSize: 20,
      padding: 5,
      textAlign: 'center',
      width: '100%',
      fontWeight: 'normal',
      marginBottom: 20,
      shadowColor: ColorBlueTheme.Blue10,
      elevation: 3,
    },
    abortBtn: {
      borderRadius: 5,
      backgroundColor: '#970000',
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      shadowOpacity: 1,
      shadowOffset: 10,
      shadowColor: '#970000',
      paddingHorizontal: 10,
      elevation: 5,
    },
    rechargeBtn: {
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: '#097900',
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      shadowOpacity: 1,
      shadowOffset: 10,
      shadowColor: '#097900',
      elevation: 5,
    },
  });

export default EvDashboard;