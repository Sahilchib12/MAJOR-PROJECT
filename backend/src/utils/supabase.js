import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const upload = multer({ storage: multer.memoryStorage() });

const uploadFile = async (file) => {
  try {
    // Unique file name
    const fileName = `${Date.now()}_${file.originalname}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("resumes") // Folder in Supabase Storage
      .upload(fileName, file.buffer, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (error) throw error;

    // Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};

export { upload, uploadFile };
