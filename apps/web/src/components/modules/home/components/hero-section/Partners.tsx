"use client";

import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ETMCarousel } from "@etm/web-ui-components";
import { PartnersImages } from "../../constants";
import Image from "next/image";

export function Partners() {
  return (
    <ETMCarousel.Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      opts={{
        align: "start",
      }}
      className="w-full max-w-fit"
    >
      <ETMCarousel.CarouselContent className="">
        {PartnersImages.map((img, index) => (
          <ETMCarousel.CarouselItem
            key={index}
            className="md:basis-1/2 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="flex items-center justify-center h-32 w-full">
              <div className="w-24 h-24 rounded-lg relative">
                <Image
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </ETMCarousel.CarouselItem>
        ))}
      </ETMCarousel.CarouselContent>
    </ETMCarousel.Carousel>
  );
}
