


'use strict';

import { NativeModules, NativeEventEmitter } from 'react-native';

const easebuzzEvents = new NativeEventEmitter(NativeModules.EasebuzzEventEmitter);

const removeSubscriptions = () => {
  easebuzzEvents.removeAllListeners('Easebuzz::PAYMENT_RESULT');
};

class EasebuzzCheckout {
  static open(options, successCallback) {
    return new Promise(function(result) {
      easebuzzEvents.addListener('Easebuzz::PAYMENT_RESULT', (data) => {
        let resultFn = successCallback || result;
        resultFn(data);
        removeSubscriptions();
      });
     
      NativeModules.EasebuzzCheckout.open(options);
    });
  }

}

export default EasebuzzCheckout;