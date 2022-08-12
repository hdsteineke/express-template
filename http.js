const http = require('node:http');
//creates turns your computer into an http server
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);


  const paths = req.url.split('/');
  const path = paths[paths.length - 1];
  console.log('resource is', path);

  //defining resources by their pathways, and throwing an error if they don't exists
  // ?? is this what needs to be in place for app.js to recognize listed routes?
  const resource = routes[path];
  if (!resource) {
    res.end('not found');
    return;
  }
  // ?? is this setting up permissions to send requests/responses for resources in the app?
  const route = resource[req.method];
  if (route) {
    route(req, res);
  }
});
//listens to ports on the computer an executes a function each time a request is made
// Can 3500 be another port if I want it to be?
server.listen(3500, () => {
  console.log('server started', server.address());
});

//is this telling the server which routes to listen to?
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