// Setup function that connects form submit behavior.
function setupForm() {
    // Get the form element from the page.
    var formElement = document.getElementById("secretForm");
    // Check that the form exists before assigning submit behavior.
    if (formElement !== null) {
        // Assign the submit handler without using event-listener APIs.
        formElement.onsubmit = validateAndReveal;
    }
}

// Main validation function that runs when the form is submitted.
function validateAndReveal(submitEvent) {
    // Stop the browser's normal form submit when an event object is available.
    if (submitEvent) {
        // Prevent the page from navigating away inside HTMLPreview.
        submitEvent.preventDefault();
    }
    // Read and trim first name input.
    var firstName = document.getElementById("firstName").value.trim();
    // Read and trim last name input.
    var lastName = document.getElementById("lastName").value.trim();
    // Read and trim ZIP code input.
    var zipCode = document.getElementById("zipCode").value.trim();

    // Combine first name + space + last name into one variable.
    const fullName = firstName + " " + lastName;

    // Get the validation output container.
    let validationOutput = document.getElementById("validationOutput");
    // Get the unlock banner container.
    let unlockBanner = document.getElementById("unlockBanner");
    // Get the secret message output container.
    let secretOutput = document.getElementById("secretOutput");

    // Clear old validation message content.
    validationOutput.innerHTML = "";
    // Hide the unlock banner while validation runs.
    unlockBanner.classList.remove("active");
    // Clear old secret message content.
    secretOutput.innerHTML = "";

    // Validate that first name is not empty.
    if (firstName.length === 0) {
        // Show error using innerHTML.
        validationOutput.innerHTML = "<p class='error-text'>Please enter your first name.</p>";
        // Stop form submit so program does not continue.
        return false;
    }

    // Validate that last name is not empty.
    if (lastName.length === 0) {
        // Show error using innerHTML.
        validationOutput.innerHTML = "<p class='error-text'>Please enter your last name.</p>";
        // Stop form submit so program does not continue.
        return false;
    }

    // Validate full combined name length is not more than 20 characters.
    if (fullName.length > 20) {
        // Show error using innerHTML.
        validationOutput.innerHTML = "<p class='error-text'>Name is too long. First + last name must be 20 characters or less.</p>";
        // Stop form submit so program does not continue.
        return false;
    }

    // Validate ZIP code length is exactly 5 characters.
    if (zipCode.length !== 5) {
        // Show error using innerHTML.
        validationOutput.innerHTML = "<p class='error-text'>ZIP code must be exactly 5 characters long.</p>";
        // Stop form submit so program does not continue.
        return false;
    }

    // Start index counter for character-by-character ZIP validation.
    var index = 0;
    // Loop through each character in the ZIP code.
    while (index < zipCode.length) {
        // Read one character from the ZIP code at the current index.
        var currentChar = zipCode.charAt(index);
        // Check if character is outside numeric range 0 through 9.
        if (currentChar < "0" || currentChar > "9") {
            // Show error using innerHTML.
            validationOutput.innerHTML = "<p class='error-text'>ZIP code must contain only digits (0-9).</p>";
            // Stop form submit so program does not continue.
            return false;
        }
        // Move to the next character.
        index = index + 1;
    }

    // Show success message using innerHTML.
    validationOutput.innerHTML = "<p class='success-text'>Access granted for " + fullName + ".</p>";
    // Show the scrolling banner when access is granted.
    unlockBanner.classList.add("active");
    // Show the secret website message using innerHTML.
    secretOutput.innerHTML =
        "<h2>Secret Message Unlocked</h2>" +
        "<p>Security is not a feature you add at the end. Security is a mindset you apply from the first line of code.</p>" +
        "<p class='tiny-note'>Verified ZIP: " + zipCode + "</p>";

    // Return false to keep results on the same page.
    return false;
}

// Run setup after the external script loads at the bottom of the HTML page.
setupForm();
