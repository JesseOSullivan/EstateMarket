import React from 'react';
import Image from 'next/image';
import hero from "@/hero-image.jpg";
import Search from '@/app/ui/search';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="relative w-full  h-[70vh] bg-gray-800">
        <Image
          src={hero}
          alt="Hero Image"
          fill
          style={{objectFit:"cover", objectPosition:"50% 25%"}}
        />

        {/* Responsive semi-transparent box with header text and search bar */}
        <div className="absolute inset-0 flex items-center justify-center  p-10">
          <div className="w-full  pt-8 max-w-3xl bg-black bg-opacity-40 rounded-lg overflow-hidden ">
            {/* Header text */}
            <div className="text-white text-3xl font-bold p-8 text-center ">
              Find Your Dream Home
            </div>

            {/* Search component with slightly transparent background */}
            <div className="p-10">

              <Search placeholder="Try estate name, suburb or developer" />
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}
