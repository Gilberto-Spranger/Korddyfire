"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CaptureToken = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("CaptureToken montado!"); 

    const hash = window.location.hash.substring(1); 
    console.log("Hash da URL:", hash);

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    console.log("Access Token:", accessToken);

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      console.log("Token salvo no localStorage!");
      router.replace("/home");
    }
  }, [router]);

  return null;
};

export default CaptureToken;
