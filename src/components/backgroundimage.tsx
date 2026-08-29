"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import Image from "next/image";

interface BackgroundImageProps {
  className?: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ className }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const response = await api.get("/background-images");
        const urls: string[] = response.data; // assume array de URLs públicas direto
        if (urls.length === 0) {
          console.error("Nenhuma imagem encontrada.");
          return;
        }
        setImageUrls(urls);
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
      }
    };

    fetchImageUrls();
  }, []);

  useEffect(() => {
    if (imageUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [imageUrls]);

  if (imageUrls.length === 0) return null;

  return (
    <Image
      key={imageUrls[currentImageIndex]}
      src={imageUrls[currentImageIndex]}
      alt="Background"
      className={className}
      width={1920}
      height={1080}
      priority
    />
  );
};

export default BackgroundImage;