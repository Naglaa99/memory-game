// Selecting elements from the DOM for future use
const startGame = document.querySelector(".control-buttons button");
const playerName = document.querySelector(".name span");
const controlButtons = document.querySelector(".control-buttons");
const blocksContainer = document.querySelector(".memory-game-blocks");
const tries = document.querySelector(".tries span");

let maxWrongTries = 5;
let wrongTriesCount = 0;
let matchedPairs = 0;
let yourName = "";
const duration = 1000;
const blocks = Array.from(blocksContainer.children);
const totalPairs = blocks.length / 2;

// Event listener for the start game button click
startGame.addEventListener("click", () => {
  yourName = prompt("What's your name?");
  if (yourName == null || yourName === "") {
    playerName.innerHTML = "Unknown";
  } else {
    playerName.innerHTML = yourName;
  }

  controlButtons.remove();

  // Flip all blocks initially to show them to the player for 3 seconds
  blocks.forEach((block) => {
    block.classList.add("is-flipped");
  });

  // After 3 seconds, flip the blocks back
  setTimeout(() => {
    blocks.forEach((block) => {
      block.classList.remove("is-flipped");
    });
  }, 3000);
});

// Shuffling the order of the blocks
let orderRange = [...Array(blocks.length).keys()];
shuffle(orderRange);

blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  block.addEventListener("click", () => {
    flipBlock(block);
  });
});

// Function to handle flipping a block
function flipBlock(selectBlock) {
  selectBlock.classList.add("is-flipped");

  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );

  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Function to temporarily disable clicking on other blocks
function stopClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// Function to check if two flipped blocks match
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");
    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.getElementById("success").play();

    matchedPairs++;

    // If all pairs are matched, show a congratulations message
    if (matchedPairs === totalPairs) {
      setTimeout(() => {
        Swal.fire({
          title: `Congratulations 🎉 <span style="color: #3691ce;">${yourName}</span>!`,
          text: "You've matched all the blocks!",
          icon: "success",
          confirmButtonText: "Play Again",
        }).then(() => location.reload());
      }, 500);
    }
  } else {
    wrongTriesCount++;
    tries.innerHTML = wrongTriesCount;
    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);

    if (wrongTriesCount >= maxWrongTries) {
      setTimeout(() => {
        Swal.fire({
          title: "Game Over!",
          text: "You've exceeded the maximum number of wrong tries.",
          icon: "error",
          confirmButtonText: "Try Again",
        }).then(() => location.reload());
      }, 500);
    }
  }

  // Play a failure sound if the blocks do not match
  document.getElementById("failed").play();
}

// Function to shuffle an array
function shuffle(array) {
  let current = array.length,
    temp,
    random;

  // While there are elements to shuffle
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;

    // Swap the current element with the random element
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
}
