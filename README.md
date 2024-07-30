# Lantern Tabletop

Lantern is a web-based project aiming to create a flexible, open source alternative to online virtual tabletops such as Roll20 and D&D Beyond. It is currently in early development.

## Requirements

This project requires a [NodeJS](https://nodejs.org/en) v20+ environment, a PostgreSQL database server, and the PNPM package manager.

If you have NVM installed, it will automatically pick the correct Node version due to the `.nvmrc` file in the project root.

PNPM will automatically be installed on most machines on first use via Node's corepack. Run `corepack enable` at least once to enable it. See [exceptions](#exceptions).

## Getting Started

Clone the project from the remote. Next, from the root of the project, run `pnpm install` to install all dependencies.

Start your database either with a standalone [PostgreSQL](https://www.postgresql.org/download) server or using [Docker](https://docs.docker.com/get-docker) with the commands `cd deploy/local` and `docker compose up -d`.

If you are using a standalone Postgres server, you will need make sure your Host, DB Name, DB User, and Password all match between your server and the environment variables defined in `env.development`.

If this is your first time running in development mode, run `pnpm run migrate` to run initial database migrations. From there, running `pnpm run dev` will start the project.

## Building

The project can be built with `pnpm run build` (as long as all dependencies are installed). Run the build with `pnpm run start`. You will need a `.env.production.local` file to run a local production build. It's secrets can be copied from the .env.development file or be actual production secrets.

## Testing

The project can be end-to-end tested with `pnpm run test:e2e` (database needs to be running and migrated), unit tested with `pnpm run test:e2e`, or tested with a full suite using `pnpm run test`. You can type check all typescript files without running a full build with `pnpm run typecheck`.

Your first end-to-end test run requires `pnpm exec playwright install` to be run first to install dependencies (headless web browsers).

## Built With

- TypeScript
- React
- NextJS
- TailwindCSS
- PostgresSQL
- Kysely
- Lucia Auth
- GraphQL
- PNPM

# Additional Documentation

Additional markdown project documentation for this project is available in `/docs`. The project documentation is in the [Johnny Decimal System](https://johnnydecimal.com).

# Exceptions

## NixOS

While you can install Node manually on [NixOS](https://nixos.org) through your nix configuration or home-manager, corepack will not work and PNPM will also need to be installed that way manually. An alternative and better solution is to use the command `nix-shell` from root to spin up a local Node development environment temporarily that comes with the right version of Node and PNPM.

# Authors

- **Lucy Awrey** - [lucyawrey](https://github.com/lucyawrey)
- **Laura Wenning** - [laura-wenning](https://github.com/laura-wenning)
