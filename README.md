This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker

Build the image (use `linux/arm64` on Apple Silicon, `linux/amd64` for Linux servers):

```bash
# Apple Silicon Mac
docker build . --platform linux/arm64 -t nextjs-with-docker

# Linux / CI server
docker build . --platform linux/amd64 -t nextjs-with-docker
```

Run the container:

```bash
docker run -p 3000:3000 {{app_name}}
```

Open [http://localhost:3000](http://localhost:3000) to see the result.