"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import BookCoverSvg from "@/components/BookCoverSvg";
import { IKImage } from "imagekitio-next";
import Image from "next/image";
import config from "@/lib/config";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string;
}

const BookCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverImage = "https://placehold.co/400x600.png",
}: Props) => {
  const [hasError, setHasError] = useState(false);

  const isImageKit =
    Boolean(coverImage) &&
    (coverImage.includes("ik.imagekit.io") ||
      (!coverImage.startsWith("http://") && !coverImage.startsWith("https://")));

  const cleanPath = coverImage?.includes("ik.imagekit.io")
    ? coverImage.replace(/^https?:\/\/ik\.imagekit\.io\/[^\/]+/, "")
    : coverImage;

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      <BookCoverSvg coverColor={coverColor} />

      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        {hasError ? (
          <Image
            src="https://placehold.co/400x600.png"
            alt="Book cover placeholder"
            fill
            className="rounded-sm object-fill"
          />
        ) : isImageKit ? (
          <IKImage
            path={cleanPath}
            urlEndpoint={config.env.imagekit.urlEndpoint}
            alt="Book cover"
            fill
            className="rounded-sm object-fill"
            loading="lazy"
            lqip={{ active: true }}
            onError={() => setHasError(true)}
          />
        ) : (
          <Image
            src={coverImage || "https://placehold.co/400x600.png"}
            alt="Book cover"
            fill
            className="rounded-sm object-fill"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
};
export default BookCover;

