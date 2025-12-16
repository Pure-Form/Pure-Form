#import <UIKit/UIKit.h>

#import "AppDelegate.h"

static void HandleUncaughtException(NSException *exception) {
  NSLog(@"[Boot] Uncaught exception: %@\nStack:\n%@", exception, [exception callStackSymbols]);
}

int main(int argc, char * argv[]) {
  @autoreleasepool {
    NSSetUncaughtExceptionHandler(&HandleUncaughtException);
    NSLog(@"[Boot] main() starting. AppDelegate class: %@", NSStringFromClass([AppDelegate class]));
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}

