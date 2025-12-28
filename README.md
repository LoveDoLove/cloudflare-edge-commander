<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/LoveDoLove/cloudflare-edge-commander">
    <img src="images/logo.png" alt="Cloudflare Edge Commander" width="80" height="80">
  </a>

<h3 align="center">Cloudflare Edge Commander</h3>

  <p align="center">
    A lightweight Next.js control panel for managing Cloudflare accounts, zones, DNS records and useful network utilities. Built for deployment on Cloudflare using OpenNext + Wrangler.
    <br />
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-edge-commander"><strong>Explore the code »</strong></a>
    <br />
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-edge-commander">View Demo</a>
    &middot;
    <a href="https://github.com/LoveDoLove/cloudflare-edge-commander/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/LoveDoLove/cloudflare-edge-commander/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

---

## About The Project

Cloudflare Edge Commander provides a simple UI to interact with Cloudflare's API through a secure server-side proxy. It focuses on:

- Managing Cloudflare accounts, zones and DNS records
- Inspecting and editing DNS records easily
- Configuring SSL/CA and common zone settings
- Small network utilities (IPv6 <-> arpa conversion, random IPv6 generation, reverse mapping)
- Streaming client-side logs to an on-page console

The server-side proxy lives in `functions/api/cloudflare.ts` and is intended to run as a Cloudflare Pages Function (OpenNext). Credentials are proxied from the server—do not store keys in the client.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- **Next.js** (App Router + React)
- **OpenNext / @opennextjs/cloudflare** (Cloudflare deployment integration)
- **TypeScript**
- **Tailwind CSS** + **DaisyUI**
- **Lucide Icons**
- **Wrangler** (worker / Pages configuration)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Usage](#usage)
- [Security & Environment](#security--environment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js 18+ and npm
- A Cloudflare account (for API tokens and deployment)
- Wrangler CLI (used for Pages / Workers deployment)

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/LoveDoLove/cloudflare-edge-commander.git
   cd cloudflare-edge-commander
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the project:
   ```bash
   npm run deploy
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Features

- Dashboard to manage Cloudflare accounts & zones
- DNS record inspector and editor
- Zone settings & SSL helper workflows
- Network lab utilities (IPv6 tools, reverse mapping, random address generation)
- Live client-side log console

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Usage

Run local development server:

```bash
npm run dev
```

Build for production and test locally:

```bash
npm run build
npm run preview
```

Other useful scripts:

- `npm run upload` — upload static assets
- `npm run lint` — run ESLint
- `npm run cf-typegen` — regenerate Cloudflare types

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Security & Environment

- Do **not** embed API keys or global API keys in client-side code.
- Use Wrangler secrets or environment variables to store production credentials (e.g., `CF_API_TOKEN`, `CF_ACCOUNT_ID`).
- Prefer API Tokens over Global API Keys and grant only the scopes needed by the app.

**Note:** The local dev experience may accept temporary credentials for convenience, but treat them carefully and never commit them.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Project Structure

- `src/app/` — Next.js App Router pages and layout
- `src/components/` — UI components and overlays
- `src/hooks/` — hooks and cloudflare manager (`useCloudflareManager.ts`)
- `functions/api/cloudflare.ts` — server-side proxy (Pages Function)
- `wrangler.jsonc` — deployment configuration
- `cloudflare-env.d.ts` — Cloudflare env types

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contributing

Contributions are welcome! Please open issues for bugs and feature requests, then send a pull request. Suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push and open a PR

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/LoveDoLove/cloudflare-edge-commander/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LoveDoLove/cloudflare-edge-commander" alt="contrib.rocks image" />
</a>

---

## License

Distributed under the Apache License 2.0. See `LICENSE` for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contact

Maintainer: LoveDoLove — https://github.com/LoveDoLove

Project: https://github.com/LoveDoLove/cloudflare-edge-commander

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Acknowledgments

- OpenNext (OpenNext.js)
- Cloudflare docs & API
- Best README Template
- Tailwind Labs and DaisyUI
- Lucide Icons

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/LoveDoLove/cloudflare-edge-commander.svg?style=for-the-badge
[contributors-url]: https://github.com/LoveDoLove/cloudflare-edge-commander/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LoveDoLove/cloudflare-edge-commander.svg?style=for-the-badge
[forks-url]: https://github.com/LoveDoLove/cloudflare-edge-commander/network/members
[stars-shield]: https://img.shields.io/github/stars/LoveDoLove/cloudflare-edge-commander.svg?style=for-the-badge
[stars-url]: https://github.com/LoveDoLove/cloudflare-edge-commander/stargazers
[issues-shield]: https://img.shields.io/github/issues/LoveDoLove/cloudflare-edge-commander.svg?style=for-the-badge
[issues-url]: https://github.com/LoveDoLove/cloudflare-edge-commander/issues
[license-shield]: https://img.shields.io/github/license/LoveDoLove/cloudflare-edge-commander.svg?style=for-the-badge
[license-url]: https://github.com/LoveDoLove/cloudflare-edge-commander/blob/master/LICENSE
[product-screenshot]: public/images/screenshot.png
