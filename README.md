# Larminay Vault

## Table of Contents

- [About the Project](#about-the-project)
- [Local Installation](#local-installation)
- [Deployment](#deployment)
- [`develop` vs `main`](#develop-vs-main)
- [Future Plans](#future-plans)

## About the Project

The original goal was to build a video server where I could host my old family videos. I found most other solutions overly complicated or designed for public videos.

I wanted a small, invite-only video host that I could have full control over, with a focus on UI/UX since many of my family members aren't great with technology.

## Local Installation

### Requirements

- `docker ~26.1.1`
- `docker-compose ~2.27.0`
- `node ^20.18.1`
- `ffmpeg ^7.0`
- `ffprobe ^7.0`

### Getting Started

To get the app running locally, you will first need to copy the `.env.example` file to `.env` and replace all the variables with yours.

Then starting the app is as simple as running the 2 following commands.

```bash
npm install
npm run start
```

This will start the following services:

- Nuxt App [http://localhost:3000](http://localhost:3000)
- Prisma Studio [http://localhost:5555](http://localhost:5555)
- S3 Ninja [http://localhost:9444/ui](http://localhost:9444/ui)

## Deployment

I built this app with the expectation that it will be deployed to DigitalOcean and Cloudflare. I basic process is as follows:

1. Use [Github Actions](https://docs.github.com/en/actions) to start deployment
2. Use [Terraform](https://www.terraform.io/) to build/update any server requirements
3. [DigitalOcean](https://www.digitalocean.com/) servers are created and configured
4. [Cloudflare](https://www.cloudflare.com/en-gb/) DNS is updated
5. [Ansible](https://www.ansible.com/) updates and prepares the server
6. The entire app is uploaded to the remote server
7. On the remote server, the app is built and started
8. [Caddy](https://caddyserver.com/) is used as the proxy server on the remote server

While this process was setup for my specific use case, this can easily be updated or modified to fit almost any situation.

## `develop` vs `main`

All official releases shall be in main. Any updates in between will be kept in develop.

- `develop` contains:

  - Experimental or upcoming changes.
  - Not fully tested.

- `main` contains:
  - Latest official release
  - Fully tested changes.

## Future Plans

- Make system more generic. Currently the whole thing is built for my accounts and use cases. I will update name, seeds, accounts, etc.
