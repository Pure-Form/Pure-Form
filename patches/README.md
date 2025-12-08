# iOS Build Patches

Bu klasör iOS build uyarılarını düzeltmek için uygulanan patch'leri içerir.

## Patch'lerin Uygulanması

Patch'ler otomatik olarak uygulanır:

### Node Modules Patches
- **Otomatik Uygulama**: `npm install` veya `yarn install` çalıştırıldığında
- **Mekanizma**: `postinstall` script via `patch-package`
- **Patch Dosyaları**: `patches/` klasöründe

### Pods Patches
- **Otomatik Uygulama**: `pod install` çalıştırıldığında
- **Mekanizma**: `Podfile` içindeki `post_install` hook
- **Script**: `scripts/patch-pods.sh`

## Düzeltilen Uyarılar

### React Native Core (patches/react-native+0.74.5.patch)
- ✅ RCTStatusBarManager.mm - statusBarFrame, UIApplication notifications deprecations
- ✅ RCTEventDispatcher.mm - deprecated implementations
- ✅ RCTDeviceInfo.mm - keyWindow, statusBarOrientation deprecations
- ✅ RCTPerfMonitor.mm - statusBarFrame deprecation
- ✅ RCTSurfaceHostingProxyRootView.mm - designated initializer warnings
- ✅ RCTBridgeProxy.mm - NSProxy initializer warnings
- ✅ RCTMultipartStreamReader.m - VLA extension warning
- ✅ RCTLocalAssetImageLoader.mm - deprecated class implementation
- ✅ RCTHost.mm - designated initializer warnings
- ✅ RCTInstance.mm - GNU conditional expression
- ✅ RCTRootViewFactory.mm - designated initializer, null to nonnull
- ✅ RCTTurboModule.mm - GNU conditional expressions
- ✅ RCTTurboModuleManager.mm - deprecated methods, GNU conditionals
- ✅ RCTFabricModalHostViewController.mm - keyWindow deprecation
- ✅ RCTTouchableComponentViewProtocol.h - duplicate protocol

### React Native Screens (patches/react-native-screens+3.31.1.patch)
- ✅ RNSScreenWindowTraits.mm - keyWindow, statusBarOrientation
- ✅ RNSScreen.mm - statusBarFrame, reactSuperview
- ✅ RNSScreenStackHeaderConfig.mm - React method overrides
- ✅ RNSScreenStack.mm - React method overrides
- ✅ RNSScreenContainer.mm - React method overrides

### React Native Reanimated (patches/react-native-reanimated+3.10.1.patch)
- ✅ REANodesManager.h - nullability annotations
- ✅ REANodesManager.mm - volatile warnings
- ✅ REASwizzledUIManager.mm - incomplete implementation, undeclared selector
- ✅ ReanimatedSensor.m - statusBarOrientation
- ✅ NativeReanimatedModule.cpp - deprecated this capture
- ✅ WorkletRuntimeDecorator.cpp - VLA extension

### React Native Gesture Handler (patches/react-native-gesture-handler+2.16.2.patch)
- ✅ RNPanHandler.m - mismatched return types
- ✅ RNGestureHandlerModule.mm - missing super invalidate
- ✅ RNGestureHandlerManager.mm - unused variable, deprecated methods

### Async Storage (patches/@react-native-async-storage+async-storage+1.23.1.patch)
- ✅ RNCAsyncStorage.h - nullability annotations

### Expo Localization (patches/expo-localization+15.0.3.patch)
- ✅ LocalizationModule.swift - Switch exhaustiveness (@unknown default)
- ✅ LocalizationModule.swift - var → let for calendar constant

### iOS Pods (scripts/patch-pods.sh)
- ✅ SocketRocket/SRWebSocket.m - OSSpinLock deprecation
- ✅ glog/raw_logging.cc - syscall deprecation
- ✅ RCT-Folly/dynamic.cpp - unreachable code

### Podfile Settings
- ✅ WARNING_CFLAGS = '-Wno-documentation' - React-graphics framework documentation warnings
- ✅ IPHONEOS_DEPLOYMENT_TARGET minimum 12.0
- ✅ Duplicate -lc++ library flags removal
- ✅ Script phase output warnings fixed
- ✅ DEAD_CODE_STRIPPING enabled

## Manuel Patch Güncelleme

Eğer patch'leri manuel olarak güncellemek isterseniz:

```bash
# Node modules değişikliklerinden sonra
npx patch-package <package-name>

# Örnek:
npx patch-package react-native
npx patch-package react-native-screens
npx patch-package react-native-reanimated
npx patch-package react-native-gesture-handler
npx patch-package @react-native-async-storage/async-storage
```

## Test

Patch'lerin doğru uygulandığını test etmek için:

```bash
# Node modules patches
rm -rf node_modules
npm install

# Pods patches
cd ios
rm -rf Pods
pod install

# Build testi
cd ..
npm run ios
```

## Notlar

- Tüm patch'ler pragma direktifleri kullanarak uyarıları suppress eder
- Üçüncü parti kütüphanelerin kaynak kodunu değiştirmez
- Apple'ın API deprecation'larını gizler ama kodu değiştirmez
- Gelecekteki kütüphane güncellemelerinde patch'lerin güncellenmesi gerekebilir

## Bakım

Bu patch'ler aşağıdaki durumlarda güncellenmelidir:
- React Native version upgrade
- Üçüncü parti kütüphane güncellemeleri
- Yeni uyarılar ortaya çıktığında
- Xcode version upgrade (yeni deprecation warnings)
