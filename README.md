# deSEC DynDNS Client

Syncs your IPv6 address with [deSEC DynDNS](https://desec.io/).

I hacked this together after my previous DynDNS service died and I couldn't get [ddclient](https://github.com/ddclient/ddclient) to work with IPv6.

## Install

- `git clone https://github.com/simon-lorenz/desec-dyndns-client.git`
- `cd desec-dyndns-client`
- `npm install`
- `npm run build`
- copy `dist/` to your target server
- update `dist/config.jsonc` with your username, token and domains

## Usage

- run: `./desec-dyndns-client`
- run as daemon: `./daemon.sh`
