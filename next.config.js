const createWithVercelToolbar = require('@vercel/toolbar/plugins/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // @vercel/flags-core dynamically imports @vercel/flags-definitions
    // inside a try/catch — it only exists in Vercel's build environment
    config.resolve.alias['@vercel/flags-definitions'] = false;
    return config;
  },
};

const withVercelToolbar = createWithVercelToolbar();
module.exports = withVercelToolbar(nextConfig);
