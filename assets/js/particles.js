
        let isHovering = false;
        let particles;

        // Initialize particles.js
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 200,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle',
                },
                opacity: {
                    value: 0.8,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    },
                    resize: true
                }
            },
            retina_detect: true
        });

        const button = document.getElementById('spaceBtn');
        const buttonContainer = document.querySelector('.button-container');

        // Get button position
        function getButtonCenter() {
            const button = document.getElementById('spaceBtn');
            const canvas = document.getElementById('particles-js');
            
            const buttonRect = button.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            // Calculate button center relative to canvas
            const x = buttonRect.left - canvasRect.left + buttonRect.width / 2;
            const y = buttonRect.top - canvasRect.top + buttonRect.height / 2;
            
            return { x, y };
        }

        // Hover effect - attract particles
        button.addEventListener('mouseenter', () => {
            isHovering = true;
            attractParticles();
        });

        button.addEventListener('mouseleave', () => {
            isHovering = false;
        });

        function attractParticles() {
            if (!isHovering) return;

            const buttonPos = getButtonCenter();
            const pJSDom = window.pJSDom;
            
            if (pJSDom && pJSDom[0] && pJSDom[0].pJS.particles.array) {
                const particles = pJSDom[0].pJS.particles.array;
                
                // Adjust pull distance based on screen size for laptop optimization
                const pullDistance = window.innerWidth > 1024 ? 400 : 300;
                
                particles.forEach(particle => {
                    const dx = (buttonPos.x - particle.x) * .1;
                    const dy = (buttonPos.y - particle.y) * .1;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < pullDistance) {
                        const force = .09;
                        particle.vx += (dx / distance) * force * 0.5;
                        particle.vy += (dy / distance) * force * 0.5;
                    }
                });
            }

            requestAnimationFrame(attractParticles);
        }

        // Click effect - burst of red particles
        button.addEventListener('click', (e) => {
            const buttonPos = getButtonCenter();
            const particleCount = 500;

            // For burst particles (DOM elements), convert back to viewport coordinates
            const canvas = document.getElementById('particles-js');
            const canvasRect = canvas.getBoundingClientRect();
            const viewportX = buttonPos.x + canvasRect.left;
            const viewportY = buttonPos.y + canvasRect.top;

            for (let i = 0; i < particleCount; i++) {
                createBurstParticle(viewportX, viewportY);
            }
        });

        function createBurstParticle(x, y) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            
            // Random angle for burst effect
            const angle = Math.random() * Math.PI * 2;
            const velocity = 3 + Math.random() * 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);

            let posX = x;
            let posY = y;
            let opacity = 1;
            let velocityX = vx;
            let velocityY = vy;

            function animate() {
                posX += velocityX * 2;
                posY += velocityY * 2;
                velocityY += .1; // Gravity
                opacity -= 0.02;

                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }

            animate();
        }