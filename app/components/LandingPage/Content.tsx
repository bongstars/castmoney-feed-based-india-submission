import { motion } from "framer-motion";
import { contentVariants } from "./constants";
import { Farcaster } from "@/app/icons";

const Content = () => {
  return (
    <motion.div
      className="min-h-full flex flex-col justify-center px-4 lg:px-10 w-full"
      initial="hidden"
      animate="visible"
      variants={contentVariants}
    >
      <h1 className="font-satoshi text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-medium xl:leading-[96%] text-white">
        the alpha is in your <br /> social graph
      </h1>
      <p className="text-[#A0A1A2] text-md xl:text-lg font-dm-sans font-normal mt-3 mb-12">
        <span>discover what the best</span>{" "}
        <span className="text-[#855DCD] font-medium inline-flex items-baseline px-1">
          <Farcaster
            width={18}
            height={18}
            className="fill-[#855DCD] mr-2 relative -bottom-[2px]"
          />
          <span>farcaster</span>
        </span>
        <span className="hidden md:inline-block">traders</span>
        <br />
        <span className="md:hidden inline-block">traders</span>{" "}
        <span>are bullish on</span>{" "}
        <span>
          with <span className="text-castmoney-brand">castmoney</span>
        </span>
      </p>
    </motion.div>
  );
};

export { Content };
