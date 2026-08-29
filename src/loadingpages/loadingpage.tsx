import Image from "next/image";
import React from "react";
import favicon from "../../public/favicon.png";

function Loadingpage() {
    return (
        <div className="h-screen w-full bg-gradient-to-r animate-pulse from-gray-700 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
            <div className="animate-spin-slow mt-5">
                <Image
                    src={favicon}
                    alt="favicon"
                    height={300}
                    width={300}
                    className="drop-shadow-lg animate-bounce"
                />
            </div>

            <h1 className="mt-4 text-white font-extrabold md:text-9xl font-mono tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                Korddyfire
            </h1>
            <p className="mt-4 text-gray-300 font-light text-sm tracking-wider">
                wait the screen is loading...
            </p>
        </div>
    );
}

export default Loadingpage;
