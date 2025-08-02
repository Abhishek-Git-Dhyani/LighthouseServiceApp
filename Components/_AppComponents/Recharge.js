/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import * as React from 'react';
import {
  Color,
  ColorBlueTheme,
  easeBuzzCredintial,
} from '../../GlobalStyles';

import EasebuzzCheckout from 'react-native-easebuzz-kit';


import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
;

import DatePicker from 'react-native-date-picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';

import { format } from 'date-fns';

const Recharge = () => {
  let data;
  let currentData =  moment().format('YYYY-MM-DD');
  let response;
  const [token, setToken] = React.useState();
  const [meterBalance, setMeterBalance] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [recentRecharge, setRecentRecharge] = React.useState();
  const [meterNumber, setMeterNumber] = React.useState();

  const [amount, setAmount] = React.useState('');
  const [firstName, setFirstName] = React.useState();
  const [consumerId, setConsumerId] = React.useState();
  const [subMerchantId,setSubMerchantId] = React.useState();

  const [rechargeHistory, setRechargeHistory] = React.useState(false);
  const [fromdate, setfromDate] = React.useState(new Date());
  const [todate, setToDate] = React.useState(new Date());
  const [fromOpen, setfromOpen] = React.useState(false);
  const [toOpen, settoOpen] = React.useState(false);
  const [rechargeData, setRechargeData] = React.useState([]);
  const [showList, setShowList] = React.useState(false);

  const [ebRate, setEbRate] = React.useState(false);
  const [dgRate, setDgRate] = React.useState(false);

  React.useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    let tokenDetail = await AsyncStorage.getItem('user_Token');
    data = await JSON.parse(tokenDetail);
    setToken(data.token);
    setSubMerchantId(data.subMerchantId);
    setFirstName(data.fullName.toString());
    getRecentRecharges();
    // getElectricityRate();
  };

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
    console.log(staticResponse);
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
    const url =
      'https://api.lighthouseiot.in/api/v1.0/Consumer/GetRechargeBasicRecentData';
    // const url =
    // 'http://103.165.78.188:18599/api/v1.0/Consumer/GetRechargeBasicRecentData';
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

  const getElectricityRate = async () => {
    const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/GetTariffRate';
   // const url ='http://103.165.78.188:18599/api/v1.0/Consumer/GetTariffRate'; 
    let rateResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.token}`,
        'Content-Type': 'application/json',
      },
    });
    let responseData = await rateResponse.json();
    setEbRate(JSON.stringify(responseData.data.ebRate).replace(/"/g, ''));
    setDgRate(JSON.stringify(responseData.data.dgRate).replace(/"/g, ''));
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
      urlBody.firstname = firstName.replace(/\s+/g, '');
      urlBody.hash = generateInitiateHash(urlBody);
      //for production

     urlBody.sub_merchant_id = subMerchantId;

      //for testing
      //urlBody.sub_merchant_id = easeBuzzCredintial.subMerchantId;

      // From Here
      let getStaticsData;
      getStatics()
        .then(async data => {
          getStaticsData = data;
          // console.log(getStaticsData);
          let bodyData = {
            ConsumerId: meterNumber,
            Amount: parseInt(urlBody.amount, 10).toString(),
            TransactionId: urlBody.txnid,
            Status: 'Pending',
            DeviceID: getStaticsData.deviceID,
            BankName: 'none',
            Mode: 'Online',
            EasepayId: '',
            Remarks: '',
            RechargeBy: urlBody.firstname,
          };

          const url =
              'https://api.lighthouseiot.in/api/v1.0/Consumer/RechargeMeter';
            let apiResponse = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bodyData),
            });
            console.log(apiResponse);
            
        })
        .catch(error => {
          // console.log(error);
        });
      // End Here

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
        "Please Enter a minimum of 51₹ to proceeed further",
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
      pay_mode: easeBuzzCredintial.payMode.toString(),
    };
    console.log(options);
    EasebuzzCheckout.open(options)
      .then(data => {
        //handle the payment success & failed response here
        setAmount('');
        getRecentRecharges();
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
          <h3 style="color: ${(ColorBlueTheme.Blue6)};">Bill Report</h3>

          <div style="width: 80%; border: 0.5px solid blue; border-radius: 15px; padding: 10px; text-align: left;">
            <p style="color: ${(ColorBlueTheme.Blue6)};">User Name : ${firstName}</p>
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

      let filePath = RNFetchBlob.fs.dirs.DownloadDir + `/LHT_Recharge_${firstName}_${currentData}.pdf`;

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

  return (
    <View style={Styles.main}>
      <View style={Styles.cardContainer}>
        <View style={{width: '30%'}}>
          <Image
            style={Styles.meterIcon}
            source={require('../../assets/Icons/meter4.png')}
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: ColorBlueTheme.Blue5,
            height: '60%',
            justifyContent: 'center',
            width: '70%',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            backgroundColor: ColorBlueTheme.Blue5,
            shadowColor: ColorBlueTheme.Blue1,
            elevation: 5,
            paddingHorizontal: '5%',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 16,
                color: ColorBlueTheme.Blue15,
                fontFamily: 'Poppins-Regular',
              }}>
              BALANCE :
            </Text>
            <Text style={{fontSize: 18, color: ColorBlueTheme.Blue2}}>
              ₹{meterBalance}
            </Text>
          </View>
       
        </View>
        {/* <TouchableOpacity
          style={Styles.buttonContainer}
          onPress={() => setShowModal(true)}> 
          <Image
            style={Styles.rechargeButton}
            source={require('../../assets/Icons/rupee1.png')}
          />
        </TouchableOpacity> */}
      </View>
      <View style={Styles.listContainer}>
        <View style={Styles.listHeader}>
            <Image
            style={Styles.recentIcon}
            source={require('../../assets/Icons/recenticon.png')}
          />
          <Text style={Styles.headerText}>Recent Recharges</Text>
        </View>
        <FlatList
          data={recentRecharge}
          keyExtractor={item => item.transactionID}
          contentContainerStyle={{padding: 10}}
          renderItem={({item}) => (
            <View
              style={[
                Styles.dataCard,
                {
                  backgroundColor:
                    item.status.toLowerCase() === 'success'
                      ? 'rgba(240, 241, 249,1)'
                      : 'rgba(250, 240, 240,1)',
                  shadowColor:
                    item.status.toLowerCase() === 'success' ? 'black' : 'black',
                },
              ]}>
              {/* <View style={Styles.resultContainer}>
                  <Image
                    style={{height: '80%', width: '80%'}}
                    source={require('../../assets/Icons/payment.png')}
                  />
                </View> */}
              <View style={Styles.idContainer}>
                <Text style={Styles.textStyle}>{item.transactionID}</Text>
                <Text style={{fontFamily: 'Poppins-Light'}}>
                  {item.rechargeDate}
                </Text>
              </View>
              <View style={Styles.amountContainer}>
                <Text style={[Styles.textStyle, {color: Color.colorNative}]}>
                  ₹{item.amount}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
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

<View style={{flexDirection:'row', justifyContent:'space-around', width: '100%', margin: 20}}>
  <TouchableOpacity
   style={[modalStyle.abortBtn,{width:150, height: 50, backgroundColor:'#34a1eb'}]}
   onPress={() => setRechargeHistory(true)}>
    <Text style={{color:'white'}}>Recharge History</Text>
  </TouchableOpacity>

  <TouchableOpacity
   style={[modalStyle.rechargeBtn,{width:150, height: 50}]}
   onPress={() => setShowModal(true)}>
    <Text style={{color:'white'}}>Recharge Meter</Text>
  </TouchableOpacity>
</View>


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
                    mode ='date'
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
                    mode ='date'
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
            <TouchableOpacity
                onPress={() => setRechargeHistory(false)}
                >
                <View style={modalStyle.abortBtn}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>


     
            {/* <Button onPress={() => setRechargeHistory(false)}>cancel</Button> */}
          </View>
        </View>
      </Modal> 

      <Modal transparent={true} visible={showModal} animationType="slide">
        <View style={modalStyle.centeredView}>
          <View style={modalStyle.modalView}>
            <Text style={modalStyle.modalText}>Recharge Meter</Text>
            <TextInput
              editable={false}
              value={meterNumber}
              style={modalStyle.textInput}
              placeholder="Meter Number"
            />
            <TextInput
              keyboardType="numeric"
              value={amount}
              onChangeText={text => setAmount(text)}
              style={modalStyle.textInput}
              placeholder="Amount"
            />

            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setAmount('');
                }}>
                <View style={modalStyle.abortBtn}>
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
                <View style={modalStyle.rechargeBtn}>
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

const Styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    padding: 5,
    flex: 1,
  },
  

  cardContainer: {
    height: '25%',
    width: '100%',
    marginBottom:10,
    borderRadius: 5,
    backgroundColor: Color.colorNative,
    shadowColor: 'black',
    shadowOpacity: 0.7,
    shadowOffset: 10,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
    height: '60%',
    borderRadius: 10,
    borderColor: ColorBlueTheme.Blue15,
    backgroundColor: 'white',
    shadowOpacity: 1,
    shadowOffset: 10,
    shadowColor: 'black',
    elevation: 10,
  },

  headerText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    fontSize: 20,
    padding: 5,
  },
  listHeader: {
    flexDirection:'row',
    backgroundColor: Color.colorNative,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center'
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
    backgroundColor: 'transparent',
    color: Color.colorNative,
    justifyContent: 'center',
  },
  amountContainer: {
    height: '100%',
    width: '30%',
    paddingLeft:10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 14,
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
  recentIcon:{
    height :30,
    width :30,
  },
  meterIcon: {
    height: '80%',
    width: '100%',
  },
  
  //   functionBox: {
  //   height: 100,
  //   width: 100,
  //   margin: 5,
  //   borderRadius: 20,
  //   shadowColor: 'grey',
  //   shadowOpacity: 0.7,
  //   elevation: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#0f4ebb',
  // },


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
    height: 80,
    width: 80,
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
    padding: 5,
  },
});

const modalStyle = StyleSheet.create({
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
 
});

export default Recharge;
