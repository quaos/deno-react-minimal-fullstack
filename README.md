# deno-react-minimal-fullstack

## Requirements

* Deno version: ^1.7.0
* Adds `~/.deno/bin` path to your system or user's `PATH` environment variable
```shell
# for *nix and MacOS
export PATH="${PATH};~/.deno/bin"

# for Windows
set PATH=%PATH%:%HOME%\.deno\bin
```
* Needs [denon](https://github.com/denosaurs/denon) for debugging/live reloading

## Structure

* `backend/` - backend components
* `common/` - shared scripts & source files, ex. model definitions
* `frontend/` - frontend components

## Back-end

### Environment vars
* ***APP_ENV:*** (dev|production)
* ***APP_HOST:*** (default: `0.0.0.0`)
* ***APP_PORT:*** (default: `8080`)
* ***APP_FRONT_URL:*** (default: `http://localhost:3000/`)
* ***APP_FRONT_ORIGIN:*** Origin for CORS (default: `http://localhost:3000`)

### Running

```shell
yarn backend

# or:
# in /backend/
deno run --allow-env --allow-net --allow-read main.ts

# or for live-reload:
# in /backend/
denon start
```

## Front-end

### Building and running

```shell
yarn frontend

# or:
# in /frontend/
deno run --allow-env --allow-net --allow-read --allow-run main.ts -- build \
&& deno run --allow-env --allow-net --allow-read --allow-run main.ts -- --browse serve

# or for live-reload:
# in /frontend/
denon start
```
