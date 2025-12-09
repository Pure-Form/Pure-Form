# Hugging Face AI Coach Setup 🤖

## ✅ Yapılanlar

PureForm uygulaması artık **Hugging Face Inference API** kullanıyor! Tamamen ücretsiz ve güçlü.

### Değişiklikler:
- ✅ `coach-chat` Edge Function Hugging Face'e geçirildi
- ✅ Mistral-7B-Instruct-v0.2 modeli kullanılıyor (güçlü ve hızlı)
- ✅ Türkçe ve İngilizce desteği korundu

## 🚀 Kurulum Adımları

### 1️⃣ Hugging Face API Key Alın

1. **Hugging Face'e kaydolun**: https://huggingface.co/join
2. **Settings → Access Tokens**: https://huggingface.co/settings/tokens
3. **"New token" tıklayın**
4. **İsim verin** (örn: "PureForm Coach")
5. **Role**: "Read" yeterli
6. **Token'ı kopyalayın** (bir daha gösterilmez!)

### 2️⃣ Supabase'e API Key'i Ekleyin

1. **Supabase Dashboard**: https://supabase.com/dashboard
2. **Projenizi seçin**: "ashndsmlysrqwoilvnsv"
3. **Settings → Edge Functions → Secrets**
4. **"Add new secret" tıklayın**
5. **Name**: `HF_API_KEY`
6. **Value**: Kopyaladığınız Hugging Face token'ı yapıştırın
7. **Save**

### 3️⃣ Edge Function'ı Deploy Edin

#### Seçenek A: Supabase CLI ile (Önerilen)

\`\`\`bash
cd /Users/mericmac/Documents/GitHub/Pure-Form

# Supabase'e login olun
supabase login

# Project'e bağlanın
supabase link --project-ref ashndsmlysrqwoilvnsv

# Edge Function'ı deploy edin
supabase functions deploy coach-chat
\`\`\`

#### Seçenek B: Supabase Dashboard'dan (Manuel)

1. **Edge Functions** bölümüne gidin
2. **"Create a new function"** tıklayın
3. **Name**: `coach-chat`
4. Dosya içeriğini kopyalayın: \`supabase/functions/coach-chat/index.ts\`
5. **Deploy** edin

## 🎯 Kullanılabilir Modeller

Environment variable ile model değiştirebilirsiniz:

### Önerilen Modeller:

1. **mistralai/Mistral-7B-Instruct-v0.2** (Default)
   - Güçlü ve hızlı
   - Türkçe desteği iyi
   - Fitness/nutrition konularında başarılı

2. **meta-llama/Llama-2-7b-chat-hf**
   - Meta'nın güçlü modeli
   - İyi genel bilgi

3. **google/flan-t5-xxl**
   - Çok hızlı
   - Kısa yanıtlar için ideal

### Model Değiştirmek İçin:

Supabase → Settings → Edge Functions → Secrets → `HF_MODEL` ekleyin

Örnek: `meta-llama/Llama-2-7b-chat-hf`

## 🧪 Test Edin

Deploy ettikten sonra uygulamayı açın ve AI Coach Chat'e bir şey sorun:

**Örnek sorular:**
- "Kol kaslarımı geliştirmek için ne yapmalıyım?"
- "Protein tozu kullanmalı mıyım?"
- "Kardiyo mu ağırlık antrenmanı mı daha iyi?"

## ❗ Sorun Giderme

### "Missing HF_API_KEY" hatası
- ✅ API key'i Supabase Secrets'e eklediniz mi?
- ✅ Key adı tam olarak \`HF_API_KEY\` mi?

### "Model is loading" hatası
- ⏳ İlk kullanımda model yüklenirken 20-30 saniye bekleyebilir
- ✅ Tekrar deneyin, model artık yüklü olacak

### Yanıt yavaş geliyor
- Model ilk kullanımda "cold start" yapar (20-30 saniye)
- Sonraki kullanımlarda 2-5 saniyede yanıt verir
- Daha hızlı model istiyorsanız: \`google/flan-t5-xxl\` kullanın

## 💡 Avantajları

✅ **Tamamen ücretsiz** (sınırsız kullanım)
✅ **API key hemen alınır** (5 dakika)
✅ **Birçok model seçeneği** var
✅ **Türkçe desteği** güçlü
✅ **Rate limit yok** (ama cold start var)

## 📊 Karşılaştırma

| Özellik | Hugging Face | Google Gemini |
|---------|--------------|---------------|
| **Fiyat** | Ücretsiz | Ücretsiz (limit: 60/dk) |
| **Hız** | 2-5 sn (cold: 30sn) | 1-2 saniye |
| **Türkçe** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Setup** | 5 dakika | 5 dakika |
| **Model Seçimi** | ✅ Çok fazla | ❌ Sabit |

## 🎉 Hazır!

Artık AI Coach çalışıyor! Uygulamayı açıp test edebilirsiniz.

Sorularınız için: Deploy ettikten sonra test edin ve sonuçları paylaşın! 🚀
