import { motion } from "framer-motion";
import { contentVariants } from "./constants";
import Image from "next/image";

const Footer = () => (
  <motion.p
    className={`font-dm-sans text-lg text-[#9A9A9A] absolute bottom-10 left-4 lg:left-10`}
    initial="hidden"
    animate="visible"
    variants={contentVariants}
  >
    only on{" "}
    <span className="text-[#1278D4] font-medium">
      <Image
        className="w-6 h-6 inline items-center mr-1 select-none"
        alt=""
        width={24}
        height={24}
        src="/base-logo.svg"
      />
      base
    </span>
  </motion.p>
);

export { Footer };
