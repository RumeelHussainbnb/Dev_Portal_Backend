# BNBChainDevPortal Backend APIs

## Introduction

APIs developed using `Express.js`, `NodeJs` version = `v18.12.0` and `MongoDB` is being used for storing the data.

## .env file

.env file has following variables:

| Name | Value |
| ------ | ------ |
| BEARER_TOKEN | Token from Twitter for posting the tweets(by admin only) |
| HOME_URL | URL of the server where frontend is running |

## How to run?

```bash
npm clean --install
npm run start
```

APIs will be listening for requests on port 3001