const http = require('node:http');

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);


  const paths = req.url.split('/');
  const path = paths[paths.length - 1];
  console.log('resource is', path);

  const resource = routes[path];

  if (!resource) {
    res.end('not found');
    return;
  }

  const route = resource[req.method];
  if (route) {
    route(req, res);
  }
});

server.listen(3500, () => {
  console.log('server started', server.address());
});

const routes = {
  users: {
    GET(req, res) {
      res.end('users GET');
    },
    POST(req, res) {
      res.end('users POST');
    },
  },
  planets: {
    GET(req, res) {
      res.end('tasks GET');
    },
    POST(req, res) {
      res.end('tasks POST');
    },
  },
};