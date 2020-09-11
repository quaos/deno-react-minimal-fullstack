# deno-react-minimal-fullstack

//TODO:

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
deno bundle src/main.tsx public/assets/js/main.bundle.js \
&& deno run --allow-env --allow-net --allow-read main.ts --browse serve
```
