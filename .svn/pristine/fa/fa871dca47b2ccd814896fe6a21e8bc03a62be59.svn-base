import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import jwtDecode from 'jwt-decode';
import EasebuzzCheckout from 'react-native-easebuzz-kit';
import CryptoJS from 'crypto-js';

let response;

const initiatePaymentAPI = async () => {
  const urlBody = {
    key: '2PBP7IABZ2',
    txnid: '352832736',
    amount: 100,
    productinfo: 'android',
    firstname: 'Abhishek',
    phone: '9999999999',
    email: 'abhi@gmail.com',
    surl: 'https://testpay.easebuzz.in/payment/fail',
    furl: 'https://testpay.easebuzz.in/payment/fail',
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
  urlBody.hash = generateInitiateHash(urlBody);

  const formBody = Object.keys(urlBody)
    .map(
      key => encodeURIComponent(key) + '=' + encodeURIComponent(urlBody[key]),
    )
    .join('&');

  const url = 'https://testpay.easebuzz.in/payment/initiateLink';

  response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });
  response = await response.json();
  console.log(response);
  callPaymentGateway();
};

const callPaymentGateway = () => {
  console.warn(response.data);
  var options = {
    access_key: response.data,
    pay_mode: 'test',
  };
  EasebuzzCheckout.open(options)
    .then(data => {
      //handle the payment success & failed response here
      console.log('Payment Response:');
      console.log(data);
      console.warn(data);
    })
    .catch(error => {
      //handle sdk failure issue here
      console.log('SDK Error:');
      console.log(error);
      console.warn(error);
    });
};

const Sample = () => {
  return (
    <View style={{padding: 15}}>
      <Button title="Generate Hash" onPress={initiatePaymentAPI} />
      <Text>Hash Value</Text>
    </View>
  );
};

const generateInitiateHash = keyData => {
  let key = '2PBP7IABZ2';
  let salt = 'DAH88E3UWQ';
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

export default Sample;
