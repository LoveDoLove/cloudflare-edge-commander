# Prompt Guide: Cloudflare Edge Commander

Use this guide to ensure all future AI interactions adhere to the **Platinum Standard** of this project.

## 1. Core Implementation Rules

### Technology & Framework

- **Framework**: Only use Next.js App Router patterns.
- **Styling**: Use **TailwindCSS** + **Daisy UI**.
- **Deployment**: Must be compatible with Cloudflare Pages static site deployment.

### Development Standards

- **Translations**: NEVER hardcode text.
  1. Add translations to `src/i18n/translations.ts` for both `en` and `zh`.
  2. Access via `state.t.key`.
- **Component Naming**:
  - Main feature blocks: `src/components/views/[FeatureName]View.tsx`.
  - Reusable parts: `src/components/[Name].tsx`.
- **State Pattern**:
  - View components receive `{ state, utils }`.
  - Use `state.addLog(msg, 'success'|'info'|'error')` for system feedback.
  - Update local state only for UI toggles; global data belongs in the hook.

## 2. Design DNA (Platinum UI)

### Typography

- **Headers**: `font-black text-slate-900 uppercase tracking-tight`.
- **Labels**: `text-[10px] font-black uppercase text-slate-600 tracking-wider`.
- **System Text**: Use `font-mono font-bold` for IPs, IDs, and hashes.

### Aesthetics

- **Main Cards**: `bg-white border border-slate-200 rounded-4xl shadow-xl shadow-slate-200/40`.
- **Data Cards**: `bg-slate-950 rounded-2xl border border-slate-800`.
- **Interactive**: Buttons should be `rounded-2xl font-black uppercase text-[10px] tracking-widest h-14`.

## 3. Specific Logic Requirements

### IPv6 Reverse Mapping (`ip6.arpa`)

When implementing IPv6 tools, follow the standard reverse mapping:

- Target: `d.d.5.0.4.2.0.0.0.7.4.0.1.0.0.2.ip6.arpa`
- Example Logic:
  1. Expand IPv6 to full 32-hex nibbles.
  2. Reverse the nibbles.
  3. Dot-separate each nibble.
  4. Append `.ip6.arpa`.

### Zone Dynamics

- Features must react dynamically to the `selectedZoneName`.
- If no zone is selected, display a "System Idle" or "Select Zone" state.

## 4. Prompt Template for New Views

When requesting a new feature, use this structure:

> "Implement a new [FeatureName]View component.
>
> 1. **Location**: Create `src/components/views/[FeatureName]View.tsx`.
> 2. **UI**: Apply the Platinum Standard using Tailwind + DaisyUI (rounded-4xl containers, high contrast).
> 3. **Logic**: Integrate with the existing `state` and `utils` objects.
> 4. **Translations**: Update `src/i18n/translations.ts` with labels for [List of labels].
> 5. **Reference**: Mirror the layout patterns found in `SubnetLabView.tsx`."

## 5. Maintenance Checklist

- Ensure `src/i18n/translations.ts` remains alphabetical or categorized by view.
- Always include both English and Chinese translations.
- Run `npm run lint` before finalizing code.
