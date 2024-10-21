import Image from "next/image";
import { motion } from "framer-motion";
import { contentVariants } from "./constants";

const HeroImage = () => (
  <motion.div
    className="hidden lg:block w-full"
    initial="hidden"
    animate="visible"
    variants={contentVariants}
  >
    <Image
      src="/assets/landing-hero.svg"
      alt="hero"
      width={1920}
      height={1080}
      className="h-full"
      priority
    />
  </motion.div>
);

export { HeroImage };
