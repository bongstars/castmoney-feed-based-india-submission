import Image from "next/image";
import { motion } from "framer-motion";
import castmoneyLogo from "@public/assets/castmoney-logo.svg";
import castmoneyMobileLogo from "@public/mobile-logo.svg";

const LogoAnimation = ({
  stage,
  windowHeight,
  windowWidth,
}: {
  stage: number;
  windowHeight: number;
  windowWidth: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 1, y: 200 }}
    animate={
      stage === 0
        ? { opacity: 1, scale: 1, y: 0 }
        : { opacity: 1, scale: 0, y: -windowHeight / 2.1 }
    }
    transition={{ duration: 0.8, ease: "circInOut" }}
    className="flex justify-center items-center absolute inset-0"
  >
    <Image
      src={windowWidth < 768 ? castmoneyMobileLogo : castmoneyLogo}
      alt="castmoney"
      className="w-52 md:w-96"
      priority
    />
  </motion.div>
);

export { LogoAnimation };
