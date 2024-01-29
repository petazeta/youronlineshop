Files deliver service
=====================

# Introduction

This service purpouse is responding to the requests that require files.

# Files that can be requested

These are the files that can be requested:

- Site index.html (/, /index.html)
- Site images (/images)
- Css images (/css-images)
- Js scripts (/client, /shared)
- Catalog images (/catalog-images)

We have added the base paths that needs to be requested for these files.

# File streaming

File streaming service gets the file path and send the files content to the browser. File "streamfile.mjs".

# Service scripts

We start the service at the entrance module "index.msj". The service is selected when no other service is requested (default). The "fileserver.mjs" module checks which kind of the exposed files requests is required, then it calculates the file path and uses filestreaming module to send the content to the browser.

At [httpfileserver.md](httpfileserver.md) there is a detailed explanation of the streaming process.