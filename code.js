// Store all game rounds in an array collection for the session history.
var gameHistory = [];

// Class used to create a structured object for each completed game round.
class GameRound {
    // Build one game round object with the player's data and result.
    constructor(playerName, gameName, wagerAmount, resultText, payoutAmount) {
        // Save the player name on the round object.
        this.playerName = playerName;
        // Save the selected game name on the round object.
        this.gameName = gameName;
        // Save the wager amount on the round object.
        this.wagerAmount = wagerAmount;
        // Save the result text on the round object.
        this.resultText = resultText;
        // Save the payout amount on the round object.
        this.payoutAmount = payoutAmount;
    }
}

// Setup function that connects the form submit behavior.
function setupCasinoForm() {
    // Get the casino form element from the page.
    var casinoForm = document.getElementById("casinoForm");
    // Assign the submit handler without using action listener methods.
    casinoForm.onsubmit = playSelectedGame;
}

// Main game router function that runs when the form is submitted.
function playSelectedGame() {
    // Read and clean the player name input.
    var playerName = document.getElementById("playerName").value.trim();
    // Read the selected game value.
    var gameChoice = document.getElementById("gameChoice").value;
    // Read the wager amount as text.
    var wagerText = document.getElementById("wagerAmount").value;
    // Read the lucky number as text.
    var luckyNumberText = document.getElementById("luckyNumber").value;
    // Get the validation output section.
    var validationOutput = document.getElementById("validationOutput");
    // Get the detail output section.
    var rollOutput = document.getElementById("rollOutput");
    // Get the result output section.
    var gameOutput = document.getElementById("gameOutput");

    // Clear old validation output before a new round starts.
    validationOutput.innerHTML = "";
    // Clear old detail output before a new round starts.
    rollOutput.innerHTML = "";
    // Clear old result output before a new round starts.
    gameOutput.innerHTML = "";

    // Validate the player name with string manipulation and decision logic.
    if (isValidPlayerName(playerName) === false) {
        // Show name validation error using innerHTML.
        validationOutput.innerHTML = "<p class='status-loss'>Please enter a player name with at least two letters.</p>";
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

    // Convert the lucky number text to a number for the lucky number game.
    var luckyNumber = Number(luckyNumberText);

    // Validate the lucky number when the lucky number game is selected.
    if (gameChoice === "lucky-number" && (Number.isNaN(luckyNumber) || luckyNumber < 1 || luckyNumber > 10)) {
        // Show lucky number validation error using innerHTML.
        validationOutput.innerHTML = "<p class='status-loss'>Lucky Number Hunt needs a number from 1 through 10.</p>";
        // Return false so the form does not reload the page.
        return false;
    }

    // Choose the High Card Duel game when selected.
    if (gameChoice === "high-card") {
        // Run the high card game and pass the needed parameters.
        playHighCardDuel(playerName, wagerAmount);
    }
    // Choose the Dice Race game when selected.
    else if (gameChoice === "dice-race") {
        // Run the dice race game and pass the needed parameters.
        playDiceRace(playerName, wagerAmount);
    }
    // Choose the Coin Flip Clash game when selected.
    else if (gameChoice === "coin-flip") {
        // Run the coin flip game and pass the needed parameters.
        playCoinFlipClash(playerName, wagerAmount);
    }
    // Choose the Slot Sprint game when selected.
    else if (gameChoice === "slot-sprint") {
        // Run the slot sprint game and pass the needed parameters.
        playSlotSprint(playerName, wagerAmount);
    }
    // Otherwise run the Lucky Number Hunt game.
    else {
        // Run the lucky number game and pass the needed parameters.
        playLuckyNumberHunt(playerName, wagerAmount, luckyNumber);
    }

    // Rebuild the history output after every completed round.
    showGameHistory();
    // Return false so the submit action stays on the same page.
    return false;
}

// Validate a player name by counting letter characters.
function isValidPlayerName(playerName) {
    // Start the letter count at zero.
    var letterCount = 0;
    // Start the loop counter at the first character.
    var index = 0;

    // Loop through every character in the player name.
    while (index < playerName.length) {
        // Store the current character in lowercase.
        var currentCharacter = playerName.charAt(index).toLowerCase();
        // Check whether the current character is a letter.
        if (currentCharacter >= "a" && currentCharacter <= "z") {
            // Add one to the letter count.
            letterCount = letterCount + 1;
        }
        // Move to the next character.
        index = index + 1;
    }

    // Return true when the name has at least two letters.
    return letterCount >= 2;
}

// Escape special characters before adding user text to innerHTML output.
function escapeHtml(textToEscape) {
    // Start with an empty string for the safe output.
    var safeText = "";
    // Start the loop counter at the first character.
    var index = 0;

    // Loop through each character in the text.
    while (index < textToEscape.length) {
        // Store the current character.
        var currentCharacter = textToEscape.charAt(index);
        // Replace an ampersand with its HTML entity.
        if (currentCharacter === "&") {
            // Add the safe ampersand entity.
            safeText = safeText + "&amp;";
        } else if (currentCharacter === "<") {
            // Add the safe less-than entity.
            safeText = safeText + "&lt;";
        } else if (currentCharacter === ">") {
            // Add the safe greater-than entity.
            safeText = safeText + "&gt;";
        } else if (currentCharacter === '"') {
            // Add the safe quotation mark entity.
            safeText = safeText + "&quot;";
        } else if (currentCharacter === "'") {
            // Add the safe apostrophe entity.
            safeText = safeText + "&#039;";
        } else {
            // Add regular characters without changing them.
            safeText = safeText + currentCharacter;
        }
        // Move to the next character.
        index = index + 1;
    }

    // Return the safe string for innerHTML output.
    return safeText;
}

// Play the original high card duel game.
function playHighCardDuel(playerName, wagerAmount) {
    // Generate player card value from 1 to 13.
    var playerCardValue = Math.floor(Math.random() * 13) + 1;
    // Generate dealer card value from 1 to 13.
    var dealerCardValue = Math.floor(Math.random() * 13) + 1;
    // Convert the numeric player card value to a readable card label.
    var playerCardName = getCardName(playerCardValue);
    // Convert the numeric dealer card value to a readable card label.
    var dealerCardName = getCardName(dealerCardValue);
    // Calculate card margin.
    var cardMargin = playerCardValue - dealerCardValue;
    // Create the safe player name for innerHTML output.
    var safePlayerName = escapeHtml(playerName);
    // Get the detail output section.
    var rollOutput = document.getElementById("rollOutput");
    // Get the result output section.
    var gameOutput = document.getElementById("gameOutput");
    // Set default result text.
    var resultText = "Tie game - push!";
    // Set default payout amount.
    var payoutAmount = 0;

    // Build the draw output using innerHTML so results display on page.
    rollOutput.innerHTML =
        "<h2>High Card Duel</h2>" +
        "<p><strong>" + safePlayerName + "</strong> drew <strong>" + playerCardName + "</strong> (" + playerCardValue + ").</p>" +
        "<p><strong>Dealer</strong> drew <strong>" + dealerCardName + "</strong> (" + dealerCardValue + ").</p>" +
        "<p>Card Margin = <strong>" + Math.abs(cardMargin) + "</strong></p>";

    // If player card beats dealer card, player wins the duel.
    if (playerCardValue > dealerCardValue) {
        // Store the winning result text.
        resultText = "You won the duel!";
        // Calculate a positive payout.
        payoutAmount = wagerAmount;
        // Output win message using innerHTML.
        gameOutput.innerHTML = "<p class='status-win'>" + resultText + "</p>" + describeWagerTier(wagerAmount);
    }
    // Else if player card is lower than dealer card, player loses.
    else if (playerCardValue < dealerCardValue) {
        // Store the losing result text.
        resultText = "Dealer wins this round.";
        // Calculate a negative payout.
        payoutAmount = wagerAmount * -1;
        // Output loss message using innerHTML.
        gameOutput.innerHTML = "<p class='status-loss'>" + resultText + "</p>" + describeWagerTier(wagerAmount);
    }
    // Else both cards match and the result is a push.
    else {
        // Output push message using innerHTML.
        gameOutput.innerHTML = "<p class='status-push'>" + resultText + "</p>" + describeWagerTier(wagerAmount);
    }

    // Save this completed round in the history collection.
    saveRound(playerName, "High Card Duel", wagerAmount, resultText, payoutAmount);
}

// Play a dice game where the player and dealer each roll two dice.
function playDiceRace(playerName, wagerAmount) {
    // Roll the first player die.
    var playerDieOne = rollDie();
    // Roll the second player die.
    var playerDieTwo = rollDie();
    // Roll the first dealer die.
    var dealerDieOne = rollDie();
    // Roll the second dealer die.
    var dealerDieTwo = rollDie();
    // Add the player dice together.
    var playerTotal = playerDieOne + playerDieTwo;
    // Add the dealer dice together.
    var dealerTotal = dealerDieOne + dealerDieTwo;
    // Create the safe player name for innerHTML output.
    var safePlayerName = escapeHtml(playerName);
    // Get the detail output section.
    var rollOutput = document.getElementById("rollOutput");
    // Get the result output section.
    var gameOutput = document.getElementById("gameOutput");
    // Set default result text.
    var resultText = "Tie race - push!";
    // Set default payout amount.
    var payoutAmount = 0;

    // Show the dice roll details using innerHTML.
    rollOutput.innerHTML =
        "<h2>Dice Race</h2>" +
        "<p><strong>" + safePlayerName + "</strong> rolled " + playerDieOne + " and " + playerDieTwo + " for <strong>" + playerTotal + "</strong>.</p>" +
        "<p><strong>Dealer</strong> rolled " + dealerDieOne + " and " + dealerDieTwo + " for <strong>" + dealerTotal + "</strong>.</p>";

    // Decide whether the player wins the dice race.
    if (playerTotal > dealerTotal) {
        // Store the winning result text.
        resultText = "You won the dice race!";
        // Dice Race pays double the wager on a win.
        payoutAmount = wagerAmount * 2;
        // Output win message using innerHTML.
        gameOutput.innerHTML = "<p class='status-win'>" + resultText + "</p><p class='wager-note'>Dice Race payout: " + payoutAmount + " credits.</p>";
    }
    // Decide whether the dealer wins the dice race.
    else if (playerTotal < dealerTotal) {
        // Store the losing result text.
        resultText = "Dealer won the dice race.";
        // Calculate a negative payout.
        payoutAmount = wagerAmount * -1;
        // Output loss message using innerHTML.
        gameOutput.innerHTML = "<p class='status-loss'>" + resultText + "</p><p class='wager-note'>Lost wager: " + wagerAmount + " credits.</p>";
    }
    // Handle a tied dice race.
    else {
        // Output push message using innerHTML.
        gameOutput.innerHTML = "<p class='status-push'>" + resultText + "</p><p class='wager-note'>Your wager is returned.</p>";
    }

    // Save this completed round in the history collection.
    saveRound(playerName, "Dice Race", wagerAmount, resultText, payoutAmount);
}

// Play a lucky number guessing game.
function playLuckyNumberHunt(playerName, wagerAmount, luckyNumber) {
    // Generate the hidden number from 1 through 10.
    var hiddenNumber = Math.floor(Math.random() * 10) + 1;
    // Calculate the distance between the guess and hidden number.
    var guessDistance = Math.abs(luckyNumber - hiddenNumber);
    // Create the safe player name for innerHTML output.
    var safePlayerName = escapeHtml(playerName);
    // Get the detail output section.
    var rollOutput = document.getElementById("rollOutput");
    // Get the result output section.
    var gameOutput = document.getElementById("gameOutput");
    // Set default result text.
    var resultText = "Close guess.";
    // Set default payout amount.
    var payoutAmount = 0;

    // Show the lucky number details using innerHTML.
    rollOutput.innerHTML =
        "<h2>Lucky Number Hunt</h2>" +
        "<p><strong>" + safePlayerName + "</strong> picked <strong>" + luckyNumber + "</strong>.</p>" +
        "<p>The hidden number was <strong>" + hiddenNumber + "</strong>.</p>" +
        "<p>Distance from target: <strong>" + guessDistance + "</strong>.</p>";

    // Award a jackpot for an exact match.
    if (guessDistance === 0) {
        // Store jackpot result text.
        resultText = "Exact match jackpot!";
        // Pay five times the wager.
        payoutAmount = wagerAmount * 5;
        // Output jackpot message using innerHTML.
        gameOutput.innerHTML = "<p class='status-win'>" + resultText + "</p><p class='wager-note'>Jackpot payout: " + payoutAmount + " credits.</p>";
    }
    // Award a small win for being one number away.
    else if (guessDistance === 1) {
        // Store close win result text.
        resultText = "One away bonus!";
        // Pay the original wager.
        payoutAmount = wagerAmount;
        // Output bonus message using innerHTML.
        gameOutput.innerHTML = "<p class='status-win'>" + resultText + "</p><p class='wager-note'>Bonus payout: " + payoutAmount + " credits.</p>";
    }
    // Otherwise the player loses the hunt.
    else {
        // Store losing result text.
        resultText = "No match this time.";
        // Calculate a negative payout.
        payoutAmount = wagerAmount * -1;
        // Output loss message using innerHTML.
        gameOutput.innerHTML = "<p class='status-loss'>" + resultText + "</p><p class='wager-note'>Lost wager: " + wagerAmount + " credits.</p>";
    }

    // Save this completed round in the history collection.
    saveRound(playerName, "Lucky Number Hunt", wagerAmount, resultText, payoutAmount);
}

// Play a coin flip game where the player wins on heads.
function playCoinFlipClash(playerName, wagerAmount) {
    // Create the list of possible coin sides.
    var coinSides = ["Heads", "Tails"];
    // Pick a random side from the coin side collection.
    var coinResult = coinSides[Math.floor(Math.random() * coinSides.length)];
    // Create the safe player name for innerHTML output.
    var safePlayerName = escapeHtml(playerName);
    // Get the detail output section.
    var rollOutput = document.getElementById("rollOutput");
    // Get the result output section.
    var gameOutput = document.getElementById("gameOutput");
    // Set default result text.
    var resultText = "Tails took the round.";
    // Set default payout amount.
    var payoutAmount = wagerAmount * -1;

    // Show the coin flip details using innerHTML.
    rollOutput.innerHTML =
        "<h2>Coin Flip Clash</h2>" +
        "<p><strong>" + safePlayerName + "</strong> called Heads for this fast round.</p>" +
        "<p>The coin landed on <strong>" + coinResult + "</strong>.</p>";

    // Award the player when the coin lands on heads.
    if (coinResult === "Heads") {
        // Store the winning result text.
        resultText = "Heads wins the clash!";
        // Pay the original wager.
        payoutAmount = wagerAmount;
        // Output win message using innerHTML.
        gameOutput.innerHTML = "<p class='status-win'>" + resultText + "</p><p class='wager-note'>Coin Flip payout: " + payoutAmount + " credits.</p>";
    }
    // Otherwise the player loses on tails.
    else {
        // Output loss message using innerHTML.
        gameOutput.innerHTML = "<p class='status-loss'>" + resultText + "</p><p class='wager-note'>Lost wager: " + wagerAmount + " credits.</p>";
    }

    // Save this completed round in the history collection.
    saveRound(playerName, "Coin Flip Clash", wagerAmount, resultText, payoutAmount);
}

// Play a small slot game with three symbol pulls.
function playSlotSprint(playerName, wagerAmount) {
    // Create the slot symbol collection.
    var slotSymbols = ["Star", "Rocket", "Moon", "Gem"];
    // Pull the first slot symbol.
    var firstSymbol = getRandomSymbol(slotSymbols);
    // Pull the second slot symbol.
    var secondSymbol = getRandomSymbol(slotSymbols);
    // Pull the third slot symbol.
    var thirdSymbol = getRandomSymbol(slotSymbols);
    // Count how many matching symbols were pulled.
    var matchCount = countSlotMatches(firstSymbol, secondSymbol, thirdSymbol);
    // Create the safe player name for innerHTML output.
    var safePlayerName = escapeHtml(playerName);
    // Get the detail output section.
    var rollOutput = document.getElementById("rollOutput");
    // Get the result output section.
    var gameOutput = document.getElementById("gameOutput");
    // Set default result text.
    var resultText = "No slot match this time.";
    // Set default payout amount.
    var payoutAmount = wagerAmount * -1;

    // Show the slot symbols using innerHTML.
    rollOutput.innerHTML =
        "<h2>Slot Sprint</h2>" +
        "<p><strong>" + safePlayerName + "</strong> spun these symbols:</p>" +
        "<p class='slot-symbols'>" + firstSymbol + " | " + secondSymbol + " | " + thirdSymbol + "</p>" +
        "<p>Matching symbols: <strong>" + matchCount + "</strong>.</p>";

    // Award a jackpot when all three symbols match.
    if (matchCount === 3) {
        // Store the jackpot result text.
        resultText = "Triple match jackpot!";
        // Pay six times the wager.
        payoutAmount = wagerAmount * 6;
        // Output jackpot message using innerHTML.
        gameOutput.innerHTML = "<p class='status-win'>" + resultText + "</p><p class='wager-note'>Slot Sprint jackpot: " + payoutAmount + " credits.</p>";
    }
    // Award a smaller win when two symbols match.
    else if (matchCount === 2) {
        // Store the small win result text.
        resultText = "Two-symbol match!";
        // Pay double the wager.
        payoutAmount = wagerAmount * 2;
        // Output win message using innerHTML.
        gameOutput.innerHTML = "<p class='status-win'>" + resultText + "</p><p class='wager-note'>Slot Sprint payout: " + payoutAmount + " credits.</p>";
    }
    // Otherwise show the losing result.
    else {
        // Output loss message using innerHTML.
        gameOutput.innerHTML = "<p class='status-loss'>" + resultText + "</p><p class='wager-note'>Lost wager: " + wagerAmount + " credits.</p>";
    }

    // Save this completed round in the history collection.
    saveRound(playerName, "Slot Sprint", wagerAmount, resultText, payoutAmount);
}

// Choose one random symbol from a symbol collection.
function getRandomSymbol(symbols) {
    // Return the symbol at a random array index.
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Count the best match size from three slot symbols.
function countSlotMatches(firstSymbol, secondSymbol, thirdSymbol) {
    // Return three when all symbols match.
    if (firstSymbol === secondSymbol && secondSymbol === thirdSymbol) {
        // Return the full match count.
        return 3;
    }
    // Return two when any pair of symbols match.
    else if (firstSymbol === secondSymbol || firstSymbol === thirdSymbol || secondSymbol === thirdSymbol) {
        // Return the pair match count.
        return 2;
    }
    // Return zero when no symbols match.
    else {
        // Return the no-match count.
        return 0;
    }
}

// Roll one six-sided die.
function rollDie() {
    // Return a random integer from 1 through 6.
    return Math.floor(Math.random() * 6) + 1;
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

// Save a completed game round object into the history collection.
function saveRound(playerName, gameName, wagerAmount, resultText, payoutAmount) {
    // Create a new object using the GameRound class.
    var completedRound = new GameRound(playerName, gameName, wagerAmount, resultText, payoutAmount);
    // Add the completed round object to the history array.
    gameHistory.push(completedRound);
}

// Build and display the game history with a loop.
function showGameHistory() {
    // Get the history output section from the page.
    var historyOutput = document.getElementById("historyOutput");
    // Start the history HTML with a heading.
    var historyHtml = "<h2>Session History</h2><ol>";
    // Start the loop counter at the first history item.
    var index = 0;

    // Loop through every saved game round object.
    while (index < gameHistory.length) {
        // Store the current round object.
        var round = gameHistory[index];
        // Escape the player name before writing it with innerHTML.
        var safePlayerName = escapeHtml(round.playerName);
        // Add one list item for this round.
        historyHtml = historyHtml + "<li><strong>" + safePlayerName + "</strong> played " + round.gameName + " for " + round.wagerAmount + " credits: " + round.resultText + " (" + round.payoutAmount + ")</li>";
        // Move to the next history item.
        index = index + 1;
    }

    // Close the ordered list.
    historyHtml = historyHtml + "</ol>";
    // Display the completed history with innerHTML.
    historyOutput.innerHTML = historyHtml;
}

// Run setup after the external script loads at the bottom of the HTML page.
setupCasinoForm();
