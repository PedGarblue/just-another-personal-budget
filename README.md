# Just Another Personal Budget

A personal budget app. Vue 3, Vite, and Tailwind CSS 4. It talks to a REST API configured with `VITE_API_URL`.

Use [pnpm](https://pnpm.io/).

## Features

- Accounts, transactions, expenses, cashflow, and category trends on the dashboard
- Reports by account and by currency
- Investments (receivables)
- Expense sharing with partners, settlement, and history
- Purchase budgets
- Sign in and sign up, with access-token refresh
- Light, dark, system, and realtime themes
- English and Spanish (vue-i18n)
- [Lucide](https://lucide.dev/) icons, [Pinia](https://pinia.vuejs.org/), [VueUse](https://vueuse.org/), [Headless UI](https://headlessui.com/), and Chart.js
- ESLint, Prettier, Husky, and Commitlint

## Quick start

Copy [`.env.example`](.env.example) to `.env` and set the API the app should call:

```
VITE_API_URL=http://localhost:8000/api/v1
```

```bash
pnpm install
pnpm dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000). Dashboard routes require a signed-in user.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Production build into `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm start` | Serve `dist/` on port 3000 |
| `pnpm lint` | Lint |
| `pnpm typecheck` | Typecheck with `vue-tsc` |

Commits run lint-staged and Commitlint through Husky.

## License

MIT. Copyright (c) 2022 Alfian Dwi Nugraha. See [LICENSE.md](LICENSE.md).
