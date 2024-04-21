const express = require('express');
const crypto = require('crypto');

// Function to calculate SHA-256 hash
function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const app = express();
const port = 3000;

const blockchain = [
    { index: 0, data: 'Genesis Block', previousHash: null, hash: '0000000000000000' },
    { index: 1, data: 'Transaction 1', previousHash: '0000000000000000', hash: '1111111111111111' },
    { index: 2, data: 'Transaction 2', previousHash: '1111111111111111', hash: '2222222222222222' }
];

app.get('/blockchain', (req, res) => {
    res.json(blockchain);
});

// Endpoint for adding a new block to the blockchain
app.post('/block', (req, res) => {
    // Extract data from the request body
    const { data, difficulty } = req.body;

    // Get the previous block's hash (for simplicity, you can assume it's the hash of the last block in the current blockchain)
    const previousHash = blockchain[blockchain.length - 1].hash;

    // Create a new block with the provided data
    const newBlock = createBlock(previousHash, data, difficulty);

    // Verify the nonce value to ensure that the block hash meets the required difficulty level
    if (verifyNonce(newBlock, difficulty)) {
        // Add the new block to the blockchain
        blockchain.push(newBlock);

        // Respond with a success message or the newly added block
        res.json({ message: 'Block added successfully', block: newBlock });
    } else {
        // Respond with an error message indicating that the nonce is invalid
        res.status(400).json({ error: 'Invalid nonce value' });
    }
});

// Function to verify the nonce value of a block
function verifyNonce(block, difficulty) {
    const hash = calculateHash(block);
    return hash.startsWith('0'.repeat(difficulty));
}


// Define a function to calculate the hash of a block
function calculateHash(block) {
    // Combine block data and calculate hash using SHA-256
    const data = `${block.index}${block.timestamp}${block.data}${block.previousHash}${block.nonce}`;
    const hash = sha256(data);
    return hash;
}

// Define a function to create a new block with mining
function createBlock(previousHash, hash, data, difficulty) {
    const timestamp = Date.now();
    let block = {
        index: blockchain.length,
        timestamp: timestamp,
        data: data,
        previousHash: previousHash,
        hash: hash,
        nonce: 0 // Initial nonce value
    };
    return block;
}

// Define a function to perform mining
function mineBlock(block, difficulty) {
    while (true) {
        block.nonce++; // Increment the nonce value
        const hash = calculateHash(block); // Calculate the hash with the new nonce
        if (hash.startsWith('0'.repeat(difficulty))) { // Check if the hash meets the desired difficulty
            return hash; // Return the valid hash
        }
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
