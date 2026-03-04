// Main game function called by the form submit button in game.html.
function playHighCardDuel() {
    // Read and trim the player name input from the form.
    var playerName = document.getElementById("playerName").value.trim();
    // Read the wager amount as raw text from the form.
    var wagerText = document.getElementById("wagerAmount").value;

    // Get the validation output section so we can write user input errors.
    var validationOutput = document.getElementById("validationOutput");
    // Get the draw output section so we can write card details.
    var rollOutput = document.getElementById("rollOutput");
    // Get the game output section so we can write the final result.
    var gameOutput = document.getElementById("gameOutput");

    // Clear old validation output before a new round starts.
    validationOutput.innerHTML = "";
    // Clear old draw output before a new round starts.
    rollOutput.innerHTML = "";
    // Clear old result output before a new round starts.
    gameOutput.innerHTML = "";

    // Validate that a player name was entered.
    if (playerName.length === 0) {
        // Show name validation error using innerHTML.
        validationOutput.innerHTML = "<p class='status-loss'>Please enter your player name before drawing cards.</p>";
        // Return false so the form does not reload the page.
        return false;
    }

    // Convert wager text to a number for math operations.
    var wagerAmount = Number(wagerText);

    // Validate that wager is a positive number.
    if (Number.isNaN(wagerAmount) || wagerAmount <= 0) {
        // Show wager validation error using innerHTML.
        validationOutput.innerHTML = "<p class='status-loss'>Please enter a valid wager greater than zero.</p>";
        // Return false so the form keeps the user on this page.
        return false;
    }

    // Generate player card value from 1 to 13 (Ace through King).
    var playerCardValue = Math.floor(Math.random() * 13) + 1;
    // Generate dealer card value from 1 to 13 (Ace through King).
    var dealerCardValue = Math.floor(Math.random() * 13) + 1;

    // Convert the numeric player card value to a readable card label.
    var playerCardName = getCardName(playerCardValue);
    // Convert the numeric dealer card value to a readable card label.
    var dealerCardName = getCardName(dealerCardValue);

    // Calculate card margin (positive means player is ahead).
    var cardMargin = playerCardValue - dealerCardValue;
    // Calculate combined draw power as extra math for this game.
    var totalDrawPower = playerCardValue + dealerCardValue;

    // Build the draw output using innerHTML so results display on page.
    rollOutput.innerHTML =
        "<h2>Card Draw</h2>" +
        "<p><strong>" + playerName + "</strong> drew <strong>" + playerCardName + "</strong> (" + playerCardValue + ").</p>" +
        "<p><strong>Dealer</strong> drew <strong>" + dealerCardName + "</strong> (" + dealerCardValue + ").</p>" +
        "<p>Card Margin = <strong>" + Math.abs(cardMargin) + "</strong> | Total Draw Power = <strong>" + totalDrawPower + "</strong></p>";

    // Build wager tier text by calling a second function that takes a parameter.
    var wagerMessage = describeWagerTier(wagerAmount);

    // If player card beats dealer card, player wins the duel.
    if (playerCardValue < dealerCardValue) {
        // Output win message using innerHTML.
        gameOutput.innerHTML = "<p class='status-win'>You won the duel!</p>" + wagerMessage;
    }
    // Else if player card is lower than dealer card, player loses.
    else if (playerCardValue > dealerCardValue) {
        // Output loss message using innerHTML.
        gameOutput.innerHTML = "<p class='status-loss'>Dealer wins this round. You lose.</p>" + wagerMessage;
    }
    // Else both cards match and the result is a push.
    else {
        // Output push message using innerHTML.
        gameOutput.innerHTML = "<p class='status-push'>Tie game - push!</p>" + wagerMessage;
    }

    // Return false so the submit action stays on the same page.
    return false;
}

// Helper function that converts a card value parameter into a card name string.
function getCardName(cardValue) {
    // If value is 1, return Ace.
    if (cardValue === 1) {
        // Return card name text.
        return "Ace";
    }
    // Else if value is 11, return Jack.
    else if (cardValue === 11) {
        // Return card name text.
        return "Jack";
    }
    // Else if value is 12, return Queen.
    else if (cardValue === 12) {
        // Return card name text.
        return "Queen";
    }
    // Else if value is 13, return King.
    else if (cardValue === 13) {
        // Return card name text.
        return "King";
    }
    // Else return numeric card label for values 2 through 10.
    else {
        // Return numeric value as a string.
        return String(cardValue);
    }
}

// Helper function that takes a wager parameter and returns a wager style message.
function describeWagerTier(wagerAmount) {
    // If wager is high, show high-roller message.
    if (wagerAmount >= 1000) {
        // Return HTML text for output area.
        return "<p class='wager-note'>High Roller: " + wagerAmount + " credits on the line.</p>";
    }
    // Else if wager is medium, show steady-player message.
    else if (wagerAmount >= 250) {
        // Return HTML text for output area.
        return "<p class='wager-note'>Steady Play: " + wagerAmount + " credits wagered.</p>";
    }
    // Else wager is small.
    else {
        // Return HTML text for output area.
        return "<p class='wager-note'>Cautious Bet: " + wagerAmount + " credits this round.</p>";
    }
}
