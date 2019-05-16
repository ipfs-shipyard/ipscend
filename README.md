# Deprecation Notice

This module will no longer be maintained :sadface:. **The Good news is that @agentofuser made a 1000x better implementation of what this module was meant to be** 🚀. Check it out:

- [Module](https://www.npmjs.com/package/@agentofuser/ipfs-deploy)
- [Tutorial](https://interplanetarygatsby.com/ipfs-deploy/)


----------------------------------------------------------
----------------------------------------------------------

ipscend
=======

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs) ![](https://img.shields.io/badge/coverage-%3F-yellow.svg?style=flat-square) [![Dependency Status](https://david-dm.org/diasdavid/ipscend.svg?style=flat-square)](https://david-dm.org/diasdavid/ipscend) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Web Application publishing, simple and distributed with IPFS 

## Usage

Install via npm

```
$ npm install ipscend --global
```

Run the CLI to show the available commands

```
$ ipscend
Usage: ipscend COMMAND [OPTIONS]

Available commands:

browse      Open your application in a browser
init        Initialize a ipscend project
ipfs start  Start your a local IPFS node
preview     Preview your application before you publish it
publish     Publish your project
screenshot  View or generate screenshots for your application
versions    Check each version published
```

### commands

#### `ipscend browse`

Opens the last published version of your application in the browser.

#### `ipscend init`

Initializes your project. Asks for the folder where the web application will be available and stores an `ipscend.json` object in your current path to store all the metadata it generates, such as published versions and taken screenshots.

#### `ipscend ipfs start`

Start and init an IPFS node (in case you don't want to install and run IPFS yourself)

#### `ipscend preview`

Serves your application on a local static file server, so that you can try it out before you feel ready to publish it.

#### `ipscend publish`

Publishes the current state of your application to IPFS and stores a reference to it.

**Note:** You have to have a local IPFS node running in order to publish, check below for how to get your local IPFS node running.

#### `ipscend screenshot`

Opens a screenshot preview of all the published versions of your app. In order to generate the screenshots, you must first run `ipscend screenshot --gen`.

![](http://zippy.gfycat.com/TameDampKob.gif)

**Note:** The webapp used for this is [ipscend-screenshot-visualizer](https://github.com/diasdavid/ipscend-screenshot-visualizer).

#### `ipscend versions`

Prints out the published versions for the app and its respective timestamp.

**Note:** In order to use this feature, you must set `API_ORIGIN=*` as an environment variable before running your IPFS node.

## Use IPFS to host your webpage using a standard domain (includes cool DNS trick!)

If you are looking into having your application accesible through `youdomain.com`, instead of referencing it by a `/ipfs/hash`, we have a solution for you.

Every IPFS node HTTP interface checks the host header when it receives a request from a browser, then it performs a DNS lookup for a TXT Record, looks if there is any MerkleLink available, and, if there is, it performs a lookup, caching that path and serving it as if it was a static webserver.

To make this work, simply:

1. Publish your application using `ipscend publish`.
2. Save the returned hash.
3. Find the IPFS ip addresses using `$ dig ipfs.io`. Example: 
	
	```sh
	$ dig +short ipfs.io
	178.62.61.185
	178.62.158.247
	104.236.76.40
	...
	```
4. Decide which domain or subdomain will host your IPFS application. We're going to use `ipfs.yourdomain.com`
5. In the DNS administration for your domain, add an A record for each of the ipfs.io IPs addresses. Example:
	```
	yourdomain.com

	ipfs     A     178.62.61.185
	ipfs     A     178.62.158.247
	ipfs     A     104.236.76.40
	...
	```
	If you're using the root domain, your DNS rules should look like:
	```
	yourdomain.com

	@        A     178.62.61.185
	@        A     178.62.158.247
	@        A     104.236.76.40
	...
	```
6. Next, the cool DNS trick. Add a TXT record with the hash of your IPFS application.
	Example:
	```
	yourdomain.com

	ipfs     TXT     dnslink=/ipfs/QmXkbSsxHZZniJ1rd5y7cJsDYyRKkcYeoEsN7p4PUq799L
	```
7. Wait a little bit for DNS to propagate.
8. Open `ipfs.yourdomain.com` and see that your page was loaded!

Voilá, your page is now cached and is being served by IPFS.

**Note: You can also host your own IPFS nodes and use the same DNS trick.**

### Automate the DNS TXT Record update with `dnslink` tool

`dnslink-deploy` is a simple tool that lets you update your TXT records to the latest hash, if you happen to be using Digital Ocean's nameservers. To update it using the tool, simply run:

```
dnslink-deploy -d yourDomain -r @ -p /ipfs/QmeQT76CZLBhSxsLfSMyQjKn74UZski4iQSq9bW7YZy6x8
```

To learn more about how the tool works, visit https://github.com/ipfs/dnslink-deploy and to learn how to set up your domain with Digital Ocean's name servers, go to: https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars
