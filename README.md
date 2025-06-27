# Node.js Projesi 🚀

Modern bir Node.js web uygulaması Express.js framework'ü ile oluşturulmuştur.

## 🌟 Özellikler

- ✅ Express.js server
- 🎨 Modern ve responsive UI
- 🔧 RESTful API endpoint'leri
- 📁 Düzenli proje yapısı
- 🔄 Nodemon ile otomatik yenileme
- 🛡️ Error handling

## 🚀 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Üretim için çalıştırın:
```bash
npm start
```

## 📱 Kullanım

- Ana sayfa: `http://localhost:3001`
- 3D Generator: `http://localhost:3001/3d-generator`
- API test: `http://localhost:3001/api/3d/test-connection`
- Kullanıcı listesi: `http://localhost:3001/api/users`

## 📁 Proje Yapısı

```
project1/
├── index.js          # Ana sunucu dosyası
├── package.json      # Proje bağımlılıkları
├── public/           # Static dosyalar
├── routes/           # Route dosyaları
├── models/           # Veri modelleri
└── README.md         # Bu dosya
```

## 🔧 API Endpoint'leri

### 🎨 3D Generation API

#### POST /api/3d/generate-shape
Tek resimden 3D model oluştur
- **Body**: FormData (image file + parameters)
- **Response**: 3D model dosyası + statistics

#### POST /api/3d/generate-full  
Çoklu görünümden tam 3D model oluştur
- **Body**: FormData (multiple image files + parameters)
- **Response**: Complete 3D model with textures

#### GET /api/3d/test-connection
Hunyuan3D API bağlantısını test et
```json
{
  "success": true,
  "message": "Hunyuan3D API bağlantısı başarılı! 🎉"
}
```

#### GET /api/3d/download/:filename
Model dosyasını indir
- **Query**: url (model file URL)
- **Response**: GLB file download

### 👥 User Management API

#### GET /api/users
Kullanıcı listesi
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

## 🛠️ Geliştirme

- `npm run dev` - Geliştirme modunda çalıştır (nodemon ile)
- `npm start` - Üretim modunda çalıştır
- `npm test` - Testleri çalıştır

## 📝 Lisans

ISC 