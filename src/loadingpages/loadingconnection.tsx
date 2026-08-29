import Image from "next/image";
import React from "react";
import { MdWifiOff } from "react-icons/md";
import favicon from "../../public/favicon.png";

function LoadingConnection() {
  return (
    <div className="h-screen w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 flex flex-col items-center justify-center text-center px-6">
      <div className="animate-spin-slow mt-5">
        <Image
          src={favicon}
          alt="favicon"
          height={200}
          width={200}
          className="drop-shadow-lg animate-bounce"
        />
      </div>

      <h1 className="mt-6 text-white font-extrabold text-5xl md:text-7xl font-mono tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
        Korddyfire
      </h1>

      <div className="flex items-center gap-2 mt-6 text-red-700 text-lg md:text-2xl font-semibold tracking-wide">
        <MdWifiOff className="text-3xl md:text-4xl animate-pulse" />
        <span>Connection Error!</span>
      </div>

      <p className="mt-3 text-gray-300 text-sm md:text-base max-w-xl">
        It looks like you&#39;re offline. Please check your Wi-Fi or mobile data connection and try again. Korddyfire needs internet access to work properly.
      </p>

      <p className="mt-4 text-gray-400 text-xs italic">
        Attempting to reconnect automatically...
      </p>
    </div>
  );
}

export default LoadingConnection;
