# Just Another Personal Budget
A Vue 3 personal budget app.

> **NOTES** 
> - This Project using "pnpm" as package manager. (not npm or yarn)!!! 

## Features
- [x] 💨 [Tailwind CSS v4](https://tailwindcss.com/)
- [x] ✨ [Headless UI](https://headlessui.dev/)
- [x] 🔔 [Icon Pack Component (unplugin-icons)](https://icones.js.org/)
- [x] 🛹 [State & Store Management (Pinia)](https://pinia.vuejs.org/)
- [x] 🚩 [Localization (i18n) by @intlify](https://github.com/intlify/nuxt3) & Auto Generate Locales
- [x] 📦 [Vue Composition Collection (Vueuse)](https://vueuse.org/)
- [x] 📚 Vue Router pages and layouts
- [x] 🌙 Switch Theme (light, dark, system, realtime)
- [x] 🇮🇩 Language Switcher
- [x] Eslint & Prettier
- [x] Husky & Commitlint
- [x] Built-in Unit Test
- [x] Configurable Theme
  - [x] Primary Colors
  - [x] Font

## To Do
- Summary [ ]
  - Accounts [ ]
    - Display Accounts with balances [x]
    - When clicked should display the account transaction [ ]
  - Transactions [ ]
    - Transactions List [ ]
      - List Transactions [x]
      - Filter By Date [ ]
    - Transactions Create
      - Base Create [x]
      - Create with Items
    - Transactions Update [ ]
      - Base Update [x]
      - Update Items [ ]
    - Transactions Delete [x]

Summary will eventually be the dashboard

## Table of Contents
- [Nuxt 3 Awesome Starter](#nuxt-3-awesome-starter)
  - [Features](#features)
  - [To Do](#to-do)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
    - [Start with this template](#start-with-this-template)
    - [Deploy as Static Site](#deploy-as-static-site)
  - [Built-in Components](#built-in-components)
  - [Notes](#notes)
    - [Nuxt Content](#nuxt-content)
    - [Custom Workspace Snippets](#custom-workspace-snippets)
    - [Styles](#styles)
    - [Theme (Dark Mode)](#theme-dark-mode)
    - [Localization](#localization)
    - [Generate Locales](#generate-locales)
    - [Icons](#icons)
    - [Precommit and Postmerge](#precommit-and-postmerge)
  - [License](#license)

## Quick Start
### Start with this template
* This project using `pnpm` as package manager.
* Clone this project to your computer `git clone https://github.com/PedGarBlue/another-personal-budget-app`
* Install dependencies `pnpm install --shamefully-hoist`
* Run `pnpm dev` to start development server and open `http://localhost:3000` in your browser
### Deploy as Static Site
* Run `pnpm build` to build the project
* Serve the `dist/` folder (`pnpm start`)

### Precommit and Postmerge
This project using husky and commitlint for precommit and postmerge.
when you commit, it will check your commit message and running "pnpm lint-staged" to check your staged files.
configuration in : `/path/to/.husky/pre-commit` and `/path/to/commitlint.config.js`

And when Postmerge, it will run "pnpm" to automatically install new dependencies.
configuration in `/path/to/.husky/post-merge`

## License
This project is licensed under the MIT license, Copyright (c) 2022 Alfian Dwi Nugraha. For more information see the [LICENSE](LICENSE.md) file.
