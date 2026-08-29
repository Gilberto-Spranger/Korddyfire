"use client";

import { useState } from "react";
import api from "@/utils/api";
import Image from "next/image";

export default function UploadImage() {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    setImage(file);
  };

  const uploadImage = async () => {
    if (!image) return alert("Selecione uma imagem!");

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", image);

      // Post do arquivo via multipart/form-data para o backend
      const response = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend deve retornar { imageUrl: "url pública da imagem" }
      setImageUrl(response.data.imageUrl);
      alert("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Falha no upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={uploadImage} disabled={uploading}>
        {uploading ? "Enviando..." : "Upload"}
      </button>
      {imageUrl && (
        <div>
          <p>Imagem enviada:</p>
          <Image src={imageUrl} alt="Imagem enviada" width={200} height={200} />
        </div>
      )}
    </div>
  );
}