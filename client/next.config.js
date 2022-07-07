/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true,
 images: {
  domains: [
   "restcountries.eu",
   "cdn.jsdelivr.net",
   "www.gravatar.com",
   "res.cloudinary.com",
   "localhost",
  ],
 },
};

module.exports = nextConfig;
