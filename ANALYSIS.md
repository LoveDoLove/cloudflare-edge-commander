# Analysis: Cloudflare Edge Commander

This project is a high-performance, refined management interface for Cloudflare services, referred to as the **Platinum Standard**.

## 1. Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router) + [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare Pages).
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [Daisy UI](https://daisyui.com/).
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) (Static/Hybrid).
- **Internationalization**: Centralized `src/i18n/translations.ts` supporting `en` and `zh`.
- **Backend Communication**: API Proxy via `functions/api/cloudflare.ts`.

## 2. Core Architecture

The application follows a **Provider/View pattern**:

- **Main Hook**: `useCloudflareManager.ts` manages all global state, Cloudflare API orchestration, and logic.
- **View Pattern**: Each feature is a separate component in `src/components/views/` (e.g., `SubnetLabView.tsx`).
- **Data Flow**: The root `page.tsx` passes a `state` object and a `utils` object to all view components.
  - `state`: Contains `t` (translations), `logs`, `activeTab`, and Cloudflare data (`zones`, `dnsRecords`, etc.).
  - `utils`: Contains helper functions (e.g., `cidrToMask`, `fetchCF`, `addLog`).

## 3. Design DNA (Platinum Standard)

The UI is designed to feel premium, futuristic, and industrial:

- **Typography**: Heavily utilizes `font-black`, `uppercase`, and `tracking-widest`.
- **Colors**: High-contrast (Slate 950/900 for dark elements, pure white/slate-50 for light).
- **Components**:
  - `rounded-4xl` for primary containers.
  - `rounded-2xl` for inputs and buttons.
  - Glassmorphism and subtle shadows (`shadow-xl shadow-slate-200/40`).
- **Animations**: Framer-motion style entry (`animate-in fade-in slide-in-from-bottom-6`).

## 4. Feature Logic Patterns

- **IPv6 Intelligence**: Implementation logic for converting IPv6 to `ip6.arpa` domains and CIDR calculations.
- **Reverse Mapping Example**:
  - Input: `2001:470:24:5dd::/64`
  - Domain Mapping: `d.d.5.0.4.2.0.0.0.7.4.0.1.0.0.2.ip6.arpa`
- **Zone Focus**: All management features (DNS, SSL, CA, Tunnels) are dynamically scoped to the `selectedZoneName`.

## 5. Deployment & Maintenance

- **Static First**: Designed to run as a static site on Cloudflare Pages.
- **Dynamic Updates**: Client-side re-fetching when `zoneId` changes.
- **Standardized Naming**: All view files must suffix with `View.tsx`.
- **Translation Guardrails**: Hardcoded strings are strictly forbidden.
