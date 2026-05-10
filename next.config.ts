/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['xlsx', 'csv-parse'],

  turbopack: {},
};

export default nextConfig;