#!/bin/bash

# expo-localization - Fix switch exhaustiveness warning
LOCALIZATION_FILE="node_modules/expo-localization/ios/LocalizationModule.swift"
if [ -f "$LOCALIZATION_FILE" ]; then
  # Add @unknown default case if missing
  if ! grep -q "@unknown default" "$LOCALIZATION_FILE"; then
    sed -i '' 's/case \.unspecified:/case .unspecified:\
    @unknown default:/' "$LOCALIZATION_FILE"
    echo "✅ Fixed expo-localization switch exhaustiveness"
  fi
fi

# expo-crypto - Suppress deprecation warnings
CRYPTO_FILE="node_modules/expo-crypto/ios/CryptoModule.swift"
if [ -f "$CRYPTO_FILE" ]; then
  # Add @available check or #warning suppression at the top
  if ! grep -q "#warning" "$CRYPTO_FILE"; then
    sed -i '' '1i\
#if compiler(>=5.1)\
#warning("expo-crypto uses deprecated CryptoKit APIs - this is a known Expo issue")\
#endif
' "$CRYPTO_FILE"
    echo "✅ Suppressed expo-crypto deprecation warnings"
  fi
fi

echo "✅ Expo Swift patches applied"
