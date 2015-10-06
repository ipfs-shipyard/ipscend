ipsurge
=======

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs) ![](https://img.shields.io/badge/coverage-%3F-yellow.svg?style=flat-square) [![Dependency Status](https://david-dm.org/diasdavid/ipsurge.svg?style=flat-square)](https://david-dm.org/diasdavid/ipsurge) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Quick and simple deploy tool to host Native Web Applications and Static Web Pages in IPFS

## Usage

Install via npm

```
$ npm install ipsurge --global
```

Run the CLI to show the available commands

```
$ ipsurge
Usage: ipsurge COMMAND [OPTIONS]

Available commands:

browse      Open your application in a browser
init        Initialize a ipsurge project
preview     Preview your application before you publish it
publish     Publish your project
screenshot  View or generate screenshots for your application
versions    Check each version published
```

### commands

#### `ipsurge init`

Initializes your project. Asks for a folder of where the web application will be available and stores a ipsurge.json object in your current path to store all the meta data it generates, such as versions published and screenshots taken.

#### `ipsurge publish`

Publishes the current state of your application to IPFS and stores a reference to it.

**note:** You have to have a local IPFS node running in order to publish, check below hot to get your local IPFS node running

#### `ipsurge versions`

Prints out the published versions for the app and their respective timestamp

#### `ipsurge browse`

Opens in the browser the last version published of your application.

#### `ipsurge screenshot`

Opens a screenshot preview of all the published versions of your app. In order to generate the screenshots, you must first run `ipsurge screenshot --gen`

**note:** In order to use this feature, you must set `API_ORIGIN=*` as an environment variable before running your IPFS node

#### `ipsurge preview`

Serves your application on a local static file server to try it out before you feel ready to publish it.

## How to get an IPFS node running in your local machine

There are two best ways to run a IPFS node in your personal computer:

- [Using the IPFS application based on electron](https://github.com/ipfs/electron-app)
- [Installing the go-ipfs node in your machine](http://ipfs.io/docs/install)

## Use IPFS to host your webpage using a standard domain (includes cool DNS trick!)

If you are looking into having your application accesible through `youdomain.com`, instead of referencing it by a `/ipfs/hash`, we have a solution for you.

Every IPFS node HTTP interface checks the host header when it receives a request from a browser, then it performs a DNS lookup for a TXT Record, looking if there is any MerkleLink available, if there is, it will perform the lookup, cache that path and serve it as if it was a static webserver.

To make this work, simply:

- 1. Publish your application using `ipsurge publish`
- 2. Save the hash returned
- 3. Pick one of the public IPFS nodes IP addresses
```
$ dig +short ipfs.io
178.62.61.185
178.62.158.247
104.236.76.40
104.236.151.122
104.236.176.52
104.236.179.241
128.199.219.111
162.243.248.213
```
- 4. Go into your DNS provider and add a A record of yourdomain.com pointing to ipfs.io and a TXT record with dnslink=<hash returned in step 2>
- 4. Wait a little bit for DNS to propagate
- 5. open yourdomain.com and see that your page was loaded! 

Voilá, your page is now cached and being served by IPFS

note: you can also host your own IPFS nodes and use the same DNS trick.
