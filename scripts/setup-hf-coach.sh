#!/bin/bash

# Hugging Face AI Coach Setup Script
# Bu script Supabase Edge Function'ı deploy eder

set -e

echo "🤖 Hugging Face AI Coach Kurulum Başlıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Supabase CLI kontrolü
echo -e "${BLUE}📦 Supabase CLI kontrol ediliyor...${NC}"
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI bulunamadı. Kuruluyor...${NC}"
    brew install supabase/tap/supabase
    echo -e "${GREEN}✅ Supabase CLI kuruldu!${NC}"
else
    echo -e "${GREEN}✅ Supabase CLI mevcut${NC}"
fi

echo ""

# 2. Login kontrolü
echo -e "${BLUE}🔐 Supabase login kontrol ediliyor...${NC}"
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}🔑 Supabase'e login olmanız gerekiyor...${NC}"
    echo -e "${YELLOW}Tarayıcıda açılacak sayfada 'Authorize' tıklayın${NC}"
    echo ""
    supabase login
    echo -e "${GREEN}✅ Login başarılı!${NC}"
else
    echo -e "${GREEN}✅ Zaten login olmuşsunuz${NC}"
fi

echo ""

# 3. Project link
echo -e "${BLUE}🔗 Supabase projesine bağlanılıyor...${NC}"
PROJECT_REF="ashndsmlysrqwoilvnsv"

# Link kontrolü
if [ -f ".supabase/config.toml" ]; then
    echo -e "${GREEN}✅ Proje zaten bağlı${NC}"
else
    supabase link --project-ref $PROJECT_REF
    echo -e "${GREEN}✅ Proje bağlandı!${NC}"
fi

echo ""

# 4. API Key hatırlatması
echo -e "${YELLOW}⚠️  ÖNEMLİ: Hugging Face API Key'inizi hazır edin!${NC}"
echo ""
echo -e "1️⃣  https://huggingface.co/settings/tokens adresine gidin"
echo -e "2️⃣  'New token' oluşturun (Role: Read)"
echo -e "3️⃣  Token'ı kopyalayın"
echo ""
read -p "API Key'inizi aldınız mı? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸  Önce API key alın, sonra tekrar çalıştırın${NC}"
    exit 1
fi

echo ""
read -p "🔑 Hugging Face API Key'inizi yapıştırın: " HF_API_KEY

if [ -z "$HF_API_KEY" ]; then
    echo -e "${YELLOW}❌ API Key boş olamaz!${NC}"
    exit 1
fi

# 5. Secret ekleme
echo ""
echo -e "${BLUE}🔐 API Key Supabase'e ekleniyor...${NC}"
supabase secrets set HF_API_KEY="$HF_API_KEY"
echo -e "${GREEN}✅ API Key kaydedildi!${NC}"

echo ""

# 6. Function deploy
echo -e "${BLUE}🚀 Edge Function deploy ediliyor...${NC}"
supabase functions deploy coach-chat
echo -e "${GREEN}✅ Function başarıyla deploy edildi!${NC}"

echo ""
echo -e "${GREEN}🎉 KURULUM TAMAMLANDI!${NC}"
echo ""
echo -e "✅ Hugging Face AI Coach aktif"
echo -e "✅ Model: Mistral-7B-Instruct-v0.2"
echo -e "✅ Türkçe ve İngilizce desteği hazır"
echo ""
echo -e "${BLUE}📱 Uygulamayı açıp AI Coach'u test edebilirsiniz!${NC}"
echo ""
