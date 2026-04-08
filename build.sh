#!/bin/bash
set -e

echo "Step 1: Building Next.js..."
yarn build

echo "Step 2: Building Cloudflare bundle..."
yarn cf-build

echo "Step 3: Copying worker and dependencies to assets..."
cp .open-next/worker.js .open-next/assets/_worker.js
cp -r .open-next/cloudflare .open-next/assets/cloudflare
cp -r .open-next/middleware .open-next/assets/middleware
cp -r .open-next/server-functions .open-next/assets/server-functions

# Copy .build directory if it exists
if [ -d ".open-next/.build" ]; then
  cp -r .open-next/.build .open-next/assets/.build
fi

echo "Build complete! Assets ready in .open-next/assets/"
