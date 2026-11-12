# Antigravity AI Project Rules - Kuis Budaya Sunda (4-Developer Team)

When generating or editing code for this project, you MUST strictly adhere to:

1. ZERO OVERLAP ARCHITECTURE:
   - NEVER modify or overwrite `src/App.tsx` when creating feature components.
   - All feature components must be self-contained and isolated within their designated feature folders (`src/components/landing/`, `src/components/gameplay/`, `src/components/result/`, `src/components/ui/`, etc.).
   - Only modify `src/App.tsx` when explicitly requested to perform the final app-level wiring / integration.

2. STRICT TYPESCRIPT COMPLIANCE:
   - Strictly adhere to data contracts defined in `src/types/quiz.ts`.
   - Never use `any`. Always use explicit typing and type-only imports where appropriate (`import type { ... }`).

3. GAMIFIED & VIBRANT UI:
   - Use Tailwind CSS with modern gamified styling (vibrant color palettes: emerald, amber, violet, slate-900 background, rounded-2xl / rounded-3xl cards, active 3D press buttons).
   - Ensure complete responsiveness across mobile and desktop devices.

4. BUILD SAFETY:
   - Code must always pass `npm run build` (`tsc -b && vite build`) with zero TypeScript errors and zero unused variable warnings.
