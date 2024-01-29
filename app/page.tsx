import React from 'react';
import Image from 'next/image';
import hero from "@/hero-image.jpg";
import Search from '@/app/ui/search'; 

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="relative w-full md:h-[70vh] sm:h-[40vh] sm:h-[70vh] bg-gray-800">
        <Image
          src={hero}
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          objectPosition="50% 25%" // Align to top
        />
        
        {/* Larger semi-transparent box in the center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-black bg-opacity-40 p-20 pb-8 rounded-md">
            {/* Include the Search component inside the box */}
            <Search placeholder="Try estate name, suburb or developer" />
          </div>
        </div>
      </div>
    </div>
  );
}

