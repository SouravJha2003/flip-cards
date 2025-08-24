// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Get DOM elements
    const changeColorBtn = document.getElementById('changeColorBtn');
    const title = document.querySelector('.title');
    const subtitle = document.querySelector('.subtitle');
    const flipCard = document.querySelector('.flip-card');

    // Array of color combinations for the background
    const colorSchemes = [
        { primary: '#667eea', secondary: '#764ba2' },
        { primary: '#f093fb', secondary: '#f5576c' },
        { primary: '#4facfe', secondary: '#00f2fe' },
        { primary: '#43e97b', secondary: '#38f9d7' },
        { primary: '#fa709a', secondary: '#fee140' }
    ];

    let currentColorIndex = 0;

    // Function to change background colors
    function changeColors() {
        currentColorIndex = (currentColorIndex + 1) % colorSchemes.length;
        const colors = colorSchemes[currentColorIndex];

        document.body.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;

        // Add a subtle animation effect
        title.style.transform = 'scale(1.1)';
        setTimeout(() => {
            title.style.transform = 'scale(1)';
        }, 200);
    }

    // Add click event to the button
    changeColorBtn.addEventListener('click', changeColors);

    // Add click event to the flip card for additional interaction
    flipCard.addEventListener('click', function () {
        // Add a bounce effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);

        // Update subtitle text randomly
        const randomMessages = [
            'Welcome to my simple page',
            'Click the card to see it flip!',
            'Try the color changing button!',
            'Hello World is awesome!',
            'Welcome to the flip-cards demo!'
        ];

        const randomIndex = Math.floor(Math.random() * randomMessages.length);
        subtitle.textContent = randomMessages[randomIndex];

        // Add a fade effect to the subtitle
        subtitle.style.opacity = '0';
        setTimeout(() => {
            subtitle.style.opacity = '1';
        }, 100);
    });

    // Add some initial animation when page loads
    setTimeout(() => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            title.style.transition = 'all 0.8s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 100);
    }, 500);

    // Add keyboard support
    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            event.preventDefault();
            changeColors();
        } else if (event.code === 'Enter') {
            flipCard.click();
        }
    });

    // Add some console logging for fun
    console.log('Hello World! Welcome to the flip-cards demo!');
    console.log('Press SPACE to change colors, ENTER to flip the card!');
});
