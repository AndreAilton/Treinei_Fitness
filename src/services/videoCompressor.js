import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const compressVideo = (inputPath) => {
  return new Promise((resolve, reject) => {
    const directory = path.dirname(inputPath);
    // Remove a extensão antiga e garante .mp4
    const filename = path.basename(inputPath, path.extname(inputPath)); 
    const outputPath = path.join(directory, `${filename}_compressed.mp4`);

    console.log(`🎬 Iniciando compressão: ${inputPath}`);

    ffmpeg(inputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-crf 28", 
        "-preset fast", 
        "-movflags +faststart",
      ])
      .size("1280x?") // 720p
      .on("end", () => {
        try {
          // Remove o original
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          
          // Renomeia o comprimido para o nome final (mantendo .mp4)
          const finalPath = path.join(directory, `${filename}.mp4`);
          fs.renameSync(outputPath, finalPath);
          
          console.log(`✅ Vídeo comprimido: ${finalPath}`);
          resolve(finalPath);
        } catch (err) {
          console.error("Erro ao substituir arquivos:", err);
          resolve(outputPath);
        }
      })
      .on("error", (err) => {
        console.error("❌ Erro na compressão:", err);
        reject(err);
      })
      .save(outputPath);
  });
};