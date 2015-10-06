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

browse    Open your application in a browser
init      Initialize a ipsurge project
preview   Preview your application through a collection of snapshots
publish   Publish your project
versions  Check each version published
```

### commands

#### ipsurge init

#### ipsurge publish

> **You have to have a local IPFS node running in order to publish**, check below hot to get your local IPFS node running

#### ipsurge versions

#### ipsurge publish

#### ipsurge browse

#### ipsurge preview

note: `API_ORIGIN=*`

## How to get an IPFS node running in your local machine

There are two best ways to run a IPFS node in your personal computer:

- [Using the IPFS application based on electron](https://github.com/ipfs/electron-app)
- [Installing the go-ipfs node in your machine](http://ipfs.io/install)

## Use IPFS to host your webpage using a standard domain (includes cool DNS trick!)

If you are looking into having your application accesible through `youdomain.com`, instead of referencing it by a `/ipfs/hash`, we have a solution for you.

Every IPFS node HTTP interface checks the host header when it receives a request from a browser, then it performs a DNS lookup for a TXT Record, looking if there is any MerkleLink available, if there is, it will perform the lookup, cache that path and serve it as if it was a static webserver.

To make this work, simply:

- 1. Publish your application using `ipsurge publish`
- 2. Save the hash returned
- 3. Go into your DNS provider and add a CNAME record of yourdomain.com pointing to ipfs.io and a TXT record with dnslink=<hash returned in step 2>
- 4. Wait a little bit for DNS to propagate
- 5. open yourdomain.com and see that your page was loaded! 

Voilá, your page is now cached and being served by IPFS

note: you can also host your own IPFS nodes and use the same DNS trick.
