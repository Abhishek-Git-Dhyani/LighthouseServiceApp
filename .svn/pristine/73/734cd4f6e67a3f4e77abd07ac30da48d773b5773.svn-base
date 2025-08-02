/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
// import {
//   Button,
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   ScrollView,
//   FlatList,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as React from 'react';
// import {
//   Color,
//   FontFamily,
//   FontSize,
//   Border,
//   ColorBlueTheme,
// } from '../../GlobalStyles';
// import DatePicker from 'react-native-date-picker';
// import {TextInput} from 'react-native-paper';
// import {constructFrom, format} from 'date-fns';

// const Statistics = props => {
//   let data;
//   const [token, setToken] = React.useState();
//   const [activePower, setactivePower] = React.useState();
//   const [apparentPower, setapparentPower] = React.useState();
//   const [kvahDG, setkvahDG] = React.useState();
//   const [kvahGrid, setkvahGrid] = React.useState();
//   const [kwhDG, setkwhDG] = React.useState();
//   const [kwhGrid, setkwhGrid] = React.useState();
//   const [powerFactor, setpowerFactor] = React.useState();
//   const [updatedDate, setupdatedDate] = React.useState();
//   const [voltage1, setvoltage1] = React.useState();
//   const [voltage2, setvoltage2] = React.useState();
//   const [voltage3, setvoltage3] = React.useState();
//   const [registersID, setregistersID] = React.useState();
//   const [watts1, setwatts1] = React.useState();
//   const [watts2, setwatts2] = React.useState();
//   const [watts3, setwatts3] = React.useState();

//   const [fromdate, setfromDate] = React.useState(new Date());
//   const [todate, setToDate] = React.useState(new Date());
//   const [fromOpen, setfromOpen] = React.useState(false);
//   const [toOpen, settoOpen] = React.useState(false);
//   const [rechargeData, setRechargeData] = React.useState([]);

//   const [showColorModal, setColorMoodal] = React.useState(false);

//   React.useEffect(() => {
//     getToken();
//   }, []);

//   const getToken = async () => {
//     let tokenDetail = await AsyncStorage.getItem('user_Token');
//     data = await JSON.parse(tokenDetail);
//     setToken(data.token);
//   };

//   const logout = async () => {
//     let tokenExist = await AsyncStorage.getItem('user_Token');
//     if (tokenExist != null) {
//       AsyncStorage.removeItem('user_Token');
//       props.navigation.navigate('Login');
//     }
//   };

//   const getOngoingData = async () => {
//     const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/OnGoingReport';
//     let response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     response = await response.json();

//     setactivePower(response.data.activePower);
//     setapparentPower(response.data.apparentPower);
//     setkvahDG(response.data.kvahDG);
//     setkvahGrid(response.data.kvahGrid);
//     setkwhDG(response.data.kwhDG);
//     setkwhGrid(response.data.kwhGrid);
//     setpowerFactor(response.data.powerFactor);
//     setregistersID(response.data.registersID);
//     setupdatedDate(response.data.updatedDate);
//     setvoltage1(response.data.voltage1);
//     setvoltage2(response.data.voltage2);
//     setvoltage3(response.data.voltage3);
//     setwatts1(response.data.watts1);
//     setwatts2(response.data.watts2);
//     setwatts3(response.data.watts3);

//     console.log(response.data);
//     setOnGoingReport();
//   };

//   const getRechargeHistory = async () => {
//     let fromDate = format(fromdate, 'yyyy-MM-dd').toString();
//     let toDate = format(todate, 'yyyy-MM-dd').toString();

//     console.log(token);
//     const url = `https://api.lighthouseiot.in/api/v1.0/Consumer/GetRechargeHistory?FromDate=${fromDate}&ToDate=${toDate}`;
//     let response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     response = await response.json();
//     console.log(response.data);
//     setRechargeData(response.data);
//     setShowList(true);
//   };

//   const [onGoingReport, setOnGoingReport] = React.useState(false);
//   const [rechargeHistory, setRechargeHistory] = React.useState(false);
//   const [showList, setShowList] = React.useState(false);

//   return (
//     <View style={Styles.main}>
//       <TouchableOpacity onPress={() => getOngoingData()}>
//         <View style={Styles.functionBox}>
//           <Image
//             style={Styles.icon}
//             source={require('../../assets/Icons/analysis.png')}
//           />
//           <Text
//             style={{
//               color: 'white',
//               position: 'absolute',
//               bottom: 4,
//               fontWeight: 'bold',
//             }}>
//             Instant Data
//           </Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => setRechargeHistory(true)}>
//         <View style={Styles.functionBox}>
//           <Image
//             style={Styles.icon}
//             source={require('../../assets/Icons/history.png')}
//           />
//           <Text
//             style={{
//               color: 'white',
//               position: 'absolute',
//               bottom: 4,
//               fontWeight: 'bold',
//             }}>
//             Recharge History
//           </Text>
//         </View>
//       </TouchableOpacity>

//       <View style={Styles.userCard}>
//         <Text style={Styles.cardText}>Consumer Name : {}</Text>
//         <Text style={Styles.cardText}>Mobile NUmber : {}</Text>
//         <Text style={Styles.cardText}>Email Address : {}</Text>
//         <Text style={Styles.cardText}>Last Recharge : {}</Text>
//         <TouchableOpacity
//           style={{position: 'absolute', bottom: 20, right: 20}}
//           onPress={logout}>
//           <Image
//             style={Styles.logout}
//             source={require('../../assets/Icons/logout.png')}
//           />
//         </TouchableOpacity>
//       </View>

//       <Modal transparent={true} visible={onGoingReport} animationType="slide">
//         <View style={modalStyle.centeredView}>
//           <View style={modalStyle.modalView}>
//             <Text style={modalStyle.modalText}>On-GOing Report</Text>
//             <View style={{alignItems: 'center'}}>
//               <Text style={modalStyle.Heading}>Voltage Profile</Text>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   width: '100%',
//                   justifyContent: 'space-around',
//                   marginBottom: 10,
//                   borderBottomLeftRadius: 5,
//                   borderBottomRightRadius: 5,
//                   overflow: 'hidden',
//                 }}>
//                 <View
//                   style={[
//                     modalStyle.voltageContainer,
//                     {backgroundColor: '#d10000'},
//                   ]}>
//                   <Text style={modalStyle.subHeading}>Vr</Text>
//                   <Text style={modalStyle.subData}>{voltage1}</Text>
//                 </View>
//                 <View
//                   style={[
//                     modalStyle.voltageContainer,
//                     {backgroundColor: '#d1cb00'},
//                   ]}>
//                   <Text style={modalStyle.subHeading}>Vy</Text>
//                   <Text style={modalStyle.subData}>{voltage2}</Text>
//                 </View>
//                 <View
//                   style={[
//                     modalStyle.voltageContainer,
//                     {backgroundColor: '#000ad1'},
//                   ]}>
//                   <Text style={modalStyle.subHeading}>Vz</Text>
//                   <Text style={modalStyle.subData}>{voltage3}</Text>
//                 </View>
//               </View>
//               <Text style={modalStyle.Heading}>Power Profile</Text>
//               <View>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     width: '100%',
//                     justifyContent: 'space-around',
//                   }}>
//                   <View
//                     style={[
//                       modalStyle.powerContainer,
//                       {backgroundColor: '#727272'},
//                     ]}>
//                     <Text style={modalStyle.subHeading}>Active Power</Text>
//                     <Text style={modalStyle.subData}>{activePower}</Text>
//                   </View>
//                   <View
//                     style={[
//                       modalStyle.powerContainer,
//                       {backgroundColor: '#727272'},
//                     ]}>
//                     <Text style={modalStyle.subHeading}>Apparant Power</Text>
//                     <Text style={modalStyle.subData}>{apparentPower}</Text>
//                   </View>
//                 </View>
//                 <View>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '100%',
//                       justifyContent: 'space-around',
//                       marginBottom: 1,
//                     }}>
//                     <Text style={modalStyle.powerHeading}>kvahDG</Text>
//                     <Text style={modalStyle.powerData}>{kvahDG}</Text>
//                   </View>
//                 </View>
//                 <View>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '100%',
//                       justifyContent: 'space-around',
//                       marginBottom: 1,
//                     }}>
//                     <Text style={modalStyle.powerHeading}>kvahGrid</Text>
//                     <Text style={modalStyle.powerData}>{kvahGrid}</Text>
//                   </View>
//                 </View>
//                 <View>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '100%',
//                       justifyContent: 'space-around',
//                       marginBottom: 1,
//                     }}>
//                     <Text style={modalStyle.powerHeading}>kwhDG</Text>
//                     <Text style={modalStyle.powerData}>{kwhDG}</Text>
//                   </View>
//                 </View>
//                 <View>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '100%',
//                       justifyContent: 'space-around',
//                       marginBottom: 1,
//                     }}>
//                     <Text style={modalStyle.powerHeading}>kwhGrid</Text>
//                     <Text style={modalStyle.powerData}>{kwhGrid}</Text>
//                   </View>
//                 </View>
//                 <View>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '100%',
//                       justifyContent: 'space-around',
//                       marginBottom: 1,
//                     }}>
//                     <Text style={modalStyle.powerHeading}>powerFactor</Text>
//                     <Text style={modalStyle.powerData}>{powerFactor}</Text>
//                   </View>
//                 </View>
//                 <View>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '100%',
//                       justifyContent: 'space-around',
//                       marginBottom: 1,
//                     }}>
//                     <Text style={modalStyle.powerHeading}>updatedDate</Text>
//                     <Text style={modalStyle.powerData}>{updatedDate}</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//             <View style={modalStyle.btnClose}>
//               <Button title="close" onPress={() => setOnGoingReport(false)} />
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal transparent={true} visible={rechargeHistory} animationType="slide">
//         <View style={modalStyle.centeredView}>
//           <View style={modalStyle.modalView}>
//             <Text style={modalStyle.modalText}>Recharge History</Text>

//             <View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-around',
//                   marginBottom: 20,
//                 }}>
//                 <View style={{flexDirection: 'row'}}>
//                   <TouchableOpacity onPress={() => setfromOpen(true)}>
//                     <View
//                       style={{
//                         height: 50,
//                         width: 50,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         backgroundColor: Color.colorNative,
//                         borderTopLeftRadius: 10,
//                         borderBottomLeftRadius: 10,
//                       }}>
//                       <Image
//                         style={modalStyle.calendarImg}
//                         source={require('../../assets/Icons/calendar.png')}
//                       />
//                     </View>
//                   </TouchableOpacity>
//                   <TextInput
//                     editable={false}
//                     value={fromdate.toDateString()}
//                     style={{
//                       borderWidth: 1,
//                       borderColor: Color.colorNative,
//                       backgroundColor: Color.colorWhitesmoke,
//                       borderBottomRightRadius: 10,
//                       borderTopRightRadius: 10,
//                       borderTopLeftRadius: 0,
//                       overflow: 'hidden',
//                       height: 40,
//                       width: 140,
//                     }}
//                   />
//                   <DatePicker
//                     modal
//                     open={fromOpen}
//                     date={fromdate}
//                     onConfirm={date => {
//                       setfromOpen(false);
//                       setfromDate(date);
//                     }}
//                     onCancel={() => {
//                       setfromOpen(false);
//                     }}
//                   />
//                 </View>

//                 <View style={{flexDirection: 'row'}}>
//                   <TouchableOpacity onPress={() => settoOpen(true)}>
//                     <View
//                       style={{
//                         height: 50,
//                         width: 50,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         backgroundColor: Color.colorNative,
//                         borderTopLeftRadius: 10,
//                         borderBottomLeftRadius: 10,
//                       }}>
//                       <Image
//                         style={modalStyle.calendarImg}
//                         source={require('../../assets/Icons/calendar.png')}
//                       />
//                     </View>
//                   </TouchableOpacity>
//                   <TextInput
//                     editable={false}
//                     value={todate.toDateString()}
//                     style={{
//                       borderWidth: 1,
//                       borderColor: Color.colorNative,
//                       backgroundColor: Color.colorWhitesmoke,
//                       borderBottomRightRadius: 10,
//                       borderTopRightRadius: 10,
//                       borderTopLeftRadius: 0,
//                       overflow: 'hidden',
//                       height: 40,
//                       width: 140,
//                     }}
//                   />
//                   <DatePicker
//                     modal
//                     open={toOpen}
//                     date={todate}
//                     onConfirm={date => {
//                       settoOpen(false);
//                       setToDate(date);
//                     }}
//                     onCancel={() => {
//                       settoOpen(false);
//                     }}
//                   />
//                 </View>
//               </View>
//               <Button
//                 color="green"
//                 title="Get Recharge History"
//                 onPress={() => getRechargeHistory()}
//               />
//             </View>

//             <View style={{display: showList ? 'flex' : 'none'}}>
//               <View style={modalStyle.rechargeContainer}>
//                 <FlatList
//                   data={rechargeData}
//                   renderItem={({item}) => (
//                     <View style={modalStyle.listCard}>
//                       <View style={{justifyContent: 'center', paddingLeft: 10}}>
//                         <Image
//                           style={modalStyle.calendarImg}
//                           source={require('../../assets/Icons/right-arrow.png')}
//                         />
//                       </View>
//                       <View style={{justifyContent: 'center'}}>
//                         <Text
//                           style={{
//                             fontSize: 15,
//                             fontWeight: 'bold',
//                             color: 'black',
//                             marginLeft: 20,
//                             marginBottom: 5,
//                           }}>
//                           {item.transactionID.toString()}
//                         </Text>
//                         <Text
//                           style={{
//                             fontSize: 12,
//                             fontWeight: 'bold',
//                             color: 'black',
//                             marginLeft: 20,
//                           }}>
//                           {item.rechargeDate.toString()}
//                         </Text>
//                       </View>
//                       <View style={{justifyContent: 'center', marginLeft: 30}}>
//                         <Text style={{color: 'green', fontWeight: 'bold'}}>
//                           ₹{item.amount.toString()}
//                         </Text>
//                         <Text style={{color: 'green'}}>
//                           {item.status.toString()}
//                         </Text>
//                       </View>
//                     </View>
//                   )}
//                   keyExtractor={item => item.transactionID}
//                 />

//                 <TouchableOpacity>
//                   <Image
//                     style={modalStyle.fileIcon}
//                     source={require('../../assets/Icons/file.png')}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={modalStyle.btnClose}>
//               <Button
//                 title="close"
//                 onPress={() => {
//                   setRechargeHistory(false);
//                   setShowList(false);
//                 }}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const Styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 10,
//   },
//   listText: {
//     width: 110,
//     height: 110,
//     fontSize: 24,
//     padding: 20,
//     color: 'white',
//     backgroundColor: 'skyblue',
//     borderColor: 'black',
//     borderWidth: 2,
//     margin: 10,
//     textAlign: 'center',
//     textAlignVertical: 'center',
//   },
//   functionBox: {
//     height: 120,
//     width: 120,
//     margin: 5,
//     borderRadius: 20,
//     shadowColor: 'blue',
//     elevation: 10,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#0f4ebb',
//   },
//   icon: {
//     height: 70,
//     width: 70,
//   },
//   logout: {
//     height: 80,
//     width: 80,
//     shadowColor: 'yellow',
//     elevation: 10,
//   },
//   userCard: {
//     height: 300,
//     width: '95%',
//     backgroundColor: '#0f4ebb',
//     shadowColor: '#0f4ebb',
//     elevation: 10,
//     position: 'absolute',
//     bottom: 30,
//     borderRadius: 10,
//     padding: 20,
//   },
//   textStyle: {
//     color: 'white',
//     textShadowColor: 'white',
//     elevation: 5,
//   },
//   cardText: {
//     color: 'white',
//     fontSize: 25,
//     marginBottom: 10,
//   },
// });

// const modalStyle = StyleSheet.create({
//   main: {
//     flex: 1,
//   },
//   Heading: {
//     width: '100%',
//     backgroundColor: Color.colorNative,
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 22,
//     fontWeight: 'bold',
//     padding: 15,
//     borderTopLeftRadius: 5,
//     borderTopRightRadius: 5,
//   },
//   subHeading: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 20,
//     margin: 4,
//   },
//   subData: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   buttonView: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: 'rgba(34 ,34 ,34 ,0.4)',
//   },
//   modalView: {
//     width: '100%',
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 15,
//     shadowColor: 'black',
//     elevation: 10,
//   },
//   modalText: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderRadius: 5,
//     width: 300,
//     marginBottom: 20,
//   },
//   abortBtn: {
//     borderRadius: 5,
//     backgroundColor: '#fd6c6c',
//     height: 50,
//     width: 130,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: 'red',
//     elevation: 10,
//     overflow: 'hidden',
//   },
//   rechargeBtn: {
//     borderRadius: 5,
//     backgroundColor: '#6ecf7b',
//     height: 50,
//     width: 130,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: 'green',
//     elevation: 10,
//   },
//   voltageContainer: {
//     backgroundColor: 'lightgreen',
//     width: '33.3%',
//     alignItems: 'center',
//   },
//   powerContainer: {
//     backgroundColor: 'lightgreen',
//     width: '50%',
//     alignItems: 'center',
//   },
//   powerHeading: {
//     paddingLeft: '10%',
//     padding: 10,
//     textAlign: 'left',
//     backgroundColor: '#61b5ef',
//     width: '50%',
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   powerData: {
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: 'bold',
//     padding: 10,
//     backgroundColor: '#e3e3e3',
//     width: '50%',
//   },
//   btnClose: {
//     width: '30%',
//     marginTop: 30,
//     alignSelf: 'flex-end',
//     shadowColor: 'blue',
//     elevation: 5,
//     marginBottom: 30,
//   },
//   calendarImg: {
//     height: 40,
//     width: 40,
//   },
//   rechargeContainer: {
//     marginTop: 20,
//     borderRadius: 10,
//     height: 400,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: Color.colorNative,
//     padding: 5,
//   },
//   listText: {
//     fontSize: 24,
//     padding: 10,
//     color: 'white',
//     backgroundColor: 'skyblue',
//     borderColor: 'black',
//     borderWidth: 2,
//     margin: 10,
//     textAlign: 'center',
//   },
//   listCard: {
//     width: '97%',
//     marginBottom: 10,
//     height: 70,
//     backgroundColor: '#eae9ff',
//     shadowColor: 'black',
//     elevation: 5,
//     alignSelf: 'center',
//     borderRadius: 10,
//     overflow: 'hidden',
//     flexDirection: 'row',
//   },
//   downloadBtn: {
//     height: 40,
//     width: 150,
//     backgroundColor: Color.colorNative,
//     shadowColor: 'black',
//     elevation: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   fileIcon: {
//     height: 70,
//     width: 70,
//     position: 'absolute',
//     bottom: -30,
//     right: 0,
//     shadowColor: 'black',
//     elevation: 5,
//   },
// });

// export default Statistics;
