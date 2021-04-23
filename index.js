var http = require('http');
var hostname = '127.0.0.1'; // point the local computer
var port = 8080;

const server = http.createServer(function (req, res) {
    const path = req.url;
    const method = req.method;
    if (path === '/products') {
        if (method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const products = JSON.stringify([
                {
                    name: "basket ball",
                    price: 5000
                }
            ])
            res.end(products);
        } else if (method === 'POST') {
            res.end("It is made!");
        }
    }
    res.end("Good Bye");

})

server.listen(port, hostname);

console.log('hj market server on!');