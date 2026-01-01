# Prompt Guide: Cloudflare Edge Commander

Follow these guidelines to ensure consistency and adherence to the **Platinum Standard**.

## 1. Core Instructions

- **Framework**: Next.js App Router with Wrangler integration.
- **Styling**: EXCLUSIVELY use **TailwindCSS** + **Daisy UI**. Avoid custom CSS unless absolutely necessary.
- **Deployment**: Design for **Cloudflare Pages Static Sites**. No server-side dynamic routing that requires a node server.
- **Language**: Support `en` and `zh`. All text keys must be added to `src/i18n/translations.ts`.

## 2. Component Design (Platinum UI)

- **Containers**: Use `bg-white border border-slate-200 rounded-4xl shadow-xl shadow-slate-200/40`.
- **Inner Cards**: Use `bg-slate-950 rounded-2xl border border-slate-800` for data/code displays.
- **Buttons**: `h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest`.
- **Inputs**: `rounded-2xl border-slate-200 h-14`.
- **Headers**: `font-black text-slate-900 uppercase tracking-tight`.

## 3. Development Rules

- **Zone-Centricity**: Features **MUST** be based on the selected zone. UI must update dynamically when `selectedZoneName` or `zoneId` changes.
- **Naming**:
  - Main feature components: `src/components/views/[Name]View.tsx`.
  - Props usage: Always destructure `{ state, utils }`.
- **Logic**:
  - Use `state.addLog(msg, 'success'|'info'|'error')` for all operation feedback.
  - Implement IPv6 mapping logic by expanding, reversing, and dot-separating nibbles before appending `.ip6.arpa`.

## 4. Template for Future Features

> Use the following "Platinum" prompting pattern:
>
> "Develop the [FeatureName]View component.
>
> 1. **Component**: Create `src/components/views/[FeatureName]View.tsx`.
> 2. **Design**: Use Tailwind + DaisyUI, following the 'Platinum Standard' (rounded-4xl, Slate/White contrast).
> 3. **Context**: Ensure it is dynamically scoped to the selected Cloudflare Zone.
> 4. **Translation**: Register all UI labels in `src/i18n/translations.ts` for both `en` and `zh` before implementation.
> 5. **Props**: Consume `{ state, utils }` and use `utils.fetchCF` for API calls."

## 5. Maintenance Checklist

- Always verify `npm run lint`.
- Ensure new folders/files follow the established camelCase/PascalCase naming.
- Check that all dynamic updates are reflected in the `Process Monitor` via `addLog`.
