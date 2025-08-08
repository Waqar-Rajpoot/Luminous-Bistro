const HERO_IMAGE_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/hero.jpg?updatedAt=1753343580256";
  const GALLERY_IMAGE_1_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/exterior1.jpg?updatedAt=1753343579743";
const GALLERY_IMAGE_2_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/interior2.jpg?updatedAt=1753356044627";
const GALLERY_IMAGE_3_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/home%20delivery1.jpg?updatedAt=1753343577989";
const GALLERY_IMAGE_fixed_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/fixed.jpg?updatedAt=1753356645726";
const GALLERY_IMAGE_4_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/lawn.png?updatedAt=1753343579905";
const GALLERY_IMAGE_5_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/lawn2.jpg?updatedAt=1753343578798";
const GALLERY_IMAGE_6_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/lawn1.jpg?updatedAt=1753343579695";

// About page images
const ABOUT_HERO_IMAGE_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/About%20Page%20Images/about-hero.jpg?updatedAt=1753370622759";
const ABOUT_IMAGE_1_FULL_URL =
  "https://ik.imagekit.io/kxbn8thcbf/Home%20Page%20Images/exterior2.jpg?updatedAt=1753371189742";

const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

const getImagekitFilePath = (fullImageUrl: string): string | null => {
  if (!IMAGEKIT_URL_ENDPOINT) {
    console.error(
      "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined in .env.local."
    );
    return null;
  }
  if (fullImageUrl.startsWith(IMAGEKIT_URL_ENDPOINT)) {
    const filePath = fullImageUrl.substring(IMAGEKIT_URL_ENDPOINT.length);
    return filePath.startsWith("/") ? filePath.substring(1) : filePath;
  }
  console.warn(
    `URL "${fullImageUrl}" does not match ImageKit endpoint "${IMAGEKIT_URL_ENDPOINT}".`
  );
  return null;
};

const heroImageSrc = getImagekitFilePath(HERO_IMAGE_FULL_URL);
const galleryImage1Src = getImagekitFilePath(GALLERY_IMAGE_1_FULL_URL);
const galleryImage2Src = getImagekitFilePath(GALLERY_IMAGE_2_FULL_URL);
const galleryImage3Src = getImagekitFilePath(GALLERY_IMAGE_3_FULL_URL);
const galleryImagefixedSrc = getImagekitFilePath(GALLERY_IMAGE_fixed_FULL_URL);
const galleryImage4Src = getImagekitFilePath(GALLERY_IMAGE_4_FULL_URL);
const galleryImage5Src = getImagekitFilePath(GALLERY_IMAGE_5_FULL_URL);
const galleryImage6Src = getImagekitFilePath(GALLERY_IMAGE_6_FULL_URL);

// About page images

const AboutHeroImageSrc = getImagekitFilePath(ABOUT_HERO_IMAGE_FULL_URL);
const aboutImage1Src = getImagekitFilePath(ABOUT_IMAGE_1_FULL_URL);

export {
  getImagekitFilePath,
  IMAGEKIT_URL_ENDPOINT,
  heroImageSrc,
  galleryImage1Src,
  galleryImage2Src,
  galleryImage3Src,
  galleryImagefixedSrc,
  galleryImage4Src,
  galleryImage5Src,
  galleryImage6Src,

  // About page images
  AboutHeroImageSrc,
  aboutImage1Src,
};
