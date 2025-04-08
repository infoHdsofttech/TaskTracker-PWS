// import  { NextConfig } from "next";
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // any other Next.js config options you need
};

export default withPWA({
  dest: 'public',
  disable: false, // Force PWA in development
  register: true,         // register the PWA service worker
    skipWaiting: true,      // skip waiting for service worker activation
})(nextConfig);
