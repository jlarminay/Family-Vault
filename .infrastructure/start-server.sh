cd ..

# Export environment variables
export $(grep -v '^#' .env.production | xargs)

# Install dependencies
npm install --no-package-lock --ignore-scripts

# Ensure ffprobe has executable permissions
chmod +x ./node_modules/@ffprobe-installer/linux-x64/ffprobe

# Generate Prisma client and run migrations
npx prisma generate
npm run db:deploy

# Build the application
npm run build

# Manage PM2 process
pm2 delete all || true  # Ignore error if no process exists
pm2 flush
pm2 start .output/server/index.mjs --name "app"