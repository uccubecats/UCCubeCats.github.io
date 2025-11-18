
document.addEventListener('DOMContentLoaded', function() {
    const carouselTracks = document.querySelectorAll('.carousel-track');
    
    carouselTracks.forEach(track => {   
        let isDown = false;
        let startX;
        let currentX;
        let previousX;
        let velocity = 0;
        let animationId;
        let lastTime = Date.now();
        
       // For the animation to pick up where it left off
        function getAnimationDuration(track) {
            if (track.classList.contains('sponsors')) return 20;
            if (track.classList.contains('partners')) return 35;
            if (track.classList.contains('donors')) return 40;
            return 30;
        }
        
        
        function getCurrentTransform() {
            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            return matrix.m41;
        }
        
        
        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.classList.add('dragging');
            startX = e.pageX;
            previousX = e.pageX;
            currentX = getCurrentTransform();
            velocity = 0;
            lastTime = Date.now();
            
            // Stop any ongoing animation
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            
            track.style.animation = 'none';
            
            e.preventDefault();
        });
        
        
        track.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                track.classList.remove('dragging');
                applyMomentum();
            }
        });
        
        
        track.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                track.classList.remove('dragging');
                applyMomentum();
            }
        });
        
        
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            
            const now = Date.now();
            const dt = now - lastTime;
            const x = e.pageX;
            const dx = x - previousX;
            
            // Calculate velocity for momentum
            if (dt > 0) {
                velocity = dx / dt * 16; // Normalize to 60fps
            }
            
            currentX += dx;
            track.style.transform = `translateX(${currentX}px)`;
            
            previousX = x;
            lastTime = now;
        });
        
        
        track.addEventListener('touchstart', (e) => {
            isDown = true;
            track.classList.add('dragging');
            startX = e.touches[0].pageX;
            previousX = e.touches[0].pageX;
            currentX = getCurrentTransform();
            velocity = 0;
            lastTime = Date.now();
            
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            track.style.animation = 'none';
        });
        
        track.addEventListener('touchend', () => {
            if (isDown) {
                isDown = false;
                track.classList.remove('dragging');
                applyMomentum();
            }
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            
            const now = Date.now();
            const dt = now - lastTime;
            const x = e.touches[0].pageX;
            const dx = x - previousX;
            
            if (dt > 0) {
                velocity = dx / dt * 16;
            }
            
            currentX += dx;
            track.style.transform = `translateX(${currentX}px)`;
            
            previousX = x;
            lastTime = now;
        });
        
        // Apply momentum effect
        function applyMomentum() {
            const friction = 0.95; 
            const minVelocity = 0.5;
            
            function animate() {
                velocity *= friction;
                
                
                currentX += velocity;
                track.style.transform = `translateX(${currentX}px)`;
                
                
                if (Math.abs(velocity) > minVelocity) {
                    animationId = requestAnimationFrame(animate);
                } else {

                    // When momentum stops, transition back to CSS animation
                    resumeAnimation();
                }
            }
            
            // Only apply momentum if there's significant velocity
            if (Math.abs(velocity) > minVelocity) {
                animate();
            } else {
                resumeAnimation();
            }
        }
        
    
        function resumeAnimation() {
            const trackWidth = track.scrollWidth / 2;
            let position = currentX % trackWidth;
            
            
            if (position > 0) {
                position = position - trackWidth;
            }
            
            
            const percentage = (Math.abs(position) / trackWidth) * 100;
            
            
            track.style.transform = `translateX(${position}px)`;
            
            
            requestAnimationFrame(() => {
                const duration = getAnimationDuration(track);
                track.style.animation = `scroll ${duration}s linear infinite`;
                track.style.animationDelay = `-${(percentage / 100) * duration}s`;
            });
        }
    });
});