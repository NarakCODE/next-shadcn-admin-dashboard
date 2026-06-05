# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router dashboard built with TypeScript, React 19, Tailwind CSS v4, and shadcn-style UI components.

- `src/app/`: routes, layouts, and route-local components. Keep feature-specific UI beside its route in `_components/`.
- `src/components/`: shared components. Primitive UI components live in `ui/`; larger reusable features live in `features/`.
- `src/hooks/`, `src/lib/`, `src/stores/`, and `src/server/`: reusable hooks, utilities, client state, and server actions.
- `src/styles/`: theme presets and supporting styles.
- `src/scripts/`: maintenance scripts, including theme preset generation.
- `media/`: repository documentation images.

Use the `@/` alias for imports from `src`, for example `@/components/ui/button`.

## Build, Test, and Development Commands

- `npm install`: install dependencies and configure Husky hooks.
- `npm run dev`: start the local development server at `http://localhost:3000`.
- `npm run build`: create a production build and catch Next.js/type integration errors.
- `npm run start`: serve the production build.
- `npm run lint`: run Biome lint checks.
- `npm run format`: format supported files with Biome.
- `npm run check` / `npm run check:fix`: run all Biome checks, optionally applying fixes.
- `npm run generate:presets`: regenerate `src/lib/preferences/theme.ts` from theme presets.

## Coding Style & Naming Conventions

Biome is the source of truth: use 2-space indentation, double quotes, semicolons, trailing commas, LF line endings, and a 120-character line width. Prefer strict TypeScript types over `any`, ES modules over CommonJS, and existing dependencies over new packages.

Use kebab-case filenames such as `date-range-picker.tsx`. React components use PascalCase; hooks use `use-*.ts`; route pages follow Next.js conventions (`page.tsx`, `layout.tsx`). Preserve accessibility, keyboard behavior, and established Tailwind/shadcn patterns.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. Before submitting changes, run `npm run check` and `npm run build`, then manually verify affected routes and responsive states. When adding tests, colocate them with the feature using `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines

Use concise conventional prefixes seen in history: `feat:`, `fix:`, and `chore:`. Keep commits focused. Husky regenerates theme presets and runs lint-staged checks before commits.

Pull requests should explain the change, reference related issues, and list verification performed. Include screenshots or recordings for visible UI changes, and ensure the branch is current with `main`.
