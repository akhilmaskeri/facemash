const proxy = require('http-proxy-middleware');
const BACKEND = process.env.BACKEND
const MINIO   = process.env.MINIO_ENDPOINT
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/init',
    createProxyMiddleware({
      target: `http://${BACKEND}:8000`,
      changeOrigin: true,
    })
  );

  app.use(
    '/imgs*',
    createProxyMiddleware({
      target: `http://${BACKEND}:8000`,
      changeOrigin: true,
    })
  );

  app.use(
    '/hit*',
    createProxyMiddleware({
      target: `http://${BACKEND}:8000`,
      changeOrigin: true,
    })
  );

  app.use(
    '/ranking*',
    createProxyMiddleware({
      target: `http://${BACKEND}:8000`,
      changeOrigin: true,
    })
  );

  app.use("/facemash/*",
  createProxyMiddleware({
    target: `http://${MINIO}:9000`,
    changeOrigin: true,
  }))

};
