# Concept: Crypto Map

I built this project with an intention to learn Ethereum and to see how web 3.0 would function. I don't want to deploy this on production, because it cost about $500 to deploy Solidity contract and about $40 to write on the map.

![Alt text](readme_pics/1.jpeg?raw=true "HexGrid display card")
![Alt text](readme_pics/2.jpeg?raw=true "HexGrid edit card")
![Alt text](readme_pics/3.jpeg?raw=true "MetaMask confirmation to write to HexGrid")
![Alt text](readme_pics/4.jpeg?raw=true "HexGrid write is successful")

Before developing

- Start local ethereum network with Ganache
- truffle compile and truffle migrate if there are any new changes in ethereum contracts
- Replace GOOGLE_PLACES_API_KEY with Google Places API key in index.html
- Replace MAP_BOX_API_KEY with Mapbox access api key in App.js
- Install Metamask and import an account from Ganache.

Start frontend
cd client && npm start
