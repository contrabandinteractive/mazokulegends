# Mazoku Legends

## About

Mazoku Legends is a MMORPG based on Japanese mythology! It is currently a proof of concept built using RPGJS, the XRPL EVM sidechain, and the Web3.js library.

It demonstrates the following:

* Multiplayer capability
* Chat functionality that lets you send XRP
* Smart contract: The Blacksmith holds the key to the Sword NFT (ERC721) Smart Contract. 
* Mint NFT: speak to the Blacksmith to forge your own Sword NFT! Act quick because the initial supply is 500 (now at 499!)
* Fight the Dark Lord! If you win, you get XRP. If you lose, you send the Dark Lord some XRP.
* The Dark Lord can only be defeated with a sword (this dApp checks if you are an owner).
* A project built specifically for the XRPL EVM sidechain


## Get started

Install the dependencies...

```bash
cd (to your directory)
npm install
npm run dev
```

Navigate to [localhost:3000](http://localhost:3000). You should see your game running. Edit a file in `src`, save it, and reload the page to see your changes.



## Production

### Build with NodeJS

```bash
NODE_ENV=production npm run build
```

### Build with Docker

```bash
sudo docker build -t rpg .
sudo docker run -p 3000:3000 -d rpg
```

