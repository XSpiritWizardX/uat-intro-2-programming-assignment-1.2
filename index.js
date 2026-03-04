// Store the repeating timer id used to move the meme image.
var memeIntervalId = null;
// Store the current horizontal pixel position of the meme.
var memePositionX = 0;
// Store the current vertical pixel position of the meme.
var memePositionY = 0;
// Store horizontal movement speed and direction.
var memeStepX = 8;
// Store vertical movement speed and direction.
var memeStepY = 6;

// Initialize button states and status text when the page loads.
window.onload = initializeMemeControls;

// Setup function to prepare controls for event-driven start/stop behavior.
function initializeMemeControls() {
    // Get the Start button element.
    var startButton = document.getElementById("startButton");
    // Get the Stop button element.
    var stopButton = document.getElementById("stopButton");
    // Get the status output paragraph.
    var memeStatus = document.getElementById("memeStatus");

    // Enable Start button by default.
    startButton.disabled = false;
    // Disable Stop button by default.
    stopButton.disabled = true;
    // Show startup status text using innerHTML.
    memeStatus.innerHTML = "Press Start to move the meme around the page.";
}

// Start-button handler that toggles buttons and starts meme movement.
function startMemeButtonAction() {
    // Get the Start button element.
    var startButton = document.getElementById("startButton");
    // Get the Stop button element.
    var stopButton = document.getElementById("stopButton");
    // Get the status output paragraph.
    var memeStatus = document.getElementById("memeStatus");

    // Disable Start while movement is active.
    startButton.disabled = true;
    // Enable Stop while movement is active.
    stopButton.disabled = false;
    // Show active movement status using innerHTML.
    memeStatus.innerHTML = "Meme movement is active. Press Stop to freeze it.";

    // Call movement starter function.
    beginMemeMotion();
}

// Stop-button handler that toggles buttons and stops meme movement.
function stopMemeButtonAction() {
    // Get the Start button element.
    var startButton = document.getElementById("startButton");
    // Get the Stop button element.
    var stopButton = document.getElementById("stopButton");
    // Get the status output paragraph.
    var memeStatus = document.getElementById("memeStatus");

    // Enable Start after stopping movement.
    startButton.disabled = false;
    // Disable Stop after stopping movement.
    stopButton.disabled = true;
    // Show stopped status using innerHTML.
    memeStatus.innerHTML = "Meme movement stopped. Press Start to move it again.";

    // Call movement stopper function.
    stopMemeMotion();
}

// Movement starter that converts the meme image into a floating animated object.
function beginMemeMotion() {
    // If movement is already running, do not start another timer.
    if (memeIntervalId !== null) {
        // Exit early to avoid duplicate timers.
        return;
    }

    // Get the meme image element.
    var memeImage = document.getElementById("memeImage");
    // Capture current on-screen position before switching to fixed movement.
    var currentRect = memeImage.getBoundingClientRect();

    // Set fixed positioning so image can move around viewport.
    memeImage.style.position = "fixed";
    // Lift the image above other layout elements.
    memeImage.style.zIndex = "1000";
    // Remove right margin while moving.
    memeImage.style.marginRight = "0";

    // Save starting x position.
    memePositionX = currentRect.left;
    // Save starting y position.
    memePositionY = currentRect.top;

    // Apply initial x coordinate.
    memeImage.style.left = memePositionX + "px";
    // Apply initial y coordinate.
    memeImage.style.top = memePositionY + "px";

    // Start repeating movement updates.
    memeIntervalId = setInterval(moveMemeOneStep, 35);
}

// Movement tick function that updates meme position and bounces off viewport edges.
function moveMemeOneStep() {
    // Get the meme image element.
    var memeImage = document.getElementById("memeImage");
    // Calculate maximum valid x position inside viewport.
    var maxX = window.innerWidth - memeImage.offsetWidth;
    // Calculate maximum valid y position inside viewport.
    var maxY = window.innerHeight - memeImage.offsetHeight;

    // Add horizontal step to current position.
    memePositionX = memePositionX + memeStepX;
    // Add vertical step to current position.
    memePositionY = memePositionY + memeStepY;

    // Bounce
    
    // Bounce horizontally if image hits left or right edge.
    if (memePositionX <= 0 || memePositionX >= maxX) {
        // Reverse horizontal direction.
        memeStepX = memeStepX * -1;
        // Clamp x position inside bounds.
        memePositionX = Math.max(0, Math.min(memePositionX, maxX));
    }

    // Bounce vertically if image hits top or bottom edge.
    if (memePositionY <= 0 || memePositionY >= maxY) {
        // Reverse vertical direction.
        memeStepY = memeStepY * -1;
        // Clamp y position inside bounds.
        memePositionY = Math.max(0, Math.min(memePositionY, maxY));
    }

    // Apply new horizontal position.
    memeImage.style.left = memePositionX + "px";
    // Apply new vertical position.
    memeImage.style.top = memePositionY + "px";
}

// Movement stopper that clears the repeating timer.
function stopMemeMotion() {
    // If no timer exists, nothing needs to stop.
    if (memeIntervalId === null) {
        // Exit early when already stopped.
        return;
    }

    // Clear the active movement interval.
    clearInterval(memeIntervalId);
    // Reset timer id to indicate stopped state.
    memeIntervalId = null;
}
