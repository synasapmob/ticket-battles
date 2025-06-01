/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: { emotion: true },

  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/product-images/beauty/**',
      },
    ],
  },

  webpack(config) {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });

    /* 
      - /\.svg$/i
          this is necessary for project because we dynamic require($variable)
          also render svg as react component
    */
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: 'babel-loader',
        },
        {
          loader: 'react-svg-loader',
          options: {
            jsx: false, // true outputs JSX tags
            svgo: {
              plugins: [{ removeViewBox: false }],
            },
          },
        },
      ],
    });

    // handler loader files
    config.module.rules.push({
      test: /\.mp3$/,
      type: 'asset', // This tells webpack to treat .mp3 files as resources
      generator: {
        filename: 'static/media/[name][ext][query]',
      },
    });

    // handler loader files
    config.module.rules.push({
      test: /\.wav$/,
      type: 'asset', // This tells webpack to treat .mp3 files as resources
      generator: {
        filename: 'static/media/[name][ext][query]',
      },
    });

    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
