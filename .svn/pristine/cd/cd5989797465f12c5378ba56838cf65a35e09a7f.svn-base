//
//  EasebuzzEventEmitter.m
//  EasebuzzKit
//
//  Created by Easebuzz Pvt Ltd on 29/07/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "EasebuzzEventEmitter.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

NSString *const kPaymentResult = @"PAYMENT_RESULT";

@implementation EasebuzzEventEmitter

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"Easebuzz::PAYMENT_RESULT"
    ];
}

- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(paymentSuccess:)
                                                 name:kPaymentResult
                                               object:nil];
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)paymentSuccess:(NSNotification *)notification {
    [self sendEventWithName:@"Easebuzz::PAYMENT_RESULT"
                       body:notification.userInfo];
}

+ (void)onPaymentResult:(NSDictionary *)response {
    NSDictionary *payload = [NSDictionary dictionaryWithDictionary:response];
    [[NSNotificationCenter defaultCenter] postNotificationName:kPaymentResult
                                                        object:nil
                                                      userInfo:payload];
}

@end
