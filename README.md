dweb-publish (previously known as ipscend)
============

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
![](https://img.shields.io/badge/coverage-%3F-yellow.svg?style=flat-square)
[![](https://david-dm.org/ipfs-shipyard/dweb-publish.svg?style=flat-square)](https://david-dm.org/ipfs-shipyard/dweb-publish)
[![](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Publish Websites and Web Applications to the DWeb using IPFS

## `dweb-publish` Description and Goals

Let's make publish to the DWeb super simple and fun ✨!

This project started as [`ipscend`](http://daviddias.me/blog/ipscend/) and it was a fun tool at the time to get Websites on the DWeb super quick. Things like DNSLink were still recent and IPFS itself didn't support multiple formats other than the MerkleDAG.

Today things are different! IPFS can now support other formats such as Git (so that you don't have to re-add files), it also has lot better APIs, the JS implementation is now fully interoperable with the Go implementation (no more need to run daemons separetly), APIs have improved a ton and there is also now dozens of Gateways and Pinning Services outthere for users to ensure that their Website stays in the network without having to run their own daemon.

It is time to revamp the project and improve it so that we achieve the big goal, making the act of publishing a Website to the DWeb incredibly simple, enjoyful and functional! Below you can find the rough roadmap of the steps ahead. Want to help? Join the effort by contributing to this repo or show up at one of the [Weekly IPFS All Hands calls](https://github.com/ipfs/pm/#weekly-all-hands).

### (rough) Roadmap

#### v1 - Make a tool that enables Website authors and Web Developers to publish their Websites with IPFS

- [ ] Refactor and update old ipscend code to use the latest and greatest IPFS APIs
- [ ] Create an ipfs-push tool that automatically pushes the latest publish to multiple IPFS Gateways
- [ ] Add support for IPFS Cluster pinbot so that the Website is stored

#### v2 - Support git directly

- [ ] Publish the Git Hash directly through IPFS using CID & IPLD. This will avoid duplicating the info that already exists on the git repo
  - [ ] Add support to the IPFS Files API to understand Git graphs as files and folders (e.g. ipfs.io/ipfs/gitHash/public)

#### v3 - Autopublish

- [ ] Find .dweb files in Github repositories and make the published versions available automatically through IPFS

## Usage

Install via npm

```
$ npm install dweb-publish --global
```

### Commands

## Use IPFS to host your webpage using a standard domain (includes cool DNS trick!)

If you are looking into having your application accesible through `youdomain.com`, instead of referencing it by a `/ipfs/hash`, we have a solution for you.

Every IPFS node HTTP interface checks the host header when it receives a request from a browser, then it performs a DNS lookup for a TXT Record, looks if there is any MerkleLink available, and, if there is, it performs a lookup, caching that path and serving it as if it was a static webserver.

To make this work, simply:

1. Publish your application using `dweb-publish`.
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
