class User {
    constructor(id, name, email, age = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.createdAt = new Date();
    }

    // Kullanıcı bilgilerini doğrula
    static validate(userData) {
        const errors = [];

        if (!userData.name || userData.name.trim().length < 2) {
            errors.push('Ad en az 2 karakter olmalı');
        }

        if (!userData.email || !this.isValidEmail(userData.email)) {
            errors.push('Geçerli bir email adresi girin');
        }

        if (userData.age && (userData.age < 0 || userData.age > 120)) {
            errors.push('Yaş 0-120 arasında olmalı');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Email formatını kontrol et
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Kullanıcı bilgilerini güncelle
    update(newData) {
        if (newData.name) this.name = newData.name;
        if (newData.email) this.email = newData.email;
        if (newData.age !== undefined) this.age = newData.age;
        this.updatedAt = new Date();
    }

    // JSON formatında çıktı
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            age: this.age,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt || null
        };
    }
}

export default User; 