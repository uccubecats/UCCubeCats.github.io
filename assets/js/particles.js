
    const donateButton = document.getElementById('donateButton');
    const starContainer = document.getElementById('starContainer');
    let isHovering = false;
    let hoverInterval;

    
    function createStar(isClicked = false) {
        const star = document.createElement('div');
        star.className = isClicked ? 'star clicked exploding' : 'star animating';
        

        // Set initial position
        star.style.left = '50%';  
        star.style.top = '50%';   

        
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        star.style.setProperty('--tx', `${tx}px`);
        star.style.setProperty('--ty', `${ty}px`);
        
        starContainer.appendChild(star);
        
        // Remove star after animation
        setTimeout(() => {
            star.remove();
        }, isClicked ? 1200 : 1000);
    }

    // Generate stars continuously on hover
    function startStarGeneration() {
        createStar(false);
    }

    // Hover event 
    donateButton.addEventListener('mouseenter', () => {
        isHovering = true;
        hoverInterval = setInterval(() => {
            if (isHovering) {
                startStarGeneration();
            }
        }, 50);
    });

    donateButton.addEventListener('mouseleave', () => {
        isHovering = false;
        clearInterval(hoverInterval);
    });

    // Click event 
    donateButton.addEventListener('click', () => {
        // Create burst of stars
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createStar(true);
            }, i * 30);
        }
        
        // window.location.href = 'your-donate-link';
    });