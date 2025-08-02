import React, { useState } from 'react';
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
  ScrollView,
  Pressable,
  useEffect
} from 'react-native';
import { BarChart, LineChart } from "react-native-gifted-charts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hide } from 'react-native-bootsplash';
import {Color, ColorBlueTheme, FontFamily, FontSize} from '../../GlobalStyles';
import DatePicker from 'react-native-date-picker';
//import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';




const ReportScreenOld = () => {

  const lineData = [
      {value: 0, dataPointText: '0'},
      {value: 10, dataPointText: '10'},
      {value: 8, dataPointText: '8'},
      {value: 58, dataPointText: '58'},
      {value: 56, dataPointText: '56'},
      {value: 78, dataPointText: '78'},
      {value: 74, dataPointText: '74'},
      {value: 98, dataPointText: '98'},
    ];
  
    const lineData2 = [
      {value: 0, dataPointText: '0'},
      {value: 20, dataPointText: '20'},
      {value: 18, dataPointText: '18'},
      {value: 40, dataPointText: '40'},
      {value: 36, dataPointText: '36'},
      {value: 60, dataPointText: '60'},
      {value: 54, dataPointText: '54'},
      {value: 85, dataPointText: '85'},
    ];

    const barData = [
        {value: 250, label: 'M'},
        {value: 500, label: 'T', frontColor: '#177AD5'},
        {value: 745, label: 'W', frontColor: '#177AD5'},
        {value: 320, label: 'T'},
        {value: 600, label: 'F', frontColor: '#177AD5'},
        {value: 256, label: 'S'},
        {value: 300, label: 'S'},
    ];

  const [fromdate, setfromDate] = React.useState(new Date());
  const [todate, setToDate] = React.useState(new Date());
  const [fromOpen, setfromOpen] = React.useState(false);
  const [toOpen, settoOpen] = React.useState(false);

  const [visibleModal, setVisibleModal] = useState(null); 

  const [monthlyData, setMonthlyData] = useState([]);

  const closeModal = () => setVisibleModal(null);
  const [token, setToken] = React.useState('');

  const [stack, setStack] = React.useState([]);

    React.useEffect(() => {
      getToken();
    }, []);

   const getToken = async () => {
    let tokenDetail = await AsyncStorage.getItem('user_Token');
    data = await JSON.parse(tokenDetail);

    console.log(data);
    // setUserName(data.fullName);
    // setMeterNumber(data.userName);
    setToken(data.token);
  };

  const DG_COLOR = 'orange';
  const GRID_COLOR = '#4ABFF4';
  const [monthStack, setMonthStack] = useState([]);

  const fetchCurrentData = async () => {
    setVisibleModal('current');
  }

  const fetchMonthlyData = async () => {
  const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/GetMonthWiseData?Year=2025';

  let response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    let result = await response.json();
    setMonthlyData(result.data);

    const inputData = result.data;

    const transformedData = inputData.map(item => {
      const stacks = [];

      if (item.dgValue > 0) {
        stacks.push({ value: item.dgValue, color: DG_COLOR });
      }

      if (item.gridValue > 0) {
        stacks.push({ value: item.gridValue, color: GRID_COLOR, marginBottom: 2 });
      }

      return {
        label: item.lable, // or item.label if typo fixed in API
        stacks
      };
    });

    setMonthStack(transformedData);
    console.log("Transformed Month Stack:", JSON.stringify(monthStack));

    setVisibleModal('monthly');
  };

//weekly data code .....

  const [weekStack, setWeekStack] = useState([]);

  const fetchWeeklyData =  async () => {
    
    const currentDate = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;

    const url = `https://api.lighthouseiot.in/api/v1.0/Consumer/GetDateWiseData?date=${currentDate}`;

    let response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    let result = await response.json();
    setWeekStack(result.data);

    const inputData = result.data;

    const transformedData = inputData.map(item => {
      const stacks = [];

      if (item.dgValue > 0) {
        stacks.push({ value: item.dgValue, color: DG_COLOR });
      }

      if (item.gridValue > 0) {
        stacks.push({ value: item.gridValue, color: GRID_COLOR, marginBottom: 2 });
      }

      return {
        label: item.lable, // or item.label if typo fixed in API
        stacks
      };
    });

    setWeekStack(transformedData);
    console.log("Transformed Month Stack:", JSON.stringify(monthStack));

    setVisibleModal('weekly');
  }

  //Daily Data Report start here.....
   const [dayStack, setDayStack] = useState([]);
   const fetchDailyData = async () => {

    const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/GetDailyData';

    let response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    let result = await response.json();
    setDayStack(result.data);

    const inputData = result.data;

    const transformedData = inputData.map(item => {
      const stacks = [];

      if (item.dgValue > 0) {
        stacks.push({ value: item.dgValue, color: DG_COLOR });
      }

      if (item.gridValue > 0) {
        stacks.push({ value: item.gridValue, color: GRID_COLOR, marginBottom: 2 });
      }

      return {
        label: item.lable, // or item.label if typo fixed in API
        stacks
      };
    });

    setDayStack(transformedData);
  //  console.log("Transformed Month Stack:", JSON.stringify(dayStack));

      console.log("Transformed Day Stack:", JSON.stringify(transformedData));

    setVisibleModal('daily');
  

   }


   const fetchBillReport = async () => {
    setVisibleModal('bill');
   }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Daily Report */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => fetchCurrentData()}
      >
        <Text style={styles.cardText}>Current Report</Text>
      </TouchableOpacity>
      
        {/* Daily Report */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => fetchDailyData()}
      >
        <Text style={styles.cardText}>Daily Report</Text>
      </TouchableOpacity>

      {/* Weekly Report */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => fetchWeeklyData()}
      >
        <Text style={styles.cardText}>Weekly Report</Text>
      </TouchableOpacity>

      {/* Monthly Report */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => fetchMonthlyData()}
      >
        <Text style={styles.cardText}>Monthly Report</Text>
      </TouchableOpacity>

      {/* Monthly Report */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => fetchBillReport()}
      >
        <Text style={styles.cardText}>Bill Report</Text>
      </TouchableOpacity>

     
      <Modal
        visible={visibleModal !== null}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {visibleModal === 'current' && 'Current Report'}
              {visibleModal === 'daily' && 'Daily Report'}
              {visibleModal === 'weekly' && 'Weekly Report'}
              {visibleModal === 'monthly' && 'Monthly Report'}
              {visibleModal === 'comparative' && 'Comparative Report'}
            </Text>

            <View style={[styles.graphContainer,{ display: visibleModal === 'monthly' ? 'flex' : 'none' }]}>
              <View style={styles.graph}>
                <BarChart
                  noOfSections={5}
                  stackData={monthStack}
                  spacing={30}
                  barBorderTopLeftRadius={10}
                  barBorderTopRightRadius={10}
                  showGradient
                  gradientColor={'#93d4ff'}
                  isAnimated
                />
              </View>
            </View>

            <View style={[styles.graphContainer,{ display: visibleModal === 'weekly' ? 'flex' : 'none' }]}>
              <View style={styles.graph}>
                <BarChart
                  noOfSections={5}
                  stackData={weekStack}
                  barBorderTopLeftRadius={10}
                  barBorderTopRightRadius={10}
                  showGradient
                  gradientColor={'#93d4ff'}
                  isAnimated
                />
              </View>
            </View>

            {/* Daily data */}
            <View style={[styles.graphContainer,{ display: visibleModal === 'daily' ? 'flex' : 'none' }]}>
              <View style={styles.graph}>
                  <BarChart
                    noOfSections={5}
                    stackData={dayStack}
                    barBorderTopLeftRadius={10}
                    barBorderTopRightRadius={10}
                    showGradient
                    gradientColor={'#93d4ff'}
                    isAnimated
                  />
              </View>
            </View>

            <View style={[styles.graphContainer,{ display: visibleModal === 'current' ? 'flex' : 'none' }]}>
              <View style={styles.graph}>
                  <LineChart
                    data={lineData}
                    data2={lineData2}
                    focusEnabled={true}
                    focusedDataPointRadius={2}
                    showDataPointLabelOnFocus = {true}
                    showTextOnFocus = {true}
                    showStripOnFocus = {true}
                    focusTogether ={false}
                    stripOverDataPoints = {false}
                    stripHeight = {1000}
                    stripWidth= {1}
                    stripColor ={'grey' }
                    stripStrokeDashArray = {8}
                    delayBeforeUnFocus={5000}
                    curved = {true}
                    isAnimated = {true}
                    animationDuration={1200}
                    showVerticalLines = {false}
                    initialSpacing={0}
                    color1="skyblue"
                    color2="orange"
                    textColor1="green"
                    dataPointsHeight={3}
                    dataPointsWidth={3}
                    dataPointsColor1="blue"
                    dataPointsColor2="red"
                    textShiftY={-5}
                    textShiftX={-5}
                    textFontSize={13}
                    curvature={0.2}
                    areaChart1
                    areaChart2
                    startFillColor1="skyblue"
                    startFillColor2="orange"
                    startOpacity={0.8}
                    endOpacity={0.3}
                />
              </View>
            </View>

            <View
              style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
              },,{ display: visibleModal === 'comparative' ? 'flex' : 'none' }]}>
              <View style={{flexDirection: 'row',margin: 1}}>
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
                  }}
                />
                <DatePicker
                  mode='date'
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

              <View style={{flexDirection: 'row',margin: 1}}>
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
                  }}
                />
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

            <View style={[styles.graphContainer,{ display: visibleModal === 'comparative' ? 'flex' : 'none' }]}>
              
            </View>

            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>





    //**new one with icon

// <ScrollView contentContainerStyle={styles.container}>
//     <TouchableOpacity style={styles.card} onPress={fetchDailyData}>
//   <MaterialCommunityIcons name="calendar-today" size={24} color="#000" />
//   <Text style={styles.cardText}>Daily Report</Text>
// </TouchableOpacity>

// <TouchableOpacity
//   style={styles.card}
//   onPress={() => fetchWeeklyData()}
// >
//   <MaterialCommunityIcons name="calendar-week" size={24} color="#000" />
//   <Text style={styles.cardText}>Weekly Report</Text>
// </TouchableOpacity>

// <TouchableOpacity
//   style={styles.card}
//   onPress={() => fetchMonthlyData()}
// >
//   <MaterialCommunityIcons name="calendar-month" size={24} color="#000" />
//   <Text style={styles.cardText}>Monthly Report</Text>
// </TouchableOpacity>

// <TouchableOpacity
//   style={styles.card}
//   onPress={() => setVisibleModal('comparative')}
// >
//   <MaterialCommunityIcons name="chart-bar" size={24} color="#000" />
//   <Text style={styles.cardText}>Comparative Report</Text>
// </TouchableOpacity>


//  <Modal
//         visible={visibleModal !== null}
//         transparent
//         animationType="slide"
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>
//               {visibleModal === 'daily' && 'Daily Report'}
//               {visibleModal === 'weekly' && 'Weekly Report'}
//               {visibleModal === 'monthly' && 'Monthly Report'}
//               {visibleModal === 'comparative' && 'Comparative Report'}
//             </Text>

//             <View style={[styles.graphContainer,{ display: visibleModal === 'monthly' ? 'flex' : 'none' }]}>
//               <View style={styles.graph}>
//                 <BarChart
//                   noOfSections={5}
//                   stackData={monthStack}
//                   barWidth={20}
//                   spacing={30}
//                 />
//               </View>
//             </View>

//             <View style={[styles.graphContainer,{ display: visibleModal === 'weekly' ? 'flex' : 'none' }]}>
//               <View style={styles.graph}>
//                 <BarChart
//                   noOfSections={5}
//                   stackData={weekStack}
//                 />
//               </View>
//             </View>

//             {/* Daily data */}
//             <View style={[styles.graphContainer,{ display: visibleModal === 'daily' ? 'flex' : 'none' }]}>
//               <View style={styles.graph}>
//                 <BarChart
//                   noOfSections={5}
//                   stackData={dayStack}
//                 />
//               </View>
//             </View>
            

//             <Pressable style={styles.closeButton} onPress={closeModal}>
//               <Text style={styles.closeButtonText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal> 

// </ScrollView>


   
     



  );



};

export default ReportScreenOld;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  card: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderBottomEndRadius : 0,
    borderTopEndRadius : 20,
    borderTopStartRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  graphContainer:{
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
    overflow: 'hidden',
    padding: 20,
    margin: 10,
    borderWidth: 0,
    borderColor : 'grey',
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    elevation: 5,
  },
  graph:{
    overflow: 'hidden',
  }
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
    height: 25,
    alignSelf: 'flex-end',
    marginTop: 50,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 10,
    shadowColor: '#970000',
    shadowOpacity: 0.5,
    shadowOffset: 10,
    elevation: 10,
  },
});