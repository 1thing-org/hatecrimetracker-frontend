// Pick the API endpoint based on the build environment so `npm start`
// (development) hits the local backend on port 8088, while `npm run build`
// (production) hits the deployed API. An explicit REACT_APP_API_ENDPOINT
// env var overrides everything for one-off deployments.
//
// IMPORTANT: CRA's webpack replaces `process.env.NODE_ENV` and
// `process.env.REACT_APP_*` with literal strings at build time. It does
// NOT polyfill `process` as an object in the browser bundle, so do not
// guard these reads with `typeof process !== "undefined"` — that guard
// is false at runtime and would silently fall through to the production
// endpoint even in dev.
//
// Local backend port matches /1-start-backend.command (8088).
const PROD_API = "https://api.hatecrimetracker.1thing.org";
const LOCAL_API = "http://127.0.0.1:8088";

const overrideEndpoint = process.env.REACT_APP_API_ENDPOINT;
const isDev = process.env.NODE_ENV === "development";

const appConfig = {
    api_endpoint: overrideEndpoint || (isDev ? LOCAL_API : PROD_API),
};

export default appConfig;
