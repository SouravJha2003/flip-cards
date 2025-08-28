// Memory Card Game
class MemoryCardGame {
    constructor() {
        this.gameState = {
            isPlaying: false,
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: 0,
            flipCount: 0,
            startTime: null,
            timer: null
        };

        this.cards = [];
        this.playerName = '';
        this.pairCount = 5;

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.playerNameInput = document.getElementById('playerName');
        this.pairCountSelect = document.getElementById('pairCount');
        this.startGameBtn = document.getElementById('startGameBtn');
        this.gameModal = document.getElementById('gameModal');
        this.successModal = document.getElementById('successModal');
        this.gameBoard = document.getElementById('gameBoard');
        this.gamePlayerName = document.getElementById('gamePlayerName');
        this.flipCountElement = document.getElementById('flipCount');
        this.gameTimerElement = document.getElementById('gameTimer');
        this.closeGameBtn = document.getElementById('closeGameBtn');
        this.backToMenuBtn = document.getElementById('backToMenuBtn');

        // Success modal elements
        this.successPlayerName = document.getElementById('successPlayerName');
        this.successTime = document.getElementById('successTime');
        this.successFlips = document.getElementById('successFlips');
        this.successPairs = document.getElementById('successPairs');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.backToMenuSuccessBtn = document.getElementById('backToMenuSuccessBtn');
    }

    bindEvents() {
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.closeGameBtn.addEventListener('click', () => this.closeGame());
        this.backToMenuBtn.addEventListener('click', () => this.backToMenu());

        // Success modal events
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.backToMenuSuccessBtn.addEventListener('click', () => this.backToMenuFromSuccess());

        // Close modal when clicking outside
        this.gameModal.addEventListener('click', (e) => {
            if (e.target === this.gameModal) {
                this.closeGame();
            }
        });

        this.successModal.addEventListener('click', (e) => {
            if (e.target === this.successModal) {
                this.closeSuccessModal();
            }
        });
    }

    startGame() {
        const playerName = this.playerNameInput.value.trim();
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }

        this.playerName = playerName;
        this.pairCount = parseInt(this.pairCountSelect.value);
        this.gameState.totalPairs = this.pairCount;

        this.showGameModal();
        this.initializeGame();
    }

    showGameModal() {
        this.gameModal.style.display = 'block';
        this.gamePlayerName.textContent = this.playerName;
    }

    closeGame() {
        this.gameModal.style.display = 'none';
        this.stopTimer();
        this.resetGame();
    }

    backToMenu() {
        this.closeGame();
        this.resetGame();
    }

    newGame() {
        this.resetGame();
        this.initializeGame();
    }

    initializeGame() {
        this.gameState.isPlaying = true;
        this.gameState.flippedCards = [];
        this.gameState.matchedPairs = 0;
        this.gameState.totalPairs = this.pairCount;
        this.gameState.flipCount = 0;
        this.gameState.startTime = Date.now();

        this.createCards();
        this.shuffleCards();
        this.renderGameBoard();
        this.startTimer();
        this.updateDisplay();
    }

    createCards() {
        this.cards = [];
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < this.pairCount; i++) {
            const letter = alphabet[i];
            // Create two cards with the same letter
            this.cards.push({
                id: `card-${i}-1`,
                letter: letter,
                isFlipped: false,
                isMatched: false
            });
            this.cards.push({
                id: `card-${i}-2`,
                letter: letter,
                isFlipped: false,
                isMatched: false
            });
        }
    }

    shuffleCards() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderGameBoard() {
        this.gameBoard.innerHTML = '';

        // Set grid class based on pair count
        this.gameBoard.className = `game-board grid-${this.pairCount}`;

        this.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            this.gameBoard.appendChild(cardElement);
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
        cardDiv.dataset.id = card.id;

        cardDiv.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${card.letter}</div>
            </div>
        `;

        cardDiv.addEventListener('click', () => this.flipCard(card.id));

        return cardDiv;
    }

    flipCard(cardId) {
        if (!this.gameState.isPlaying) return;

        const card = this.cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        // Flip the card
        card.isFlipped = true;

        // Add to flipped cards
        this.gameState.flippedCards.push(card);

        // Update display
        this.updateCardDisplay(cardId);

        // Check if we have two flipped cards
        if (this.gameState.flippedCards.length === 2) {
            // Count this as one step (two flips = one step)
            this.gameState.flipCount++;
            this.updateDisplay();
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.gameState.flippedCards;

        if (card1.letter === card2.letter) {
            // Match found!
            card1.isMatched = true;
            card2.isMatched = true;
            this.gameState.matchedPairs++;

            // Update display
            this.updateCardDisplay(card1.id);
            this.updateCardDisplay(card2.id);

            // Check if game is complete
            if (this.gameState.matchedPairs === this.gameState.totalPairs) {
                this.gameComplete();
            }
        } else {
            // No match, flip cards back after delay
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;

                this.updateCardDisplay(card1.id);
                this.updateCardDisplay(card2.id);
            }, 1000);
        }

        // Reset flipped cards
        this.gameState.flippedCards = [];
    }

    updateCardDisplay(cardId) {
        const cardElement = document.querySelector(`[data-id="${cardId}"]`);
        if (cardElement) {
            const card = this.cards.find(c => c.id === cardId);
            cardElement.className = `card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
        }
    }

    updateDisplay() {
        this.flipCountElement.textContent = this.gameState.flipCount;
    }

    startTimer() {
        // Clear any existing timer first
        this.stopTimer();
        
        this.gameState.timer = setInterval(() => {
            if (this.gameState.startTime && this.gameState.isPlaying) {
                const elapsed = Date.now() - this.gameState.startTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                this.gameTimerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopTimer(resetDisplay = true) {
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
            this.gameState.timer = null;
        }
        // Only reset the timer display if explicitly requested
        if (resetDisplay && this.gameTimerElement) {
            this.gameTimerElement.textContent = '00:00';
        }
    }

    gameComplete() {
        this.gameState.isPlaying = false;
        
        // Capture the final time BEFORE stopping the timer
        const totalTime = this.gameTimerElement.textContent;
        const totalSteps = this.gameState.flipCount;
        const totalPairs = this.gameState.totalPairs;
        
        // Now stop the timer without resetting the display
        this.stopTimer(false);

        // Calculate performance rating
        const performanceRating = this.calculatePerformanceRating(totalSteps, totalPairs);

        // Update success modal with final stats
        this.successPlayerName.textContent = this.playerName;
        this.successTime.textContent = totalTime;
        this.successFlips.textContent = totalSteps;
        this.successPairs.textContent = totalPairs;

        // Update success message based on performance
        this.updateSuccessMessage(performanceRating, totalSteps, totalPairs);

        // Hide game modal and show success modal
        this.gameModal.style.display = 'none';
        this.showSuccessModal();
    }

    calculatePerformanceRating(steps, pairs) {
        const ratio = steps / pairs;

        if (ratio <= 1) {
            return 'excellent';
        } else if (ratio <= 2) {
            return 'good';
        } else if (ratio <= 3) {
            return 'average';
        } else {
            return 'bad';
        }
    }

    updateSuccessMessage(rating, steps, pairs) {
        const successMessage = document.querySelector('.success-message');

        let messageHTML = '';

        switch (rating) {
            case 'excellent':
                messageHTML = `
                    <p>🏆 EXCELLENT PERFORMANCE! 🏆</p>
                    <p>You're a memory genius! Perfect score!</p>
                `;
                break;
            case 'good':
                messageHTML = `
                    <p>🎯 GREAT JOB! 🎯</p>
                    <p>You have excellent memory skills!</p>
                `;
                break;
            case 'average':
                messageHTML = `
                    <p>👍 GOOD EFFORT! 👍</p>
                    <p>You did well! Keep practicing to improve.</p>
                `;
                break;
            case 'bad':
                messageHTML = `
                    <p>💪 KEEP PRACTICING! 💪</p>
                    <p>Don't worry, memory improves with practice!</p>
                `;
                break;
        }

        // Add improvement suggestion if steps > 2x pairs
        if (steps > pairs * 2) {
            messageHTML += `
                <div class="improvement-tip">
                    <p>💡 <strong>Improvement Tip:</strong></p>
                    <p>Try to remember card positions better. Take your time and focus!</p>
                </div>
            `;
        }

        successMessage.innerHTML = messageHTML;
    }

    showSuccessModal() {
        this.successModal.style.display = 'block';
    }

    closeSuccessModal() {
        this.successModal.style.display = 'none';
    }

    playAgain() {
        this.closeSuccessModal();
        this.resetGame();
        // Ensure timer is completely stopped and reset
        this.stopTimer();
        // Reset the flip count display
        this.flipCountElement.textContent = '0';
        // Ensure we have the correct pair count before initializing
        if (this.pairCount && this.pairCount > 0) {
            this.initializeGame();
            this.showGameModal();
        } else {
            // Fallback: go back to main menu if pair count is invalid
            console.warn('Invalid pair count, returning to main menu');
            this.backToMenuFromSuccess();
        }
    }

    backToMenuFromSuccess() {
        this.closeSuccessModal();
        this.resetGame();
    }

    resetGame() {
        this.gameState.isPlaying = false;
        this.gameState.flippedCards = [];
        this.gameState.matchedPairs = 0;
        this.gameState.totalPairs = 0;
        this.gameState.flipCount = 0;
        this.gameState.startTime = null;
        this.stopTimer();

        this.cards = [];
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = 'game-board';

        this.updateDisplay();
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryCardGame();
});

