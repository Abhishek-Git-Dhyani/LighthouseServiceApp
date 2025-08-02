package com.easebuzz;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.app.Activity;
import android.content.Intent;

import com.easebuzz.payment.kit.PWECouponsActivity;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ActivityEventListener;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import javax.annotation.Nullable;
import java.util.Iterator;

import datamodels.PWEStaticDataModel;

public class EasebuzzKitModule extends ReactContextBaseJavaModule implements ActivityEventListener{

    private final ReactApplicationContext reactContext;

    public EasebuzzKitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(this);

    }

    @Override
    public String getName() {
        return "EasebuzzCheckout";
    }

    @ReactMethod
    public void open(ReadableMap parameters) {

        JSONObject parametersJSON = EasebuzzUtility.readableMapToJson(parameters);

        Activity currentActivity = getCurrentActivity();
        try {
            Intent intentProceed = new Intent(currentActivity, PWECouponsActivity.class);
            Iterator<?> keys = parametersJSON.keys();
            while(keys.hasNext() ) {
                String value = "";
                String key = (String) keys.next();
                value = parametersJSON.optString(key);
                if (key.equals("amount")){
                    Double amount = new Double(parametersJSON.optString("amount"));
                    intentProceed.putExtra(key,amount);
                }
                else {
                    intentProceed.putExtra(key,value);
                }
            }
            currentActivity.startActivityForResult(intentProceed, PWEStaticDataModel.PWE_REQUEST_CODE);
        } catch (Exception e) {
            String result = "";
            String payment_response = "";
            JSONObject error_object = new JSONObject();
            WritableMap responseMap = Arguments.createMap();

            try {
                error_object.put("error", "Exception");
                error_object.put("error_msg", e.toString());
                responseMap  = EasebuzzUtility.jsonToWritableMap(error_object);
            } catch (JSONException e1) {
            }

            result = "payment_failed";
            setPaymentResult(result, responseMap);
        }
    }



    private void setPaymentResult(String result, WritableMap response) {
        WritableMap params = Arguments.createMap();
        params.putString("result", result);
        params.putMap("payment_response", response);
        sendPaymentResult(getReactApplicationContext(), "Easebuzz::PAYMENT_RESULT", params);


    }

    private void sendPaymentResult(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void onNewIntent(Intent intent) {}

    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        onActivityResult(requestCode, resultCode, data);
    }


    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(data != null ) {
            if (requestCode == PWEStaticDataModel.PWE_REQUEST_CODE) {
                String result = "";
                String payment_response = "";
                WritableMap responseMap = Arguments.createMap();
                JSONObject error_object = new JSONObject();
                if(data != null ) {
                    result = data.getStringExtra("result");
                    payment_response = data.getStringExtra("payment_response");
                    try {
                        JSONObject responseObj = new JSONObject(payment_response);
                        responseMap  = EasebuzzUtility.jsonToWritableMap(responseObj);
                        setPaymentResult(result, responseMap);

                    }catch (Exception e){
                        try {
                            error_object.put("error", payment_response);
                            error_object.put("error_msg", payment_response);
                            responseMap  = EasebuzzUtility.jsonToWritableMap(error_object);
                        } catch (JSONException e1) {
                        }

                        result = "payment_failed";
                        payment_response = "" + payment_response;
                        setPaymentResult(result, responseMap);
                    }

                }else{
                    try {
                        error_object.put("error", "No Response");
                        error_object.put("error_msg", "Could not receive the response from easebuzz");
                        responseMap  = EasebuzzUtility.jsonToWritableMap(error_object);
                    } catch (JSONException e1) {
                    }
                    result = "payment_failed";
                    setPaymentResult(result, responseMap);
                }
            }
        }
    }
}
