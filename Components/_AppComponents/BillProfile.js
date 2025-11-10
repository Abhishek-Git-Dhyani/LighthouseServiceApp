import { Text, View, TouchableOpacity, StyleSheet, Button,Modal, TextInput, Image, FlatList, ScrollView, Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import DatePicker from 'react-native-date-picker'
import { Color, ColorBlueTheme } from '../../GlobalStyles';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const BillProfile = () => {

    const [token, setToken] = React.useState('');
    const [fromdate, setfromDate] = React.useState(new Date());
    const [todate, setToDate] = React.useState(new Date());
    const [fromOpen, setfromOpen] = React.useState(false);
    const [toOpen, settoOpen] = React.useState(false);
    const [billModal, setBillModal] = React.useState(false);
    const [consumerBills, setConsumerBills] = React.useState(null);
    const [billReport, setBillReport] = React.useState(false);
    const [bill,setBill] = React.useState('');

    const [deviceID,setDeviceID] = React.useState();

    React.useEffect(() => {
        const fetchData = async () => {
            const tokenDetail = await AsyncStorage.getItem('user_Token');
            console.log('Here is thge token Details')
            console.log(tokenDetail);

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
            getStatics();
        }
    },[token])

    React.useEffect(() => {
      if (deviceID && token.length > 0) {
        getConsumerBills();
      }
    }, [deviceID, token]);

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

    console.log(response.data);

    // setUpdatedOn(response.data.updatedOn);
    // setUnitNumber(response.data.unitNumber);
    // setRechargeOn(response.data.rechargeOn);
    // setConsumerNo(response.data.consumerNo);
    // setGridReading(response.data.gridReading);
    // setDgReading(response.data.dgReading);
    // setTodayConsumption(response.data.todayConsumption);
    setDeviceID(response.data.deviceID);
    // setCurrentMonthConsumption(response.data.currentMonthConsumption);
    // setMeterSerialNumber(response.data.meterSerialNumber);


  }

    const getConsumerBills = async () => {

        setBillModal(false);

        setConsumerBills();

        const url = `https://api.lighthouseiot.in/api/v1.0/MeterBill/getCustomerbillById?ConsumerID=${deviceID}`;

        let response = await fetch(url, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });

        let result = await response.json();

        console.log(result.data);

        setConsumerBills(result.data);

        // const inputData = result.data;
    };

    const GenerateDynamicBill = async () => {
        const FromDate = moment(fromdate).format('MM-DD-YYYY');
        const ToDate = moment(todate).format('MM-DD-YYYY');

        const url = `https://api.lighthouseiot.in/api/v1.0/MeterBill/GetDynamicBill?FromDate=${FromDate}&ToDate=${ToDate}&ConsumerID=${deviceID}`;

        let response = await fetch(url, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });

        let result = await response.json();

        console.log('this is the result '+result);

        const inputData = result.data;

        getConsumerBills();
    };

    const showBillReport = async (item) => {
        setBillReport(true);
        setBill(item);
        console.log(item);
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

    // const createPDF = async (bill, userName) => {
    //   try {
    //     requestStoragePermission();

    //     const billFields = [
    //       ['Bill Id.', bill.billID, 'Consumer Id.', bill.consumerID],
    //       ['Bill From', bill.fromDate, 'Bill To', bill.toDate],
    //       ['Amount', bill.usedAmount, 'Last Used Amount', bill.lastUsedAmount],
    //       ['Current DG', bill.currentReadingDG, 'Past DG', bill.pastReadingDG],
    //       ['Consum DG', bill.consumptionDG, 'Open Amt.', `${bill.openingAmount}/.`],
    //       ['Closing Amt.', `${bill.closingAmount}/.`, 'Recharge Amt.', `${bill.rechargeAmount}/.`],
    //       ['Other Charges', `${bill.otherCharges}/.`, 'Area Size', bill.areaSize],
    //       ['Club Charges', bill.clubCharges, 'MMC Grid', bill.mmcGrid],
    //       ['Cam', bill.cam, 'MMC DG', bill.mmcdg],
    //       ['Fixed DG', bill.fixedDG, 'Fixed Grid', bill.fixedGrid],
    //       ['CS Charges', bill.csCharges, 'Vending Charges', bill.vendingCharges],
    //       ['GST', bill.gstCharges, 'Actual Charge', bill.totalActualCharges],
    //       ['Bill No.', bill.billNo, 'Load Type', bill.loadType],
    //       ['DG', bill.dg, 'Mains', bill.mains],
    //       ['Bill Created', bill.billCreated, 'Current Reading', bill.currentReading],
    //       ['Past Reading', bill.pastReading, 'Consumption', bill.consumption],
    //       ['EB Tariff Rate', bill.ebTariffRate, 'DG Tariff Rate', bill.dgTariffRate],
    //       ['EB Total Charges', bill.ebTotalCharges, 'DG Total Charges', bill.dgTotalCharges],
    //       ['Total Electricity Bill', bill.totalElectricityBill, '', ''],
    //     ];
  
    //     let PDFOptions = {
    //       html: `
    //       <body style="padding:20px; display:flex; flex-direction:column; align-items:center; height:100vh; text-align:center;">
    //         <h2 style="color: ${(ColorBlueTheme.Blue8)}; font-weight: light; text-decoration: underline;">LightHouseIoT Solutions Pvt. Ltd.</h2>
    //         <h3 style="color: ${(ColorBlueTheme.Blue6)};">Bill Report</h3>
    //         <hr>
  
    //         <table border="1" cellspacing="0" cellpadding="5">
    //           <tr style="background-color: ${Color.colorNative}; color: white;">
    //             <th>Recharge Date</th>
    //             <th>Transaction ID</th>
    //             <th>Amount</th>
    //             <th>Status</th>
    //           </tr>
    //           ${generateHTMLRows(billFields)}
    //         </table>
  
    //         <footer style="width: 100%; text-align: center;">
    //           <p style="color: black; font-weight: light; text-decoration: underline; position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; padding: 10px 0;">&#169; 2024 LightHouseIoT, All Right Reserved</p>
    //         </footer>
            
    //     </body>`,
    //       fileName: `LHT_Recharge_${bill.billID}`,
    //       directory: Platform.OS === 'android' ? 'Download' : 'Documents',
    //       base64: true
    //     };
    //     let file = await RNHTMLtoPDF.convert(PDFOptions);
  
    //     let filePath = RNFetchBlob.fs.dirs.DownloadDir + `/LHT_Bill${bill.billID}.pdf`;
  
    //     // console.log(RNFetchBlob.fs.dirs.DownloadDir);
  
    //     RNFetchBlob.fs.writeFile(filePath, file.base64, 'base64').then(
    //       response => {
    //         console.log('Success log', response);
    //       }
    //     ).catch(errors => console.log('Error Log', errors))
  
    //     // console.log(file.filePath);
    //     setFilePath(file.filePath);
    //     Alert.alert("Bill Report Downloaded Successfully", "Open it from Download folder", setBillReport(false));
    //   } catch (error) {
    //     console.log('Failed to generate pdf', error.message);
    //     Alert.alert('Failed to generate pdf', error.message, setBillReport(false));
    //   }
    // };

const createPDF = async (bill, userName) => {
  try {
    await requestStoragePermission(); 

    const billFields = [
      ['Bill Id.', bill.billID, 'Consumer Id.', bill.consumerID],
      ['Bill From', bill.fromDate, 'Bill To', bill.toDate],
      ['Amount', bill.usedAmount, 'Last Used Amount', bill.lastUsedAmount],
      ['Current DG', bill.currentReadingDG, 'Past DG', bill.pastReadingDG],
      ['Consum DG', bill.consumptionDG, 'Open Amt.', `${bill.openingAmount}/.`],
      ['Closing Amt.', `${bill.closingAmount}/.`, 'Recharge Amt.', `${bill.rechargeAmount}/.`],
      ['Other Charges', `${bill.otherCharges}/.`, 'Area Size', bill.areaSize],
      ['Club Charges', bill.clubCharges, 'MMC Grid', bill.mmcGrid],
      ['Cam', bill.cam, 'MMC DG', bill.mmcdg],
      ['Fixed DG', bill.fixedDG, 'Fixed Grid', bill.fixedGrid],
      ['CS Charges', bill.csCharges, 'Vending Charges', bill.vendingCharges],
      ['GST', bill.gstCharges, 'Actual Charge', bill.totalActualCharges],
      ['Bill No.', bill.billNo, 'Load Type', bill.loadType],
      ['DG', bill.dg, 'Mains', bill.mains],
      ['Bill Created', bill.billCreated, 'Current Reading', bill.currentReading],
      ['Past Reading', bill.pastReading, 'Consumption', bill.consumption],
      ['EB Tariff Rate', bill.ebTariffRate, 'DG Tariff Rate', bill.dgTariffRate],
      ['EB Total Charges', bill.ebTotalCharges, 'DG Total Charges', bill.dgTotalCharges],
      ['Total Electricity Bill', bill.totalElectricityBill, '', ''],
    ];

    let PDFOptions = {
      html: `
      <body style="padding:20px; display:flex; flex-direction:column; align-items:center; height:100vh; text-align:center;">
        <h2 style="color: ${(ColorBlueTheme.Blue8)}; font-weight: light; text-decoration: underline;">LightHouseIoT Solutions Pvt. Ltd.</h2>
        <h3 style="color: ${(ColorBlueTheme.Blue6)};">Bill Report</h3>
        <hr>

        <table border="1" cellspacing="0" cellpadding="5">
          <tr style="background-color: ${Color.colorNative}; color: white;">
            <th>Recharge Date</th>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
          ${generateHTMLRows(billFields)}
        </table>

        <footer style="width: 100%; text-align: center;">
          <p style="color: black; font-weight: light; text-decoration: underline; position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; padding: 10px 0;">&#169; 2024 LightHouseIoT, All Right Reserved</p>
        </footer>
      </body>`,
      fileName: `LHT_Recharge_${bill.billID}`,
      directory: Platform.OS === 'android' ? 'Download' : 'Documents',
      base64: true,
    };

    let file = await RNHTMLtoPDF.convert(PDFOptions);

    let filePath = RNFetchBlob.fs.dirs.DownloadDir + `/LHT_Bill${bill.billID}.pdf`;

    await RNFetchBlob.fs.writeFile(filePath, file.base64, 'base64');
    console.log('PDF saved at:', filePath);

    Alert.alert("Bill Report Downloaded Successfully", "Open it from Download folder", setBillReport(false));
  } catch (error) {
    console.log('Failed to generate pdf', error.message);
    Alert.alert('Failed to generate pdf', error.message, setBillReport(false));
  }
};


    const generateHTMLRows = (fields) => {
        return fields
            .map(
            ([label1, value1, label2, value2]) => `
          <tr>
            <td style="padding:6px;"><strong>${label1}</strong></td>
            <td style="padding:6px;">${value1 ?? ''}</td>
            <td style="padding:6px;"><strong>${label2}</strong></td>
            <td style="padding:6px;">${value2 ?? ''}</td>
          </tr>`
        )
        .join('');
    };

    return(
        <View style={{flex: 1, alignItems:'center', padding: 10}}>

            <View style={styles.listContainer}>
            <View style={styles.listHeader}>
                <Image
                style={styles.recentIcon}
                source={require('../../assets/Icons/recenticon.png')}
                />
                <Text style={styles.headerText}>Billing History</Text>
            </View>
            <FlatList
                data={consumerBills}
                keyExtractor={item => item.billID}
                contentContainerStyle={{padding: 10}}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() =>  showBillReport(item)}
                        style={[
                            styles.dataCard,
                            {
                            backgroundColor:'rgb(235, 235, 235)',
                            shadowColor:'black'
                            },
                        ]}>
                        <View style={styles.resultContainer}>
                            <Image
                                style={{height: '80%', width: '80%'}}
                                source={require('../../assets/Icons/payment.png')}
                            />
                            </View>
                        <View style={styles.idContainer}>
                            <Text style={styles.textStyle}>Bill Id : {item.billNo}</Text>
                            <Text style={{fontFamily: 'Poppins-Light', fontSize: 12,color: 'black'}}>
                             Bill Date : {item.fromDate}
                            </Text>
                        </View>
                        <View style={styles.amountContainer}>
                            <Text style={[styles.textStyle, {color: Color.colorNative}]}>
                             ₹{item.usedAmount}
                            </Text>
                            <Text
                            style={{
                                fontSize: 12,
                                fontFamily: 'Poppins-Regular',
                                color: 'black'
                            }}>
                            {item.consumption}KWH
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            </View>


            <TouchableOpacity style={styles.createBtn} onPress={()=> setBillModal(true)}>
                <Text style={{color:'white'}}>Generate Bill</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={billModal}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    
                        <View style={{flexDirection:'row', width: '100%', justifyContent:'space-between', marginBottom: 20}}>

                            <View>
                                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setfromOpen(true)}>
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
                                            style={{height: 30, width :30}}
                                            source={require('../../assets/Icons/calendar.png')}
                                        />
                                    </View>
                                    <TextInput
                                        editable={false}
                                        value={fromdate.toDateString()}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Color .colorNative,
                                            backgroundColor: Color.colorWhitesmoke,
                                            borderBottomRightRadius: 10,
                                            borderTopRightRadius: 10,
                                            borderTopLeftRadius: 0,
                                            overflow: 'hidden',
                                            height: 40,
                                            width: 100,
                                        }}
                                    />
                                </TouchableOpacity>
                                <DatePicker
                                    modal
                                    mode='date'
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

                            <View>
                                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => settoOpen(true)}>
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
                                        style={{height : 30, width: 30}}
                                            source={require('../../assets/Icons/calendar.png')}
                                        />
                                    </View>
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
                                            width: 100,
                                            paddingLeft: 5,
                                        }}
                                    />
                                </TouchableOpacity>
                                <DatePicker
                                    modal
                                    mode='date'
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

                        <View style ={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
                            <TouchableOpacity style={styles.abortBtn} onPress={() => setBillModal(false)}>
                                <Text style={{color: 'white', fontWeight: '900'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.billBtn} onPress={() => GenerateDynamicBill()} >
                                <Text style={{color: 'white', fontWeight: '900'}}>Generate Bill</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={billReport}
                onRequestClose={() => {
                    setBillReport(!billReport);
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView,{padding: 10}]}>

                        <View style={[styles.listHeader,{margin: 0, width: '100%'}]}>
                            <Image
                            style={styles.recentIcon}
                            source={require('../../assets/Icons/recenticon.png')}
                            />
                            <Text style={styles.headerText}>Billing Report</Text>
                        </View>

                        <ScrollView style={[styles.listContainer, {shadowOpacity: 0, elevation: 0, marginTop: 2, marginBottom: 20, height: '70%'}]}>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Bill Id.</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.billID}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Consumer Id.</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.consumerID}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Bill From</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.fromDate}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Bill To</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.toDate}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Amount</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.usedAmount}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>last Used Amount</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.lastUsedAmount}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Current DG</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.currentReadingDG}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Past DG</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.pastReadingDG}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Consum DG</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.consumptionDG}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Open Amt.</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.openingAmount}/.</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Closing Amt.</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.closingAmount}/.</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Recharge Amt.</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.rechargeAmount}/.</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Other Charges</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.otherCharges}/.</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Area Size</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.areaSize}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Club Charges</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.clubCharges}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>MMC Grid</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.mmcGrid}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Cam</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.cam}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>MMC DG</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.mmcdg}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Fixed DG</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.fixedDG}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Fixed Grid</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.fixedGrid}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>CS Charges</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.csCharges}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Vending Charges</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.vendingCharges}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>GST</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.gstCharges}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Actual Charge</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.totalActualCharges}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Bill No.</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.billNo}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Load Type</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.loadType}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>DG</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.dg}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Mains</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.mains}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Bill Created</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.billCreated}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Current Reading</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.currentReading}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Past Reading</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.pastReading}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Consumption</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.consumption}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>EB Tariff Rate</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.ebTariffRate}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>DG Tariff Rate</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.dgTariffRate}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>EB Total Charges</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.ebTotalCharges}</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>DG Total Charges</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.dgTotalCharges}</Text></View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}><Text style={styles.columnTextheader}>Total Electricity Bill</Text></View>
                                <View style={styles.columnContainer}><Text style={styles.columnText}>{bill.totalElectricityBill}</Text></View>

                            </View>
                     
                        </ScrollView>

                        <View style ={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
                            <TouchableOpacity style={styles.abortBtn} onPress={() => setBillReport(false)}>
                                <Text style={{color: 'white', fontWeight: '900'}}>Cancel</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={[styles.billBtn,{backgroundColor: ColorBlueTheme.Blue10}]} onPress={() => createPDF(bill)} >
                                <Text style={{color: 'white', fontWeight: '900'}}>Download Bill</Text>
                            </TouchableOpacity> */}

                               <TouchableOpacity
                                    style={[styles.billBtn, { backgroundColor: ColorBlueTheme.Blue10 }]}
                                           onPress={() => {createPDF(bill, 'Dr.Vinay');  }}>
                                     <Text style={{ color: 'white', fontWeight: '900' }}>Download Bill</Text>
                                          </TouchableOpacity>

                        </View>
                        
                    </View>
                </View>
            </Modal>

        </View>

        
    );
}

export default BillProfile;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    width: '95%',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  billBtn: {
    borderRadius: 5,
    backgroundColor: '#6ecf7b',
    height: 50,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'green',
    elevation: 10,
  },
  createBtn:{
    borderRadius: 5,
    backgroundColor:  ColorBlueTheme.Blue10,
    height: 40,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ColorBlueTheme.Blue10,
    elevation: 2,
    margin: 20
  },
  listContainer: {
      width: '100%',
      height: '85%',
      borderRadius: 10,
      borderColor: ColorBlueTheme.Blue15,
      backgroundColor: 'white',
      shadowOpacity: 1,
      shadowOffset: 10,
      shadowColor: 'black',
      elevation: 10,
      marginTop: 20
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
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgb(235, 235, 235)',
  },
  idContainer: {
    height: '100%',
    width: '55%',
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
    fontSize: 11,
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
  rowContainer: {
    flexDirection: 'row',
    border: 2,
    borderWidth: 1,
    borderColor: 'grey',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  columnContainer: {
    flex: 1,
    borderWidth: 0.3, 
    borderColor: 'grey',
    justifyContent: 'center',
    paddingLeft: 5
  },
  columnText:{
    fontSize: 12,
    color: ColorBlueTheme.Blue8
  },
  columnTextheader: {
    fontSize: 13,
    fontWeight:'bold',
    color: ColorBlueTheme.Blue15
  }
});
