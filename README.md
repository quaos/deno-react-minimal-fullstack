# deno-react-minimal-fullstack

//TODO:

## Requirements

* Needs to install [denopack](https://denopack.mod.land/)
```shell
deno run --allow-run --allow-read https://deno.land/x/denopack@0.9.0/install.ts
```
* Adds `~/.deno/bin` path to your system or user's `PATH` environment variable
```shell
# for *nix and MacOS
export PATH="${PATH};~/.deno/bin"

# for Windows
set PATH=%PATH%:%HOME%\.deno\bin
```
* Needs [denon](https://github.com/denosaurs/denon) for debugging/live reloading

## Back-end

### Environment vars
* ***APP_ENV:*** (dev|production)
* ***APP_PORT:***

### Running

```shell
# in /backend/
denon start

# or:
deno run --allow-env --allow-net --allow-read main.ts
```

## Front-end:

### Environment vars
* ***APP_PORT:***
* ***BACKEND_BASE_URL:***

### Building and running

```shell
# in /frontend/
denon start

# or:
denopack -c denopack.config.ts \
&& deno run --allow-env --allow-net --allow-read --allow-run main.ts --browse serve
```
