# Prompt Engineering Guide: Cloudflare Edge Commander

To maintain the "Platinum Standard" of this project, follow these guidelines when prompting for new features or modifications.

## 1. Technical Requirements

- **Framework**: Use Next.js App Router patterns.
- **Styling**: Always use **TailwindCSS** + **Daisy UI**.
- **Naming**: Use `PascalCase` for components and `camelCase` for variables/functions. View components must end with `View.tsx`.
- **Translations**: Never hardcode text. Add keys to `src/i18n/translations.ts` and use `state.t.key`.
- **Static Site**: Ensure logic is compatible with Cloudflare Pages static/hybrid deployment.

## 2. Design DNA (Platinum UI)

- **Typography**:
  - Headers: `font-black text-slate-900 uppercase tracking-tight`.
  - Labels: `text-[10px] font-black uppercase text-slate-600 tracking-wider`.
  - Monospace: Use for IPs/Hashes with `font-mono font-bold`.
- **Containers**:
  - Use `bg-white border border-slate-200 rounded-4xl shadow-xl shadow-slate-200/40`.
  - Inner cards: `bg-slate-950 rounded-2xl border border-slate-800`.
- **Interactions**:
  - Buttons: `rounded-2xl font-black uppercase text-[10px] tracking-widest h-14`.
  - Animations: Use `animate-in fade-in slide-in-from-bottom-6 duration-500`.

## 3. Implementation Logic

- **IPv6 to ARPA Example**:
  - Input: `2001:470:24:5dd::/64`
  - Mapping: `d.d.5.0.4.2.0.0.0.7.4.0.1.0.0.2.ip6.arpa`
- **State Passing**: View components receive `{ state, utils }`. Use `state.addLog(msg, 'success'|'info'|'error')` for feedback.

## 4. Prompt Template for New Features

> "Create a new [FeatureName]View component.
>
> 1. Add [FeatureName] to `src/components/views/`.
> 2. Implement the UI using the Platinum Standard (Tailwind + DaisyUI).
> 3. Add necessary translations to `translations.ts` (EN/CN).
> 4. Ensure it handles [Specific Logic, e.g., IPv6 parsing] as seen in `NetworkLabView.tsx`.
> 5. Use the existing `state` and `utils` patterns."

## 5. Maintenance Rules

- Group related view files in `src/components/views/`.
- Keep `src/i18n/translations.ts` sorted/categorized.
- Reference `src/components/views/NetworkLabView.tsx` as the reference for complex logic & styling.
