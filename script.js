let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let playerMoney = 500;
let betAmount = 0;

function startGame() {
    if (playerMoney <= 0) {
        endGame("Game Over! You're out of money.");
        return;
    }

    initializeDeck();
    shuffleDeck();

    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;

    // Reset bet amount
    betAmount = 0;
    updateMoney();

    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);

    displayGameState();
}

function resetGame() {
    // Refund the bet amount
    playerMoney += betAmount;
    startGame();
}

function initializeDeck() {
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];

    deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
}

function shuffleDeck() {
    deck = deck.sort(() => Math.random() - 0.5);
}

function dealCard(hand) {
    const card = deck.pop();
    hand.push(card);
    updateScore(hand);
    displayGameState();
}

function updateScore(hand) {
    let score = 0;
    let aceCount = 0;

    for (const card of hand) {
        const rank = card.rank;
        switch (rank) {
            case "A":
                score += 11;
                aceCount++;
                break;
            case "K":
            case "Q":
            case "J":
                score += 10;
                break;
            default:
                score += parseInt(rank);
        }
    }

    // Adjust for Aces
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    if (hand === playerHand) {
        playerScore = score;
    } else {
        dealerScore = score;
    }
}

function displayGameState() {
    document.getElementById("output").innerHTML = `Player's Score: ${playerScore} | Dealer's Score: ${dealerScore}`;
    displayHand(playerHand, "player-hand");
    displayHand(dealerHand, "dealer-hand");
}

function displayHand(hand, elementId) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = "";

    for (const card of hand) {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        if (elementId === "dealer-hand" && hand.indexOf(card) === 0 && !isPlayerTurn()) {
            cardElement.classList.add("hidden");
        }
        cardElement.innerHTML = `${card.rank}<br>${card.suit}`;
        handElement.appendChild(cardElement);
    }
}

function isPlayerTurn() {
    return playerScore < 21;
}

function hit() {
    if (playerScore < 21) {
        dealCard(playerHand);
    }

    if (playerScore > 21) {
        playerMoney -= betAmount;
        updateMoney();
        endGame("Player Busts! Dealer Wins!");
    }
}

function stand() {
    while (dealerScore < 17) {
        dealCard(dealerHand);
    }

    if (dealerScore > 21 || playerScore > dealerScore) {
        playerMoney += betAmount * 2;
        updateMoney();
        endGame("Player Wins!");
    } else if (dealerScore > playerScore) {
        playerMoney -= betAmount;
        updateMoney();
        endGame("Dealer Wins!");
    } else {
        playerMoney += betAmount;
        updateMoney();
        endGame("It's a Tie!");
    }
}

function updateMoney() {
    document.getElementById("player-money").innerText = playerMoney;
    document.getElementById("bet-amount").innerText = betAmount;
}

function endGame(message) {
    displayGameState();
    alert(message);
    startGame();
}


