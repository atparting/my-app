const { createProxyMiddleware } = require('http-proxy-middleware');
const server = 'http://localhost:8080'

module.exports = function(app) {
  app.use(createProxyMiddleware('/api', { target: server }));
  app.use(createProxyMiddleware('/ws', { target: server, ws: true }));
};