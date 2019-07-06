const isProd = false || process.env === "production";

export const config = {
  API_ENDPOINT: isProd
    ? "https://kanga.uice.lu/api"
    : "http://192.168.5.118:8080/api"
};
