import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import hunyuan3dService from '../services/hunyuan3d.js';

const router = express.Router();

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir!'));
        }
    }
});

// API bağlantısını test et
router.get('/test-connection', async (req, res) => {
    try {
        await hunyuan3dService.connect();
        res.json({
            success: true,
            message: "Hunyuan3D API bağlantısı başarılı! 🎉"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "API bağlantısı kurulamadı",
            error: error.message
        });
    }
});

// Tek resimden 3D model oluştur
router.post('/generate-shape', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resim dosyası gerekli!"
            });
        }

        // Dosyayı Buffer olarak oku
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBlob = new Blob([imageBuffer], { type: req.file.mimetype });

        const params = {
            image: imageBlob,
            steps: parseInt(req.body.steps) || 30,
            guidance_scale: parseFloat(req.body.guidance_scale) || 5,
            seed: parseInt(req.body.seed) || Math.floor(Math.random() * 10000),
            octree_resolution: parseInt(req.body.octree_resolution) || 256,
            check_box_rembg: req.body.remove_background !== 'false',
            num_chunks: parseInt(req.body.num_chunks) || 8000,
            randomize_seed: req.body.randomize_seed !== 'false'
        };

        const result = await hunyuan3dService.generateShape(params);

        // Geçici dosyayı sil
        fs.unlinkSync(req.file.path);

        res.json(result);

    } catch (error) {
        console.error("Shape generation hatası:", error);

        // Hata durumunda dosyayı temizle
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: "3D model oluşturulamadı",
            error: error.message
        });
    }
});

// Çoklu görünümden tam 3D model oluştur
router.post('/generate-full', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
    { name: 'left', maxCount: 1 },
    { name: 'right', maxCount: 1 }
]), async (req, res) => {
    try {
        const files = req.files;

        if (!files.image || !files.image[0]) {
            return res.status(400).json({
                success: false,
                message: "Ana resim dosyası gerekli!"
            });
        }

        // Dosyaları Buffer olarak oku ve Blob'a çevir
        const mainImage = fs.readFileSync(files.image[0].path);
        const mainBlob = new Blob([mainImage], { type: files.image[0].mimetype });

        let frontBlob = mainBlob;
        let backBlob = mainBlob;
        let leftBlob = mainBlob;
        let rightBlob = mainBlob;

        if (files.front && files.front[0]) {
            const frontImage = fs.readFileSync(files.front[0].path);
            frontBlob = new Blob([frontImage], { type: files.front[0].mimetype });
        }
        if (files.back && files.back[0]) {
            const backImage = fs.readFileSync(files.back[0].path);
            backBlob = new Blob([backImage], { type: files.back[0].mimetype });
        }
        if (files.left && files.left[0]) {
            const leftImage = fs.readFileSync(files.left[0].path);
            leftBlob = new Blob([leftImage], { type: files.left[0].mimetype });
        }
        if (files.right && files.right[0]) {
            const rightImage = fs.readFileSync(files.right[0].path);
            rightBlob = new Blob([rightImage], { type: files.right[0].mimetype });
        }

        const params = {
            image: mainBlob,
            mv_image_front: frontBlob,
            mv_image_back: backBlob,
            mv_image_left: leftBlob,
            mv_image_right: rightBlob,
            steps: parseInt(req.body.steps) || 30,
            guidance_scale: parseFloat(req.body.guidance_scale) || 5,
            seed: parseInt(req.body.seed) || Math.floor(Math.random() * 10000),
            octree_resolution: parseInt(req.body.octree_resolution) || 256,
            check_box_rembg: req.body.remove_background !== 'false',
            num_chunks: parseInt(req.body.num_chunks) || 8000,
            randomize_seed: req.body.randomize_seed !== 'false'
        };

        const result = await hunyuan3dService.generateAll(params);

        // Geçici dosyaları sil
        Object.keys(files).forEach(key => {
            files[key].forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        });

        res.json(result);

    } catch (error) {
        console.error("Full generation hatası:", error);

        // Hata durumunda dosyaları temizle
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                req.files[key].forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            });
        }

        res.status(500).json({
            success: false,
            message: "Tam 3D model oluşturulamadı",
            error: error.message
        });
    }
});

// Generation mode değiştir
router.post('/set-generation-mode', async (req, res) => {
    try {
        const { mode } = req.body;
        const result = await hunyuan3dService.setGenerationMode(mode);
        res.json({
            success: true,
            data: result,
            message: `Generation mode "${mode}" olarak ayarlandı`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Generation mode ayarlanamadı",
            error: error.message
        });
    }
});

// Decode mode değiştir
router.post('/set-decode-mode', async (req, res) => {
    try {
        const { mode } = req.body;
        const result = await hunyuan3dService.setDecodeMode(mode);
        res.json({
            success: true,
            data: result,
            message: `Decode mode "${mode}" olarak ayarlandı`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Decode mode ayarlanamadı",
            error: error.message
        });
    }
});

// Model dosyasını indir
router.get('/download/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Dosya URL'si gerekli"
            });
        }

        // Dosyayı external URL'den fetch et
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();

        // Content-Type ve filename ayarla
        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.byteLength);

        // Buffer'ı gönder
        res.send(Buffer.from(buffer));

    } catch (error) {
        console.error("Dosya indirme hatası:", error);
        res.status(500).json({
            success: false,
            message: "Dosya indirilemedi",
            error: error.message
        });
    }
});

export default router; 