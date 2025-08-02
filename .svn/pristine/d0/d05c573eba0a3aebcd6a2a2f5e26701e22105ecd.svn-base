//
//  EasebuzzCheckout.m
//  EasebuzzKit
//
//  Created by Easebuzz Pvt Ltd on 29/07/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "EasebuzzCheckout.h"
#import "EasebuzzEventEmitter.h"
//#import <Easebuzz/Easebuzz-Swift.h>
#import "Easebuzz-Swift.h"

typedef EasebuzzCheckout Easebuzz;

@interface EasebuzzCheckout () <PayWithEasebuzzCallback>

@end


@implementation EasebuzzCheckout

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(open : (NSDictionary *)options) {
    dispatch_sync(dispatch_get_main_queue(), ^{
        Payment *_payment = [[Payment alloc]initWithCustomerData:options];
        BOOL paymentValid = _payment.isValid;
        if (!paymentValid) {
            NSLog(@"Invalid Print");
        }else{
            [PayWithEasebuzz setUpWithPebCallback:self];
            [PayWithEasebuzz invokePaymentOptionsViewWithPaymentObj:_payment isFrom:self];
        }
    });
}


- (void)PEBCallbackWithData:(NSDictionary<NSString *,id> * _Nonnull)data {
    [EasebuzzEventEmitter onPaymentResult:data];
}


@end
