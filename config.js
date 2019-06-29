const isProd = false || process.env === "production";

export const config = {
  API_ENDPOINT: isProd
    ? "https://kanga.uice.lu/api"
    : "http://localhost:8080/api"
};
