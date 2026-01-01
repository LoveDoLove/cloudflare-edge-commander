# Project Analysis: Cloudflare Edge Commander

## Technical Stack

- **Framework**: Next.js (App Router) with Wrangler / OpenNext
- **Styling**: TailwindCSS + Daisy UI
- **Deployment**: Cloudflare Pages
- **Language Support**: Multi-language (EN, CN) localized via `src/i18n/translations.ts`
- **Architecture**: Component-based views residing in `src/components/views/`
- **State Management**: Utils and state passed as props to view components

## Core Features & Logic

- **Cloudflare Management**: Zones, DNS records, SSL/CA settings.
  - Mapping visualization.
- **Subnet Intelligence Lab**:
  - IPv4/IPv6 CIDR calculations.
  - Interactive mask and range feedback.
- **Global Security (Quick-Sec)**:
  - "Nuclear" button for instant Under Attack mode elevation across all zones.
- **Logging**: Client-side execution logs streamed to a console component.

## File Organization Patterns

- **Views**: `src/components/views/[Name]View.tsx` (e.g., `NetworkLabView.tsx`, `EdgeManagerView.tsx`, `SubnetLabView.tsx`)
- **Overlays**: `src/components/Overlays.tsx` for modal-like interactions.
- **Hooks**: `src/hooks/useCloudflareManager.ts` for API interaction logic.
- **Translations**: Centralized in `src/i18n/translations.ts`.

## Design Principles (Platinum Standard)

- **Aesthetics**: High-contrast, modern UI (Tailwind 4.0+ style), glassmorphism, and bold typography.
- **Typography**: Heavy use of `font-black`, `uppercase`, and `tracking-widest`.
- **Components**: Rounded corners (`rounded-4xl`, `rounded-2xl`), subtle shadows, and micro-animations (`animate-in`).

## Deployment Context

- Designed for Cloudflare Pages.
- Static assets handled by OpenNext.
- Sever-side logic in `functions/api/cloudflare.ts`.
