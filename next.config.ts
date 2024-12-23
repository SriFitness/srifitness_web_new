import type { NextConfig } from "next";
// const removeImports = require('next-remove-imports')();
// module.exports = removeImports({});

const nextConfig: NextConfig = {

  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com'],
  },
};

export default nextConfig;

