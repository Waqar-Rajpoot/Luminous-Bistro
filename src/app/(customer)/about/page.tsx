"use client"; // This component will run on the client-side

import { Image } from "@imagekit/next";
import React from "react"; // Import React for JSX
import {
  IMAGEKIT_URL_ENDPOINT,
  aboutImage1Src,
  AboutHeroImageSrc,  
} from "@/utils/imagekit-images";

export default function AboutUs() {
  return (
    <>
      {/* Hero Section - Same as Home Page */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {AboutHeroImageSrc && (
          <Image
            urlEndpoint={IMAGEKIT_URL_ENDPOINT}
            src={AboutHeroImageSrc}
            alt="A premium and Authentic Restaurant Interior"
            width={1920}
            height={1080}
            priority
            className="absolute inset-0 w-full h-full object-cover rounded-b-[40px]"
          />
        )}
        <div className="absolute inset-0 bg-[rgba(20,31,45,0.8)] z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20 p-8">
          {" "}
          {/* Centered text */}
          <h2 className="yeseva-one text-[80px] leading-[1.1] text-[rgb(239,167,101)] text-6xl md:text-8xl font-bold drop-shadow-lg text-center">
            Who Are We
          </h2>
        </div>
      </div>

      {/* Section 2: Centered Text and Full-Width Image */}
      <section className="flex flex-col items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
        <div className="w-full text-center p-4 max-w-4xl mx-auto">
          <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
            About us
          </h3>
          <p className="text-gray-300 text-xl leading-relaxed text-justify">
            At <span className="font-bold text-[rgb(239,167,101)]">Luminous Bistro</span>, we are more
            than just a restaurant; we are a destination where culinary artistry
            meets exceptional value. Our kitchen is home to some of the{" "}
            <span className="font-bold">best cooks of world</span>, whose
            passion for flavor translates into every meticulously crafted dish,
            consistently winning{" "}
            <span className="font-bold">worldwide cooking competitions</span>{" "}
            for their unparalleled taste. This global recognition underscores
            our commitment to delivering delicious, high-quality{" "}
            <span className="font-bold">halal food</span>. Beyond the plate, our
            dedicated staff are renowned for their{" "}
            <span className="font-bold">best behavior</span> and genuine warmth,
            ensuring every customer interaction is a delightful experience. We
            pride ourselves on offering these gourmet experiences at{" "}
            <span>very cheap rates</span>, making exquisite dining accessible to
            everyone in Sahiwal. From our striking American-inspired glass
            architecture to our luminous, comfortable interiors, every aspect of{" "}
            <span className="font-bold">Luminous Bistro</span> is designed to
            create a memorable and inviting atmosphere for all our cherished
            guests.
          </p>
        </div>
        <div className="w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
          {/* Placeholder for your image */}
          {aboutImage1Src && ( // Using galleryImage1Src as a placeholder
            <Image
              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
              src={aboutImage1Src}
              alt="About Us Image"
              width={1200}
              height={700}
              className="w-full h-auto object-cover rounded-lg"
            />
          )}
        </div>
      </section>

      {/* Section 3: History */}
      <section className="flex flex-col items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
        <div className="w-full text-center p-4 max-w-4xl mx-auto">
          <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
            Our Story & History
          </h3>
          <p className="text-gray-300 text-xl leading-relaxed text-justify">
            {/* Placeholder for your history text */}
            <span className="font-bold">Luminous</span> proudly opened
            its doors in 2005, a vision brought to life by{" "}
            <span className="font-bold text-[rgb(239,167,101)]">Muhammad Waqar</span>, a dedicated
            student from{" "}
            <span className="font-bold text-[rgb(239,167,101)]">Government College Sahiwal</span>.
            Nestled in the heart of <span className="font-bold">Sahiwal</span>,
            Pakistan, our establishment stands as a unique architectural marvel,
            drawing inspiration from American design principles. This blend of
            local charm and international aesthetics creates an inviting
            atmosphere unlike any other. From its inception, Luminous Bistro was
            conceived with a clear purpose: to offer an unparalleled dining
            experience rooted in quality and tradition. We are committed to
            serving 100% halal food, ensuring every dish meets the highest
            standards of preparation and taste for our diverse clientele. After
            two years of dedicated effort and passion, we are thrilled to be
            actively serving the community, continuously striving to provide
            delicious meals and a memorable ambiance. Luminous Bistro is more
            than just a restaurant; it is a testament to local talent and a
            beacon of culinary excellence in Sahiwal.
          </p>
        </div>
      </section>
    </>
  );
}
