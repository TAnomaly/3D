import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.js';
import hunyuan3dRouter from './routes/hunyuan3d.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.glb')) {
            res.setHeader('Content-Type', 'model/gltf-binary');
        }
    }
}));

// Ana sayfa
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🎨 3D AI Studio</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>
                :root {
                    --primary-color: #6366f1;
                    --secondary-color: #8b5cf6;
                    --accent-color: #06d6a0;
                    --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    --gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    --gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    --dark-bg: rgba(0, 0, 0, 0.8);
                    --glass-bg: rgba(255, 255, 255, 0.1);
                    --glass-border: rgba(255, 255, 255, 0.2);
                    --text-primary: #ffffff;
                    --text-secondary: rgba(255, 255, 255, 0.8);
                    --shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.12);
                    --shadow-strong: 0 16px 48px rgba(0, 0, 0, 0.2);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: var(--gradient-1);
                    color: var(--text-primary);
                    overflow-x: hidden;
                    line-height: 1.6;
                }

                .stars {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                }

                .star {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    animation: twinkle 3s infinite;
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1); }
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 20px;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .header {
                    text-align: center;
                    padding: 80px 0 60px;
                    position: relative;
                }

                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100px;
                    height: 4px;
                    background: var(--gradient-3);
                    border-radius: 2px;
                    animation: slideIn 1s ease-out;
                }

                @keyframes slideIn {
                    from { width: 0; }
                    to { width: 100px; }
                }

                .header h1 {
                    font-size: clamp(3rem, 8vw, 5rem);
                    font-weight: 700;
                    margin-bottom: 24px;
                    background: linear-gradient(45deg, #fff, #06d6a0, #fff);
                    background-size: 200% 200%;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradientShift 3s ease-in-out infinite;
                    text-shadow: none;
                }

                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .subtitle {
                    font-size: 1.5rem;
                    font-weight: 300;
                    color: var(--text-secondary);
                    margin-bottom: 16px;
                }

                .description {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    max-width: 600px;
                    margin: 0 auto;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 32px;
                    padding: 40px 0 80px;
                }

                .feature-card {
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    padding: 40px;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--gradient-3);
                    transform: scaleX(0);
                    transition: transform 0.4s ease;
                }

                .feature-card:hover::before {
                    transform: scaleX(1);
                }

                .feature-card:hover {
                    transform: translateY(-12px) scale(1.02);
                    box-shadow: var(--shadow-strong);
                    background: rgba(255, 255, 255, 0.15);
                }

                .feature-icon {
                    font-size: 3rem;
                    margin-bottom: 24px;
                    display: block;
                    background: var(--gradient-3);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .feature-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: var(--text-primary);
                }

                .feature-description {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    margin-bottom: 24px;
                    line-height: 1.6;
                }

                .feature-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .feature-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--gradient-3);
                    color: white;
                    text-decoration: none;
                    padding: 12px 20px;
                    border-radius: 50px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .feature-link:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(6, 214, 160, 0.4);
                    background: linear-gradient(135deg, #06d6a0, #4facfe);
                }

                .feature-link i {
                    font-size: 0.8rem;
                }

                .stats-section {
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    padding: 40px;
                    margin: 40px 0;
                    text-align: center;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 32px;
                    margin-top: 32px;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: var(--gradient-3);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: block;
                }

                .stat-label {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    margin-top: 8px;
                }

                .footer {
                    text-align: center;
                    padding: 40px 0;
                    color: var(--text-secondary);
                    border-top: 1px solid var(--glass-border);
                    margin-top: auto;
                }

                @media (max-width: 768px) {
                    .features-grid {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }

                    .feature-card {
                        padding: 32px 24px;
                    }

                    .feature-links {
                        justify-content: center;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 24px;
                    }
                }

                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="stars" id="stars"></div>
            
            <div class="container">
                <header class="header">
                    <h1><i class="fas fa-cube"></i> 3D AI Studio</h1>
                    <p class="subtitle">Yapay Zeka Destekli 3D Tasarım Platformu</p>
                    <p class="description">
                        Gelişmiş AI teknolojisi ile resimlerinizi 3D modellere dönüştürün ve 
                        profesyonel T-shirt mockup'ları oluşturun. Tamamen ücretsiz!
                    </p>
                </header>

                <main class="features-grid">
                    <div class="feature-card" onclick="window.location.href='/tshirt-mockup'">
                        <i class="fas fa-tshirt feature-icon"></i>
                        <h3 class="feature-title">3D T-Shirt Studio</h3>
                        <p class="feature-description">
                            Gerçek zamanlı 3D T-shirt mockup editörü. Tasarımlarınızı yükleyip 
                            profesyonel sunum görselleri oluşturun. Renk değiştirme, boyutlandırma ve konum ayarlama.
                        </p>
                        <div class="feature-links">
                            <a href="/tshirt-mockup" class="feature-link">
                                <i class="fas fa-rocket"></i> Studio'yu Aç
                            </a>
                        </div>
                    </div>

                    <div class="feature-card">
                        <i class="fas fa-magic feature-icon"></i>
                        <h3 class="feature-title">3D Model Generator</h3>
                        <p class="feature-description">
                            Hunyuan3D-2.1 AI modeli ile resimlerinizi gerçekçi 3D modellere dönüştürün. 
                            Çoklu görünüm desteği ve gelişmiş tekstür oluşturma.
                        </p>
                        <div class="feature-links">
                            <a href="/3d-generator" class="feature-link">
                                <i class="fas fa-cube"></i> Generator
                            </a>
                            <a href="/api/3d/test-connection" class="feature-link">
                                <i class="fas fa-plug"></i> API Test
                            </a>
                        </div>
                    </div>

                    <div class="feature-card">
                        <i class="fas fa-users feature-icon"></i>
                        <h3 class="feature-title">Kullanıcı API</h3>
                        <p class="feature-description">
                            RESTful API ile kullanıcı yönetimi. Kimlik doğrulama, profil yönetimi 
                            ve kullanıcı verilerini güvenli şekilde saklama.
                        </p>
                        <div class="feature-links">
                            <a href="/api/users" class="feature-link">
                                <i class="fas fa-code"></i> API Docs
                            </a>
                        </div>
                    </div>

                    <div class="feature-card">
                        <i class="fas fa-brain feature-icon"></i>
                        <h3 class="feature-title">AI Teknolojisi</h3>
                        <p class="feature-description">
                            Tencent'in son teknoloji Hunyuan3D-2.1 modeli. En gelişmiş 3D üretim 
                            algoritmaları ile yüksek kaliteli sonuçlar.
                        </p>
                        <div class="feature-links">
                            <a href="#" class="feature-link" onclick="showTechInfo()">
                                <i class="fas fa-info-circle"></i> Detaylar
                            </a>
                        </div>
                    </div>
                </main>

                <section class="stats-section">
                    <h2>Platform İstatistikleri</h2>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number" data-target="10000">0</span>
                            <div class="stat-label">Oluşturulan Model</div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" data-target="2500">0</span>
                            <div class="stat-label">Aktif Kullanıcı</div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" data-target="50000">0</span>
                            <div class="stat-label">T-Shirt Mockup</div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" data-target="99">0</span>
                            <div class="stat-label">Memnuniyet Oranı</div>
                        </div>
                    </div>
                </section>

                <footer class="footer">
                    <p>&copy; 2024 3D AI Studio. Gelişmiş AI ile güçlendirilmiştir. 🚀</p>
                </footer>
            </div>

            <script>
                // Animated stars background
                function createStars() {
                    const starsContainer = document.getElementById('stars');
                    const numberOfStars = 100;

                    for (let i = 0; i < numberOfStars; i++) {
                        const star = document.createElement('div');
                        star.className = 'star';
                        star.style.left = Math.random() * 100 + '%';
                        star.style.top = Math.random() * 100 + '%';
                        star.style.width = Math.random() * 3 + 1 + 'px';
                        star.style.height = star.style.width;
                        star.style.animationDelay = Math.random() * 3 + 's';
                        starsContainer.appendChild(star);
                    }
                }

                // Animated counters
                function animateCounters() {
                    const counters = document.querySelectorAll('.stat-number');
                    
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;

                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            counter.textContent = Math.floor(current).toLocaleString();
                        }, 16);
                    });
                }

                // Intersection Observer for animations
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (entry.target.classList.contains('stats-section')) {
                                animateCounters();
                                observer.unobserve(entry.target);
                            }
                        }
                    });
                }, observerOptions);

                function showTechInfo() {
                    alert('🤖 Hunyuan3D-2.1\\n\\n✨ En gelişmiş 3D model oluşturma AI\\n🎯 Yüksek kaliteli mesh üretimi\\n🖼️ Çoklu görünüm desteği\\n⚡ Hızlı işleme süreleri\\n🎨 Gelişmiş tekstür oluşturma');
                }

                // Initialize
                document.addEventListener('DOMContentLoaded', () => {
                    createStars();
                    observer.observe(document.querySelector('.stats-section'));
                    
                    // Add hover effects to feature cards
                    document.querySelectorAll('.feature-card').forEach(card => {
                        card.addEventListener('mouseenter', () => {
                            card.style.transform = 'translateY(-12px) scale(1.02)';
                        });
                        
                        card.addEventListener('mouseleave', () => {
                            card.style.transform = 'translateY(0) scale(1)';
                        });
                    });
                });
            </script>
        </body>
        </html>
    `);
});

// 3D Generator Sayfası
app.get('/3d-generator', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>3D Model Oluşturucu</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: white;
                    text-align: center;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                }
                .back-btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    display: inline-block;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <a href="/" class="back-btn">← Ana Sayfaya Dön</a>
                <h1>🎨 3D Model Oluşturucu</h1>
                <p>Bu özellik şu anda geliştirme aşamasında.</p>
                <p>T-shirt mockup özelliğini denemek için <a href="/tshirt-mockup" style="color: #00ff88;">buraya tıklayın</a>.</p>
            </div>
        </body>
        </html>
    `);
});

// T-Shirt Mockup Sayfası  
app.get('/tshirt-mockup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tshirt.html'));
});

// API Routes
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API başarıyla çalışıyor! 🎉',
        timestamp: new Date().toISOString(),
        status: 'success'
    });
});

// Use routes
app.use('/api/users', usersRouter);
app.use('/api/3d', hunyuan3dRouter);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Sayfa bulunamadı',
        message: 'Aradığınız endpoint mevcut değil.'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Sunucu hatası',
        message: 'Bir şeyler ters gitti!'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor!`);
    console.log(`📱 Uygulamayı görüntülemek için: http://localhost:${PORT}`);
    console.log(`🔧 API test için: http://localhost:${PORT}/api/test`);
}); 
