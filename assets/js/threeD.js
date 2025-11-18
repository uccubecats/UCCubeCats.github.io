
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.setPixelRatio(window.devicePixelRatio);

        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Camera position
        camera.position.z = 3;

        // Earth group
        const earthGroup = new THREE.Group();
        scene.add(earthGroup);

        // Create Earth
        const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
        
        // Load Earth textures
        const textureLoader = new THREE.TextureLoader();
        
        // Using NASA Blue Marble texture
        const earthTexture = textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            function() {
                // Texture loaded successfully
                document.getElementById('loading').style.display = 'none';
            },
            undefined,
            function() {
                // Fallback if texture fails to load
                earthMaterial.color.set(0x2233ff);
                document.getElementById('loading').style.display = 'none';
            }
        );

        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthTexture,
            shininess: 15,
            specular: 0x333333
        });

        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earthGroup.add(earth);

        // Create atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(1.05, 164, 164);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x4488ff,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        earthGroup.add(atmosphere);

        // Create outer glow
        const glowGeometry = new THREE.SphereGeometry(1.15, 64, 64);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { type: "f", value: 0.3 },
                p: { type: "f", value: 4.5 },
                glowColor: { type: "c", value: new THREE.Color(0x4488ff) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        earthGroup.add(glow);


        // Lighting
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(5, 3, 5);
        scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
        fillLight.position.set(-5, 0, -5);
        scene.add(fillLight);

        // Add subtle point lights
        const pointLight1 = new THREE.PointLight(0xffffff, 0.3);
        pointLight1.position.set(3, 0, 3);
        scene.add(pointLight1);

        // OrbitControls for interaction
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 1.5;
        controls.maxDistance = 10;
        controls.enablePan = true;

        // Animation variables
        let time = 0;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            time += 0.001;
            
            // Rotate Earth
            earth.rotation.y += 0.001;
            
            
            // Subtle wobble animation
            earthGroup.rotation.x = Math.sin(time * 0.3) * 0.02;
            
            // Update glow shader
            glowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
                camera.position,
                earthGroup.position
            );
            
            controls.update();
            renderer.render(scene, camera);
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                controls.autoRotate = !controls.autoRotate;
            }
            if (e.key === 'r' || e.key === 'R') {
                camera.position.set(0, 0, 3);
                controls.reset();
            }
        });


        animate();


        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 3000);
    