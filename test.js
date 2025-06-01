// Step 1: Create a Set of used tokenIds
const usedTokenIds = new Set([]);

// Step 2: Build a list of available tokenIds (0–24)
const MAX_ID = 24;
const availableIds = [];

for (let i = 0; i <= MAX_ID; i++) {
  if (!usedTokenIds.has(i)) {
    availableIds.push(i);
  }
}

// Step 4: Pick a random available ID
const randomIndex = Math.floor(Math.random() * availableIds.length);
const newTokenId = availableIds[randomIndex];

console.log(newTokenId);
