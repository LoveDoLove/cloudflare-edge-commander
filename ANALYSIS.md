# Analysis: Cloudflare Edge Commander

This project is a high-performance, refined management interface for Cloudflare services, establishing the **Platinum Standard**.

## 1. Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router) + [Wrangler](https://developers.cloudflare.com/workers/wrangler/).
- **Design**: [TailwindCSS](https://tailwindcss.com/) + [Tailwind Daisy UI](https://daisyui.com/).
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) (Static Sites).
- **Internationalization**: Centralized `src/i18n/translations.ts` supporting `en` (English) and `zh` (Chinese/CN).
- **Backend Communication**: API Proxy via Cloudflare Worker Functions (`functions/api/`).

## 2. Core Architecture

- **State Management**: Root `useCloudflareManager.ts` hook providing a unified `state` and `utils` object.
- **View Pattern**: Features are isolated in `src/components/views/` (e.g., `SubnetLabView.tsx`).
- **Dynamic Context**: All features are **Zone-Specific**. Functionality depends on the `selectedZoneName` and must update dynamically when changed.
- **Naming Convention**: Folder and FileNames use standard PascalCase/camelCase for maintainability (Suffix `View.tsx` for main feature components).

## 3. Design DNA (Platinum Standard)

- **Aesthetics**: High-contrast, premium industrial design.
- **Typography**: `font-black`, `uppercase`, `tracking-widest`.
- **Layout**: `rounded-4xl` primary containers, `rounded-2xl` inputs/buttons. High use of Slate/Gray scales with glassmorphism.
- **Animations**: Subtle entry animations (Fade-in, Side-in-from-bottom).

## 4. Specific Logic Patterns

- **IPv6 Intelligence**: Implementation of IPv6 nibble-reversal for `ip6.arpa` domains.
  - _Example_: `2001:470:24:5dd::/64` -> `d.d.5.0.4.2.0.0.0.7.4.0.1.0.0.2.ip6.arpa`.
- **Zone Focus**: All features (DNS, SSL, CA, Tunnels) must verify zone selection and scope requests to that zone.

## 5. Maintenance Guardrails

- **Zero Hardcoding**: All UI text MUST be in `translations.ts`.
- **Static Integrity**: Features must remain compatible with Cloudflare Pages' static export constraints.
