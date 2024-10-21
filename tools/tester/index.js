const { createServer } = require('http');
const { parse } = require('url');

const defaultHeaders = {
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Expose-Headers': 'Content-Length',
    'Access-Control-Allow-Headers': 'Accept, Authorization, Content-Type, X-Requested-With, Range'
};
const [, , port = 1235] = process.argv;

createServer((request, response) => {
    if (request.method.toUpperCase() === 'OPTIONS') {
        console.info('> CORS preflight');
        response.writeHead(204, defaultHeaders);
        response.end();
        return;
    }

    const { pathname } = parse(request.url);
    const appId = pathname.replace('/', '');

    if (!/^PX/.test(appId)) {
        console.info('> Could not find app id');
        response.writeHead(
            400,
            Object.assign(
                { 'Content-Type': 'text/plain' },
                defaultHeaders
            )
        );
        response.write(`Request must include your app id: 'http://localhost:${port}/PXxxxxxxxx'`);
        response.end();
        return;
    }

    console.info('> Blocked request');
    response.writeHead(
        403,
        Object.assign(
            { 'Content-Type': 'application/json' },
            defaultHeaders
        )
    );
    const body = JSON.stringify({
        appId,
        jsClientSrc: `https://client.px-cdn.net/${appId}/main.min.js`,
        firstPartyEnabled: false,
        vid: '2b99ec08-3a22-49f0-a289-a4a6c330b059',
        uuid: '610a4a35-c45f-4cae-bc58-5abac3a4cdcd',
        hostUrl: 'https://www.website.net',
        blockScript: `https://captcha.px-cdn.net/${appId}/captcha.js`
    });
    response.write(body);
    response.end();
}).listen(parseInt(port, 10), '127.0.0.1');

console.info(`Tester server lisening on http://127.0.0.1:${port}/PXxxxxxxxx <=[replace with your app ID]`);
