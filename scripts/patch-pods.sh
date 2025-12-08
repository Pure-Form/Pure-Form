#!/bin/bash

# Script to patch iOS Pods after pod install
# This applies pragma directives to suppress unavoidable deprecation warnings

PODS_DIR="$1"

if [ -z "$PODS_DIR" ]; then
  echo "Usage: $0 <pods_directory>"
  exit 1
fi

echo "🔧 Applying Pods patches..."

# Patch SocketRocket - OSSpinLock deprecation
SOCKETROCKET_FILE="$PODS_DIR/SocketRocket/SocketRocket/SRWebSocket.m"
if [ -f "$SOCKETROCKET_FILE" ]; then
  # Check if already patched
  if ! grep -q "#pragma clang diagnostic ignored \"-Wdeprecated-declarations\"" "$SOCKETROCKET_FILE"; then
    echo "  📝 Patching SocketRocket..."
    # Add pragma after imports
    sed -i '' '/^#import "SRWebSocket.h"$/a\
\
\/\/ Suppress OSSpinLock deprecation warnings for the entire file\
#pragma clang diagnostic push\
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
' "$SOCKETROCKET_FILE"
    
    # Add pragma pop at end of file
    echo "" >> "$SOCKETROCKET_FILE"
    echo "#pragma clang diagnostic pop" >> "$SOCKETROCKET_FILE"
  fi
fi

# Patch glog - syscall deprecation (raw_logging.cc already patched via line 155-158)

# Patch glog utilities.cc - syscall deprecation
GLOG_UTIL_FILE="$PODS_DIR/glog/src/utilities.cc"
if [ -f "$GLOG_UTIL_FILE" ]; then
  if ! grep -q "pid_t tid = syscall" "$GLOG_UTIL_FILE" | grep -q "#pragma clang diagnostic"; then
    echo "  📝 Patching glog utilities.cc..."
    # Wrap syscall usage with pragma (around line 254)
    sed -i '' '/pid_t tid = syscall(__NR_gettid);/i\
#pragma clang diagnostic push\
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
' "$GLOG_UTIL_FILE"
    sed -i '' '/pid_t tid = syscall(__NR_gettid);/a\
#pragma clang diagnostic pop
' "$GLOG_UTIL_FILE"
  fi
fi

# Patch RCT-Folly - unreachable code
FOLLY_DYNAMIC_FILE="$PODS_DIR/RCT-Folly/folly/dynamic.cpp"
if [ -f "$FOLLY_DYNAMIC_FILE" ]; then
  if ! grep -q "#pragma clang diagnostic ignored \"-Wunreachable-code\"" "$FOLLY_DYNAMIC_FILE" | head -1; then
    echo "  📝 Patching RCT-Folly/dynamic.cpp..."
    sed -i '' '17i\
#pragma clang diagnostic push\
#pragma clang diagnostic ignored "-Wunreachable-code"
' "$FOLLY_DYNAMIC_FILE"
    echo "" >> "$FOLLY_DYNAMIC_FILE"
    echo "#pragma clang diagnostic pop" >> "$FOLLY_DYNAMIC_FILE"
  fi
fi

# Patch RCT-Folly json.cpp - unreachable code
FOLLY_JSON_FILE="$PODS_DIR/RCT-Folly/folly/json.cpp"
if [ -f "$FOLLY_JSON_FILE" ]; then
  if ! grep -q "#pragma clang diagnostic ignored \"-Wunreachable-code\"" "$FOLLY_JSON_FILE" | head -1; then
    echo "  📝 Patching RCT-Folly/json.cpp..."
    # Add pragma after license header, before first include
    sed -i '' '/^#include <folly\/json.h>$/i\
#pragma clang diagnostic push\
#pragma clang diagnostic ignored "-Wunreachable-code"\

' "$FOLLY_JSON_FILE"
    # Add pragma pop at end of file
    echo "" >> "$FOLLY_JSON_FILE"
    echo "#pragma clang diagnostic pop" >> "$FOLLY_JSON_FILE"
  fi
fi

echo "✅ Pods patches applied successfully!"
