// Store every phrase the user checks during this page visit.
var checkedPhrases = [];

// Track whether the form loop should keep accepting new input.
var loopIsRunning = true;

// Connect the form submission to the palindrome program.
function setupPalindromeForm() {
    // Get the form element from the HTML page.
    var palindromeForm = document.getElementById("palindromeForm");
    // Check that the form exists before assigning submit behavior.
    if (palindromeForm !== null) {
        // Assign the submit function without using event listener methods.
        palindromeForm.onsubmit = runPalindromeProgram;
    }
}

// Run one pass of the palindrome checker when the form is submitted.
function runPalindromeProgram(submitEvent) {
    // Stop the browser's normal form submit when an event object is available.
    if (submitEvent) {
        // Prevent the page from navigating away inside HTMLPreview.
        submitEvent.preventDefault();
    }
    // Get the phrase input element from the page.
    var phraseInput = document.getElementById("phraseInput");
    // Get the select menu that controls whether the loop continues.
    var nextChoice = document.getElementById("nextChoice");
    // Get the message output area used for validation and results.
    var messageOutput = document.getElementById("messageOutput");
    // Get the history output area used to show checked phrases.
    var historyOutput = document.getElementById("historyOutput");
    // Read the typed phrase and remove extra space from the ends.
    var originalPhrase = phraseInput.value.trim();
    // Read the user's choice to continue or finish.
    var userChoice = nextChoice.value;

    // Clear old output before building the new message.
    messageOutput.innerHTML = "";

    // Stop immediately if the loop has already been exited.
    if (loopIsRunning === false) {
        // Show the finished message with innerHTML.
        messageOutput.innerHTML = "<p class='info-text'>The palindrome loop has ended. Refresh the page to start again.</p>";
        // Prevent the browser from leaving the page.
        return false;
    }

    // Validate that the user typed something into the form.
    if (originalPhrase.length === 0) {
        // Show the validation message with innerHTML.
        messageOutput.innerHTML = "<p class='error-text'>Please enter a word or phrase before submitting.</p>";
        // Keep the user on the same page.
        return false;
    }

    // Clean the phrase so spaces, punctuation, and capitalization do not affect the check.
    var cleanPhrase = cleanString(originalPhrase);

    // Validate that the cleaned phrase still contains letters or numbers.
    if (cleanPhrase.length === 0) {
        // Show the validation message with innerHTML.
        messageOutput.innerHTML = "<p class='error-text'>Please include at least one letter or number.</p>";
        // Keep the user on the same page.
        return false;
    }

    // Create a reversed copy of the cleaned phrase with a loop.
    var reversedPhrase = reverseString(cleanPhrase);
    // Compare the cleaned phrase to the reversed phrase.
    var isPalindrome = cleanPhrase === reversedPhrase;
    // Add this result to the page history collection.
    checkedPhrases.push({ phrase: originalPhrase, palindrome: isPalindrome });
    // Build the success or not-palindrome message.
    var resultMessage = buildResultMessage(originalPhrase, cleanPhrase, reversedPhrase, isPalindrome);
    // Put the result message on the page with innerHTML.
    messageOutput.innerHTML = resultMessage;
    // Rebuild the history section using a loop.
    historyOutput.innerHTML = buildHistoryMessage();
    // Clear the phrase field so the user can enter another phrase quickly.
    phraseInput.value = "";

    // Check whether the user chose to end the input loop.
    if (userChoice === "done") {
        // Change the loop state so no more entries are accepted.
        loopIsRunning = false;
        // Disable the text input after the loop exits.
        phraseInput.disabled = true;
        // Disable the select menu after the loop exits.
        nextChoice.disabled = true;
        // Disable the submit button after the loop exits.
        document.getElementById("checkButton").disabled = true;
        // Add a final message using innerHTML.
        messageOutput.innerHTML = messageOutput.innerHTML + "<p class='info-text'>You chose to stop. The loop is now closed.</p>";
    }

    // Prevent the default form submit page refresh.
    return false;
}

// Remove spaces and punctuation so only letters and numbers are checked.
function cleanString(textToClean) {
    // Start with an empty string for the cleaned result.
    var cleanedText = "";
    // Start the loop counter at the first character.
    var index = 0;

    // Loop through every character the user typed.
    while (index < textToClean.length) {
        // Store the current character in lowercase form.
        var currentCharacter = textToClean.charAt(index).toLowerCase();
        // Check whether the current character is a letter or number.
        if ((currentCharacter >= "a" && currentCharacter <= "z") || (currentCharacter >= "0" && currentCharacter <= "9")) {
            // Add valid characters to the cleaned text.
            cleanedText = cleanedText + currentCharacter;
        }
        // Move the loop to the next character.
        index = index + 1;
    }

    // Return the cleaned string to the main program.
    return cleanedText;
}

// Reverse a string by reading it from the end to the beginning.
function reverseString(textToReverse) {
    // Start with an empty string for the reversed result.
    var reversedText = "";
    // Start the loop counter at the last character.
    var index = textToReverse.length - 1;

    // Loop backward through the string.
    while (index >= 0) {
        // Add the current character to the reversed result.
        reversedText = reversedText + textToReverse.charAt(index);
        // Move the loop one character to the left.
        index = index - 1;
    }

    // Return the completed reversed string.
    return reversedText;
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

// Build the HTML string for the current palindrome result.
function buildResultMessage(originalPhrase, cleanPhrase, reversedPhrase, isPalindrome) {
    // Escape the original phrase before placing it inside innerHTML.
    var safeOriginalPhrase = escapeHtml(originalPhrase);
    // Create the message opening with the original phrase.
    var messageHtml = "<h2>Result</h2><p>You entered: <strong>" + safeOriginalPhrase + "</strong></p>";
    // Add the cleaned comparison text.
    messageHtml = messageHtml + "<p class='small-text'>Checked as: " + cleanPhrase + " against " + reversedPhrase + "</p>";

    // Choose the success message when the phrase is a palindrome.
    if (isPalindrome === true) {
        // Add the palindrome success message.
        messageHtml = messageHtml + "<p class='success-text'>Yes, this is a palindrome.</p>";
    } else {
        // Add the not-palindrome message.
        messageHtml = messageHtml + "<p class='error-text'>No, this is not a palindrome.</p>";
    }

    // Add the reminder that the form can be submitted again.
    messageHtml = messageHtml + "<p class='info-text'>Use the form to enter another phrase or choose that you are done.</p>";
    // Return the completed HTML message.
    return messageHtml;
}

// Build the HTML string for the phrase history section.
function buildHistoryMessage() {
    // Start the section with a heading.
    var historyHtml = "<h2>Checked Phrases</h2><ol>";
    // Start the loop counter at the first history item.
    var index = 0;

    // Loop through each checked phrase in the collection.
    while (index < checkedPhrases.length) {
        // Get the current history item.
        var historyItem = checkedPhrases[index];
        // Escape the saved phrase before placing it inside innerHTML.
        var safePhrase = escapeHtml(historyItem.phrase);
        // Choose display text based on the saved result.
        var statusText = historyItem.palindrome ? "Palindrome" : "Not a palindrome";
        // Add one list item to the HTML output.
        historyHtml = historyHtml + "<li><span>" + safePhrase + "</span><strong>" + statusText + "</strong></li>";
        // Move to the next history item.
        index = index + 1;
    }

    // Close the ordered list.
    historyHtml = historyHtml + "</ol>";
    // Return the completed history HTML.
    return historyHtml;
}

// Run setup after the external script loads at the bottom of the HTML page.
setupPalindromeForm();
