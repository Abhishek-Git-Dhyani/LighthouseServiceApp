
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

const ReportScreen = () => {
    
    const [token, setToken] = React.useState('');
    const [weekStack, setWeekStack] = useState([]);
    const [dayStack, setDayStack] = useState([]);
    const [monthStack, setMonthStack] = useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const tokenDetail = await AsyncStorage.getItem('user_Token');
            const data = await JSON.parse(tokenDetail);
            if (data?.token) {
            setToken(data.token);
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        if(token.length > 0)
        {
            getDailyData();
            getWeeklyData();
            getMonthlyData();
        }
    },[token])

    const getCurrentData = async () => {

    }

    const getDailyData = async () => {

        console.log('ye token ha '+ token);

        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/GetDailyData';

        let response = await fetch(url, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });

        let result = await response.json();

        console.log(result);

        const inputData = result.data;

        if(result.message != 'Data Not Exists')
        {
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

            console.log(transformedData);

            setDayStack(transformedData);
        }
    }

    const getWeeklyData = async () => {
        const currentDate = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;

        console.log(currentDate);

        const url = `https://api.lighthouseiot.in/api/v1.0/Consumer/GetDateWiseData?date=${currentDate}`;

        let response = await fetch(url, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });

        let result = await response.json();

        if(result.message != 'Data Not Exists')
        {
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
            console.log("Transformed weekstack Stack:", JSON.stringify(transformedData));
        }
    }

    const getMonthlyData = async () => {
        const url = 'https://api.lighthouseiot.in/api/v1.0/Consumer/GetMonthWiseData?Year=2025';

        let response = await fetch(url, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });

        let result = await response.json();

        const inputData = result.data;

        if(result.message != 'Data Not Exists')
        {
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
            console.log("Transformed Month Stack:", JSON.stringify(transformedData));
        }
        
    }

    const DG_COLOR = 'orange';
    const GRID_COLOR = '#4ABFF4';

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

    return (
        <ScrollView style={{flex:1, padding: 5}}>
            <View style={styles.graphContainer}>
                <View style={styles.listHeader}>
                    <Image style={styles.headerIcon} source={require('../../assets/Icons/linegraph.png')}/>
                    <Text style={styles.headerText}>Current Data</Text>
                </View>
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

            <View style={styles.graphContainer}>
                <View style={styles.listHeader}>
                    <Image style={styles.headerIcon} source={require('../../assets/Icons/daily.png')}/>
                    <Text style={styles.headerText}>Daily Data</Text>
                </View>
                {dayStack.length > 0 ? (
                    <View style={styles.graph}>
                    <BarChart
                        noOfSections={5}
                        stackData={dayStack}
                        barBorderTopLeftRadius={10}
                        barBorderTopRightRadius={10}
                        showGradient
                        gradientColor={'#93d4ff'}
                        isAnimated
                        autoCenterTooltip
                        renderTooltip={(item, index) => {
                            return (
                                <View style={{
                                    marginBottom: 20,
                                    marginLeft: -6,
                                    backgroundColor: '#6a6a6aff',
                                    paddingHorizontal: 6,
                                    paddingVertical: 4,
                                    borderRadius: 4,
                                }}>
                                    <Text style={{color: 'white'}}>ssd</Text>
                                </View>
                            );
                        }}
                    />
                    </View>
                ) : (
                    <Text style={{ color: 'gray', marginTop: 10 }}>No data available.</Text>
                )}
            </View>

            <View style={styles.graphContainer}>
                <View style={styles.listHeader}>
                    <Image style={styles.headerIcon} source={require('../../assets/Icons/energyIcon.png')}/>
                    <Text style={styles.headerText}>Weekly Data</Text>
                </View>
                {weekStack.length > 0 ? (
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
                ) : (
                    <Text style={{ color: 'gray', marginTop: 10 }}>No data available.</Text>
                )}
                
            </View>

            <View style={styles.graphContainer}>
                <View style={styles.listHeader}>
                    <Image style={styles.headerIcon} source={require('../../assets/Icons/monthlyicon.png')}/>
                    <Text style={styles.headerText}>Monthly Data</Text>
                </View>
                {
                    monthStack.length > 0 ? (
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
                    ) : (
                        <Text style={{ color: 'gray', marginTop: 10 }}>No data available.</Text>
                    )
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  graphContainer:{
    height: 'auto',
    margin : 5,
    backgroundColor: 'white',
    overflow: 'hidden',
    // padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 15,
    borderRadius : 15,
  },
  graph:{
    overflow: 'hidden',
    marginHorizontal:20,
    marginVertical:10,
  },
    headerText: {
    color: 'white',
    textAlign: 'left',
    fontFamily: 'Poppins-Light',
    fontSize: 15,
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
      headerIcon :{
   height :20,
   width :20,
  },
});

export default ReportScreen;