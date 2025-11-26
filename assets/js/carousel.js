document.addEventListener('DOMContentLoaded', function() {
    const carouselTracks = document.querySelectorAll('.carousel-track');
    
    carouselTracks.forEach(track => {   
        function getAnimationDuration(track) {
            if (track.classList.contains('sponsors')) return 20;
            if (track.classList.contains('partners')) return 35;
            if (track.classList.contains('donors')) return 40;
            return 30;
        }
        
        // Set up the animation
        const duration = getAnimationDuration(track);
        track.style.animation = `scroll ${duration}s linear infinite`;
    });
});