import express from 'express';
const router = express.Router();

// Örnek kullanıcı verisi
const users = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', age: 25 },
    { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', age: 30 },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', age: 28 },
    { id: 4, name: 'Fatma Şahin', email: 'fatma@example.com', age: 35 },
    { id: 5, name: 'Ali Özkan', email: 'ali@example.com', age: 22 }
];

// Tüm kullanıcıları getir
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: users,
        count: users.length
    });
});

// ID'ye göre kullanıcı getir
router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Kullanıcı bulunamadı'
        });
    }

    res.json({
        success: true,
        data: user
    });
});

// Yeni kullanıcı ekle
router.post('/', (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: 'Ad ve email gerekli alanlar'
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        age: age || null
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: 'Kullanıcı başarıyla eklendi',
        data: newUser
    });
});

export default router; 