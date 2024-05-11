import http from 'http';

export class Proxy {
  constructor(port, hostname) {
    this.info = {port: port, hostname: hostname};
    this.options;
  }
  pipe(request, response) {
    this.options = {
      ...this.info,
      path: request.url,
      method: request.method,
      headers: request.headers
    }
    //this.options.headers.host = this.info.hostname + ":" + this.info.port
    const proxyRequest = http.request(this.options, function (proxyResponse) {
      response.writeHead(proxyResponse.statusCode, proxyResponse.headers)
      proxyResponse.pipe(response, {
        end: true
      });
    });
    request.pipe(proxyRequest, {
      end: true
    });
  }
}