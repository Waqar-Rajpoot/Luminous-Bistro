// app/page.tsx
"use client"; // This component will run on the client-side

import { Image } from "@imagekit/next";
import React from "react"; // Import React for JSX
import {
  IMAGEKIT_URL_ENDPOINT,
  aboutImage1Src,
  galleryImage1Src,
  galleryImage2Src,
  galleryImage3Src,
  galleryImagefixedSrc,
  galleryImage4Src,
  galleryImage5Src,
  galleryImage6Src,
} from "@/utils/imagekit-images";

export default function Home() {
  return (
    <>
      <div className="relative w-full h-[60vh] overflow-hidden">
        {aboutImage1Src && (
          <Image
            urlEndpoint={IMAGEKIT_URL_ENDPOINT}
            src={aboutImage1Src}
            alt="A premium and Authentic Restaurant Interior"
            width={1920}
            height={1080}
            priority
            className="absolute inset-0 w-full h-full object-cover rounded-b-[40px]"
          />
        )}
        <div className="absolute inset-0 bg-[rgba(20,31,45,0.8)] z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-8">
          <h2 className="yeseva-one text-[80px] leading-[1.1] text-[rgb(239,167,101)] text-6xl md:text-8xl font-bold drop-shadow-lg">
            A premium <br /> and Authentic <br /> Restaurant
          </h2>
        </div>
      </div>

      <section className="flex flex-col lg:flex-row items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
        <div className="lg:w-1/2 w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
          {galleryImage1Src && (
            <Image
              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
              src={galleryImage1Src}
              alt="Inviting outdoor dining area with lush greenery"
              width={800}
              height={500}
              className="w-full h-auto object-cover rounded-lg"
            />
          )}
        </div>
        <div className="lg:w-1/2 w-full text-center lg:text-left p-4">
          <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
            Architectural Brilliance
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-justify">
            Our restaurant is a contemporary masterpiece, encased in a
            magnificent glass facade with graceful arches. This transparent
            structure invites you into a sophisticated ambiance, where design
            and culinary art converge for an extraordinary dining experience
          </p>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row-reverse items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
        <div className="lg:w-1/2 w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
          {galleryImage2Src && (
            <Image
              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
              src={galleryImage2Src}
              alt="Elegant restaurant interior with modern design"
              width={800}
              height={500}
              className="w-full h-auto object-cover rounded-lg"
            />
          )}
        </div>
        <div className="lg:w-1/2 w-full text-center lg:text-right p-4">
          <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
            Luminous Interior Comfort
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-justify">
            Step into a captivating ambiance where exquisite lighting, from our
            innovative ceiling to plush seating, illuminates every detail. Our
            meticulously planned arrangements offer intimate nooks and vibrant
            communal spaces, ensuring your perfect spot.
          </p>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
        <div className="lg:w-1/2 w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
          {galleryImage3Src && (
            <Image
              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
              src={galleryImage3Src}
              alt="Inviting outdoor dining area with lush greenery"
              width={800}
              height={500}
              className="w-full h-auto object-cover rounded-lg"
            />
          )}
        </div>
        <div className="lg:w-1/2 w-full text-center lg:text-left p-4">
          <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
            Swift Culinary Delivery
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-justify">
            Enjoy our home delivery service, bringing your favorite dishes with
            best behavior and on-time punctuality. Get fresh, hot meals and
            exclusive discounts, extending our hospitality straight to your
            table
          </p>
        </div>
      </section>
      <section className="flex flex-col lg:flex-row items-center justify-center bg-[#141f2d]">
        <div className="w-full overflow-hidden shadow-xl">
          {galleryImagefixedSrc && (
            <Image
              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
              src={galleryImagefixedSrc}
              alt="Inviting outdoor dining area with lush greenery"
              width={1000}
              height={500}
              className="w-full h-[60vh] md:h-[75vh] object-cover"
            />
          )}
        </div>
      </section>

      <section className="flex flex-col lg:flex-row-reverse items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
        <div className="lg:w-1/2 w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
          {galleryImage4Src && (
            <Image
              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
              src={galleryImage4Src}
              alt="Elegant restaurant interior with modern design"
              width={800}
              height={500}
              className="w-full h-auto object-cover rounded-lg"
            />
          )}
        </div>
        <div className="lg:w-1/2 w-full text-center lg:text-right p-4">
          <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
            Sensory Culinary Journey
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-justify">
            Prepare for an extraordinary experience with our delicious,
            meticulously crafted food, bursting with unparalleled taste. We
            create memorable user experiences, ensuring each bite is pure
            enjoyment from first aroma to the last
          </p>
        </div>
      </section>
      <section className="flex flex-col lg:flex-row items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
        <div className="lg:w-1/2 w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
          {galleryImage5Src && (
            <Image
              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
              src={galleryImage5Src}
              alt="Inviting outdoor dining area with lush greenery"
              width={800}
              height={500}
              className="w-full h-auto object-cover rounded-lg"
            />
          )}
        </div>
        <div className="lg:w-1/2 w-full text-center lg:text-left p-4">
          <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
            Grand Dining Celebration Space
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-justify">
            Our magnificent dinner area is designed for gatherings of any scale,
            offering vast, flexible arrangements to comfortably accommodate a
            large number of guests. Experience spacious elegance and perfect
            planning, making every meal a grand occasion.
          </p>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row-reverse items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
        <div className="lg:w-1/2 w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
          {galleryImage6Src && (
            <Image
              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
              src={galleryImage6Src}
              alt="Elegant restaurant interior with modern design"
              width={800}
              height={500}
              className="w-full h-auto object-cover rounded-lg"
            />
          )}
        </div>
        <div className="lg:w-1/2 w-full text-center lg:text-right p-4">
          <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
            Open-Air Oasis Dining
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-justify">
            Step into our enchanting open-air dining area, where lush greenery
            and vibrant ground create a serene oasis. Savor exquisite meals
            amidst nature is tranquility under beautiful weather. It is the
            perfect refreshing escape
          </p>
        </div>
      </section>
    </>
  );
}
