#!/bin/bash

# Pure Life - Screenshot Capture Script
# Bu script iOS simulator'dan otomatik screenshot alır

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MARKETING_DIR="$PROJECT_ROOT/assets/marketing/screenshots"

# Marketing klasörünü oluştur
mkdir -p "$MARKETING_DIR"

echo "📸 Pure Life Screenshot Capture"
echo "================================"
echo ""

# iOS Simulator kontrolü
if ! command -v xcrun &> /dev/null; then
    echo "❌ Xcode command line tools bulunamadı"
    echo "   'xcode-select --install' ile yükleyin"
    exit 1
fi

# Aktif simulator kontrolü
BOOTED_DEVICE=$(xcrun simctl list devices | grep "(Booted)" | head -n 1)

if [ -z "$BOOTED_DEVICE" ]; then
    echo "❌ Çalışan iOS simulator bulunamadı"
    echo ""
    echo "Önce simulator başlatın:"
    echo "  1. Xcode'u açın"
    echo "  2. Xcode > Open Developer Tool > Simulator"
    echo "  3. İstediğiniz cihazı seçin (iPhone 15 Pro önerilir)"
    echo "  4. Pure Life uygulamasını çalıştırın: npm run ios"
    echo "  5. Bu scripti tekrar çalıştırın"
    exit 1
fi

echo "✅ Aktif simulator bulundu:"
echo "   $BOOTED_DEVICE"
echo ""

# Screenshot fonksiyonu
capture_screenshot() {
    local name=$1
    local description=$2
    local output="$MARKETING_DIR/$name.png"
    
    echo "📸 Screenshot alınıyor: $description"
    echo "   👉 Uygulamada doğru ekrana gidin ve Enter'a basın..."
    read -r
    
    xcrun simctl io booted screenshot "$output"
    
    if [ -f "$output" ]; then
        # Dosya boyutunu al
        local size=$(du -h "$output" | cut -f1)
        echo "   ✅ Kaydedildi: $output ($size)"
        
        # Boyutları kontrol et
        local dimensions=$(sips -g pixelWidth -g pixelHeight "$output" | grep -E "pixelWidth|pixelHeight" | awk '{print $2}' | tr '\n' 'x' | sed 's/x$//')
        echo "   📏 Boyut: $dimensions"
    else
        echo "   ❌ Screenshot alınamadı"
    fi
    
    echo ""
}

echo "🎬 Screenshot alma işlemi başlıyor..."
echo "   Not: Her ekran için uygulamada o sayfaya gidin ve Enter'a basın"
echo ""
echo "Hazır olduğunuzda Enter'a basın..."
read -r
echo ""

# Screenshot'ları al
capture_screenshot "01-onboarding" "Onboarding - Karşılama Ekranı"
capture_screenshot "02-dashboard" "Dashboard - Ana Ekran"
capture_screenshot "03-weekly-plan" "Haftalık Antrenman Planı"
capture_screenshot "04-nutrition" "Beslenme Kütüphanesi"
capture_screenshot "05-progress" "İlerleme Grafikleri"
capture_screenshot "06-ai-coach" "AI Coach Chat"
capture_screenshot "07-settings" "Ayarlar ve Profil"

echo "================================"
echo "✅ Tamamlandı!"
echo ""
echo "📁 Screenshot'lar şuraya kaydedildi:"
echo "   $MARKETING_DIR"
echo ""
echo "📋 Sıradaki adımlar:"
echo "   1. Screenshot'ları kontrol edin"
echo "   2. Gerekirse tekrar çekin (script'i tekrar çalıştırın)"
echo "   3. Status bar temizlemek için düzenleme yapın (opsiyonel)"
echo "   4. App Store Connect'e yükleyin"
echo ""
echo "💡 İpucu: Status bar'ı gizlemek için:"
echo "   xcrun simctl status_bar booted override --time '9:41' --batteryLevel 100"
echo ""
