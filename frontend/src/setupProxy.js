const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/init', { target: 'http://localhost:8000/' }));
  
};


const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/init',
    createProxyMiddleware({
      target: 'http://backend:8000',
      changeOrigin: true,
    })
  );

  app.use(
    '/imgs*',
    createProxyMiddleware({
      target: "http://backend:8000",
      changeOrigin: true,
    })
  );

  app.use(
    '/hit*',
    createProxyMiddleware({
      target: "http://backend:8000",
      changeOrigin: true,
    })
  );

  app.use(
    '/ranking*',
    createProxyMiddleware({
      target: "http://backend:8000",
      changeOrigin: true,
    })
  )

};
