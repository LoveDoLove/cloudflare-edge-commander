<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/LoveDoLove/cloudflare-edge-commander">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Cloudflare Edge Commander</h3>

  <p align="center">
    A lightweight Next.js control panel for managing Cloudflare accounts, zones, DNS records and simple network tooling (IPv6 utils, reverse mapping). Built to run on Cloudflare via OpenNext + Wrangler.
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

Cloudflare Edge Commander is a small admin dashboard built with Next.js and OpenNext for Cloudflare that makes it easy to:

- Manage Cloudflare accounts and zones
- Inspect and edit DNS records
- Configure SSL/CA and zone settings
- Run simple network lab utilities (IPv6 <-> arpa conversion, random IPv6 generation)
- Stream live client-side logs to a console drawer

The app runs server-side API proxying on Cloudflare (see `src/app/api/cloudflare/route.ts`) so credentials are not directly published to third-party APIs from the browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- **Next.js** (React + App Router)
- **OpenNext.js / @opennextjs/cloudflare** (Cloudflare deployment integration)
- **TypeScript**
- **Tailwind CSS** + **DaisyUI** (UI)
- **Lucide Icons**
- **Wrangler** (Cloudflare worker config)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

Follow these instructions to get a local copy up and running for development and deployment.

### Prerequisites

- Node.js 18+ and npm
- A Cloudflare account (for API keys/tokens and deployment)
- Wrangler CLI (dev dependency) — type generation script included in `package.json`

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-edge-commander.git
   cd cloudflare-edge-commander
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. (Optional) Generate Cloudflare types for local development
   ```sh
   npm run cf-typegen
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Usage

Run local development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Start (server):

```sh
npm start
```

Deploy to Cloudflare (OpenNext + Wrangler):

```sh
npm run deploy
```

Other available commands (see `package.json`):
- `npm run upload` — upload assets
- `npm run preview` — preview with opennext
- `npm run lint` — run ESLint

### How API integration works

- The UI accepts Cloudflare credentials (Account email + Global API Key) and sends them to the server-side proxy at `POST /api/cloudflare` (see `src/app/api/cloudflare/route.ts`).
- The proxy then forwards requests to the Cloudflare REST API and returns responses to the client. For production, prefer Cloudflare API Tokens with minimal scopes.

> Security tip: use environment variables / Wrangler secrets for production credentials and avoid embedding keys in client-side source.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Project Structure

Key files & folders:

- `src/app/` — Next.js app router pages and layout
- `src/app/api/cloudflare/route.ts` — server-side Cloudflare proxy endpoint
- `src/hooks/useCloudflareManager.ts` — primary application state and Cloudflare actions
- `src/components/` — UI components and overlays
- `wrangler.jsonc` — Cloudflare worker configuration
- `cloudflare-env.d.ts` — Cloudflare env types

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contributing

Contributions are welcome! Please follow this workflow:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please open issues for bugs or feature requests so we can triage and prioritize.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/LoveDoLove/cloudflare-edge-commander/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LoveDoLove/cloudflare-edge-commander" alt="contrib.rocks image" />
</a>

---

## License

Distributed under the Apache License 2.0. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contact

Project Maintainer - https://github.com/LoveDoLove

Project Link: https://github.com/LoveDoLove/cloudflare-edge-commander

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Acknowledgments

- OpenNext (OpenNext.js) — Cloudflare integration
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
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[product-screenshot]: public/images/screenshot.png