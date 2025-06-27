import { Client } from "@gradio/client";

class Hunyuan3DService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            if (!this.isConnected) {
                this.client = await Client.connect("tencent/Hunyuan3D-2.1");
                this.isConnected = true;
                console.log("✅ Hunyuan3D API bağlantısı başarılı!");
            }
            return this.client;
        } catch (error) {
            console.error("❌ Hunyuan3D API bağlantı hatası:", error);
            throw new Error("API bağlantısı kurulamadı");
        }
    }

    async generateShape(params) {
        try {
            await this.connect();

            const {
                image,
                mv_image_front = image,
                mv_image_back = image,
                mv_image_left = image,
                mv_image_right = image,
                steps = 30,
                guidance_scale = 5,
                seed = Math.floor(Math.random() * 10000),
                octree_resolution = 256,
                check_box_rembg = true,
                num_chunks = 8000,
                randomize_seed = true
            } = params;

            console.log("🎨 3D model oluşturuluyor...");

            const result = await this.client.predict("/shape_generation", {
                image,
                mv_image_front,
                mv_image_back,
                mv_image_left,
                mv_image_righs,
                steps,
                guidance_scale,
                seed,
                octree_resolution,
                check_box_rembg,
                num_chunks,
                randomize_seed
            });

            console.log("✅ 3D model başarıyla oluşturuldu!");
            return {
                success: true,
                data: result.data,
                message: "3D model başarıyla oluşturuldu!"
            };

        } catch (error) {
            console.error("❌ 3D model oluşturma hatası:", error);
            return {
                success: false,
                error: error.message,
                message: "3D model oluşturulamadı"
            };
        }
    }

    async generateAll(params) {
        try {
            await this.connect();

            console.log("🎨 Tam 3D model (texture ile) oluşturuluyor...");

            const result = await this.client.predict("/generation_all", params);

            console.log("✅ Tam 3D model başarıyla oluşturuldu!");
            return {
                success: true,
                data: result.data,
                message: "Tam 3D model (texture ile) başarıyla oluşturuldu!"
            };

        } catch (error) {
            console.error("❌ Tam 3D model oluşturma hatası:", error);
            return {
                success: false,
                error: error.message,
                message: "Tam 3D model oluşturulamadı"
            };
        }
    }

    async exportModel(params) {
        try {
            await this.connect();

            const {
                file_out,
                file_out2,
                file_type = "glb",
                reduce_face = false,
                export_texture = false,
                target_face_num = 10000
            } = params;

            console.log("📦 3D model export ediliyor...");

            const result = await this.client.predict("/on_export_click", {
                file_out,
                file_out2,
                file_type,
                reduce_face,
                export_texture,
                target_face_num
            });

            console.log("✅ 3D model başarıyla export edildi!");
            return {
                success: true,
                data: result.data,
                message: "3D model başarıyla export edildi!"
            };

        } catch (error) {
            console.error("❌ 3D model export hatası:", error);
            return {
                success: false,
                error: error.message,
                message: "3D model export edilemedi"
            };
        }
    }

    // Generation mode değiştirme
    async setGenerationMode(mode = "Turbo") {
        try {
            await this.connect();
            const result = await this.client.predict("/on_gen_mode_change", { value: mode });
            return result.data;
        } catch (error) {
            console.error("Generation mode hatası:", error);
            throw error;
        }
    }

    // Decode mode değiştirme
    async setDecodeMode(mode = "Standard") {
        try {
            await this.connect();
            const result = await this.client.predict("/on_decode_mode_change", { value: mode });
            return result.data;
        } catch (error) {
            console.error("Decode mode hatası:", error);
            throw error;
        }
    }
}

export default new Hunyuan3DService(); 