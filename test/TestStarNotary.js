const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async () => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] })
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, { from: user2, value: balance });
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance });
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async () => {
    //1. create a Star with different tokenId
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    const tokenId = 6;
    const instance = await StarNotary.deployed();
    await instance.createStar('New Star!', tokenId, { from: accounts[0] })
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'New Star!')
    assert.equal(await instance.tokenName.call(), 'My Awesome Token')
    assert.equal(await instance.tokenSymbol.call(), 'USD')
});

it('lets 2 users exchange stars', async () => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
    const tokenId1 = 7;
    const tokenId2 = 8;
    const userA = accounts[0];
    const userB = accounts[1];
    const instance = await StarNotary.deployed();

    await instance.createStar('Star A', tokenId1, { from: userA })
    await instance.createStar('Star B', tokenId2, { from: userB })
    await instance.exchangeStars(tokenId1, tokenId2)
    const newOwnerOfStarA = await instance.ownerOf(tokenId1)
    const newOwnerOfStarB = await instance.ownerOf(tokenId2)
   
    assert.equal(newOwnerOfStarA, userB)
    assert.equal(newOwnerOfStarB, userA)
});

it('lets a user transfer a star', async () => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
    const tokenId = 9;
    const instance = await StarNotary.deployed();
    const sender = accounts[0];
    const receiver = accounts[1];
    await instance.createStar('Happy Star!', tokenId, { from: sender})
    await instance.transferStar(receiver, tokenId)
    const newOwner = await instance.ownerOf(tokenId)
    assert.equal(newOwner, receiver)
});

it('lookUptokenIdToStarInfo test', async () => {
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
    let tokenId = 10;
    let instance = await StarNotary.deployed();
    await instance.createStar('Fabulous Star', tokenId, { from: accounts[0] })
    assert.equal(await instance.lookUptokenIdToStarInfo(tokenId), 'Fabulous Star')
});