# StarNotary Ethereum Dapp

## What tools or technologies you will use to create this application?
- Truffle: "v5.1.12"
- OpenZeppelin: "2.5.0"

## ERC-721 Token Name
- My Awesome Token

## ERC-721 Token Symbol
- USD

## How to use it:
- to start a development console:
    - ```truffle develop```
- inside truffle development console:
    - to compile contract 
        - ```compile```
    - migrating the contract to the locally running Ethereum network
        - ```migrate --reset```
    - to run unit tests:
        - ```test```
- in a new tab, to run frontend:
    - ```cd app```
    - ```npm run dev```
- to deploy to rinkeby test network ( you will need your<INFURA_KEY> and <METAMASK_SEED> inside     truffle.config):
    - ```truffle migrate --reset --network rinkeby```

