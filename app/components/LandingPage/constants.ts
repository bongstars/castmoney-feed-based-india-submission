const REQUEST_ACCESS_LINK = `https://telegram.me/divonbase?text=show%20me%20the%20money`;

const contentVariants = {
  hidden: { opacity: 0, y: 300 },
  visible: { opacity: 1, transition: { delay: 1.5, duration: 0.5 }, y: 0 },
};

export { REQUEST_ACCESS_LINK, contentVariants };

export const ENV = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
};
