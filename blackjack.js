var dealerSum = 0;
var yourSum = 0;

var playerMoney = 100;
var betAmount = 10;
var betActive = false;

var dealerAceCount = 0; //Check for Ace Count to see how many times it's possible to change from 11 points to 1
var yourAceCount = 0;

var hidden;
var deck;

var canHit = true;
var canStay = true;
var canDeal = false;
var canBet = false;
var canDecreaseBet = true;
var canIncreaseBet = true;
 

window.onload = function() {  //window.onload means it runs the function each time the window loads/refreshes
    buildDeck();
    shuffleDeck();
    startGame()
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "S", "D", "H"];
    deck=[];

    for (let i = 0; i < types.length; i++) {  //double for loop to go through both arrays. Gets all values for one type first (AC, 2C until KC, then AS until KS)
        for (let j = 0; j < values.length; j++) {
                deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i <deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); //math.random generates a number between 0-1, which is multiplied by 52 for all the cards in the deck.
                                                       // The highest output is 51.999. Math.floor removes the decimals points, changing a float number to an integer (0-51)
        let temp= deck[i]; //creates a temporary variable to switch the positions of the cards in the deck
        deck[i]=deck[j];
        deck[j]=temp;
    }                                                 
      console.log(deck);
}

function startGame() {
    
    let cardImg = document.createElement("img"); //creates an img tag <img>
    let card = deck.pop(); //pulls a card from the deck
    cardImg.src = "./cards/" + card + ".png"; //gives details to cards
    dealerSum += getValue(card); //adds dealers total
    dealerAceCount += checkAce(card); //updates ace count
    document.getElementById("dealer-cards").append(cardImg); //adds to html code, shows card

    document.getElementById("player-money").innerText = "Player Money = " + playerMoney;
    document.getElementById("betamount").innerText = "Bet Amount = " + betAmount;

    for(let i =0; i<2; i++) {

        let cardImg = document.createElement("img"); //creates an img tag <img>
        let card = deck.pop(); //pulls a card from the deck
        cardImg.src = "./cards/" + card + ".png"; //gives details to cards
        yourSum += getValue(card); //adds your total
        yourAceCount += checkAce(card); //updates ace count
        document.getElementById("your-cards").append(cardImg); //adds to html code, shows card
    }

    console.log(yourSum);

    document.getElementById("hit").addEventListener("click", hit); //adds to html code for hit button, reads if mouse clicks button then runs function hit
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("bet").addEventListener("click", bet);
    document.getElementById("deal").addEventListener("click", deal);
    document.getElementById("increaseBet").addEventListener("click", increaseBet);
    document.getElementById("decreaseBet").addEventListener("click", decreaseBet);

}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img"); //creates an img tag <img>
    let card = deck.pop(); //pulls a card from the deck
    cardImg.src = "./cards/" + card + ".png"; //gives details to cards
    yourSum += getValue(card); //adds dealers total
    yourAceCount += checkAce(card); //updates ace count
    document.getElementById("your-cards").append(cardImg); //adds to html code, shows card

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        document.getElementById("hit").classList.add("disabled");
    }
}

function stay() {
    
    if (!canStay) {
        return;
    }

    canStay=false;
    document.getElementById("stay").classList.add("disabled");
    canHit=false;
    document.getElementById("hit").classList.add("disabled");
    canDeal=true;
    document.getElementById("deal").classList.remove("disabled");
    canBet=true;
    document.getElementById("bet").classList.remove("disabled");

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img"); //creates an img tag <img>
        let card = deck.pop(); //pulls a card from the deck
        cardImg.src = "./cards/" + card + ".png"; //gives details to cards
        dealerSum += getValue(card); //adds dealers total
        dealerAceCount += checkAce(card); //updates ace count
        document.getElementById("dealer-cards").append(cardImg); //adds to html code, shows card
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        yourSum = reduceAce(yourSum, yourAceCount);
    }


    canHit = false;
    let message = "";

    //all possible outcomes
    
    if (yourSum > 21) {
        message='You Lose';
    }

    else if (dealerSum > 21) {
        message="You Win";
    }

    else if (yourSum > dealerSum) {
        message="You Win";
    }

    else if (dealerSum > yourSum) {
        message="You Lose";

    }

    else if (dealerSum == yourSum) {
        message="Tie";
    }

    document.getElementById("results").innerText = message;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("dealer-sum").innerText = dealerSum;

    if(betActive==true & message=="You Win") {
        playerMoney = playerMoney + betAmount * 2
        document.getElementById("player-money").innerText = "Player Money = " + playerMoney;

    }

    if(betActive==true & message=="Tie") {
        playerMoney = playerMoney + betAmount
        document.getElementById("player-money").innerText = "Player Money = " + playerMoney;

    }
    
    betActive=false;
}

function getValue(card) {
    let data = card.split('-'); //split value and type
    let value = data[0];

    if (isNaN(value)) { //isNaN - is Not a Number, this is setting a value for the special cards (A, J, Q, K)
        if(value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value); //returns value of the digit itself
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) { //prevents player from busting if their is an ace in the hand
    while(playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -=1;
    }
    return playerSum;

}

function bet() {

    if(betAmount>playerMoney) {
        canBet=false;
        document.getElementById("bet").classList.add("disabled");
    }

    if (!canBet) {
        return;
    }

    canBet=false;
    document.getElementById("bet").classList.add("disabled");

    playerMoney = playerMoney-betAmount;
    document.getElementById("player-money").innerText = "Player Money = " + playerMoney;
    canBet = false;
    betActive = true;
    }

function deal() {
    if (!canDeal) {
        return;
    }

    canDeal=false;
    document.getElementById("deal").classList.add("disabled");
    canBet=false;
    document.getElementById("bet").classList.add("disabled");
    canStay=true;
    document.getElementById("stay").classList.remove("disabled");
    canHit=true;
    document.getElementById("hit").classList.remove("disabled");

    yourSum = 0;
    dealerSum=0;
    playerAceCount=0;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-money").innerText = playerMoney;
    document.getElementById("player-money").innerText = "Player Money = " + playerMoney;



    let yourimg = document.querySelector('#your-cards').querySelectorAll('img');
    let dealerimg = document.querySelector('#dealer-cards').querySelectorAll('img');
    
    for(let i=0; i<yourimg.length; i++){
        yourimg[i].remove();
    }
    for(let i=0; i<dealerimg.length; i++){
        dealerimg[i].remove();
    }

    let backImg = document.createElement("img"); //creates an img tag <img>
    backImg.src = "./cards/back.png";
    document.getElementById("dealer-cards").append(backImg) //adds to html code, shows card 

    buildDeck();
    shuffleDeck();
    startGame(); 

    canHit=true;
}

function increaseBet() {

    if (!canIncreaseBet) {
        return;
    }
    betAmount=betAmount+10
    document.getElementById("betamount").innerText = "Bet Amount = " + betAmount;
    canDecreaseBet=true;


    if(betAmount > playerMoney) {
        betAmount = playerMoney;
        document.getElementById("betamount").innerText = "Bet Amount = " + betAmount;
        canIncreaseBet=false;
    }
}

function decreaseBet() {

    if (!canDecreaseBet) {
        return;
    }
    betAmount=betAmount-10
    document.getElementById("betamount").innerText = "Bet Amount = " + betAmount;
    canIncreaseBet=true;

    if(betAmount < 0) {
        betAmount = 0;
        document.getElementById("betamount").innerText = "Bet Amount = " + betAmount;
        canDecreaseBet=false;
    }
}

//document.getElementById("hidden").src = "./cards/" + hidden + ".png";
