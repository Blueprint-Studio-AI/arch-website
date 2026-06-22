import localFont from "next/font/local";

export const geist = localFont({
  src: "../../public/fonts/Geist.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

export const gascogne = localFont({
  variable: "--font-gascogne",
  display: "swap",
  src: [
    { path: "../../public/fonts/GascogneSerial-extralight.woff2", weight: "200", style: "normal" },
    { path: "../../public/fonts/GascogneSerial-light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/GascogneSerial-regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/GascogneSerial-medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/GascogneSerial-bold.woff2", weight: "700", style: "normal" },
  ],
});
