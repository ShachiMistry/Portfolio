document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Canvas Interactive Node Background
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    let particles = [];
    const maxParticles = Math.min(65, Math.floor((width * height) / 20000)); // Adaptive particle count
    const connectionDist = 120;
    
    const mouse = {
        x: null,
        y: null,
        radius: 180
    };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary bounce
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.hypot(dx, dy);
                
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Gently pull nodes towards mouse
                    this.x -= (dx / dist) * force * 0.6;
                    this.y -= (dy / dist) * force * 0.6;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(150, 123, 179, 0.4)';
            ctx.fill();
        }
    }
    
    function initCanvas() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.hypot(dx, dy);
                
                if (dist < connectionDist) {
                    let alpha = (connectionDist - dist) / connectionDist;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.18})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animateCanvas);
    }
    
    initCanvas();
    animateCanvas();
    
    
    // ==========================================
    // 2. Terminal Typewriter Animation
    // ==========================================
    const commands = [
        'git clone https://github.com/ShachiMistry/data-platform.git',
        'pip install tritonclient[all] nvml-python',
        'python3 -m unittest test_distributed_idempotency',
        'cat welcome_message.txt'
    ];
    
    const typewriterCmd = document.getElementById('typewriter-cmd');
    let currentCmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeCommand() {
        let currentString = commands[currentCmdIndex];
        
        if (isDeleting) {
            typewriterCmd.textContent = currentString.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterCmd.textContent = currentString.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typingSpeed = isDeleting ? 30 : 75;
        
        if (!isDeleting && charIndex === currentString.length) {
            typingSpeed = 2500; // Pause at end of command
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentCmdIndex = (currentCmdIndex + 1) % commands.length;
            typingSpeed = 500; // Pause before typing next command
        }
        
        setTimeout(typeCommand, typingSpeed);
    }
    
    if (typewriterCmd) {
        setTimeout(typeCommand, 1000);
    }
    
    
    // ==========================================
    // 3. Navigation Scroll Observer & Glass Effect
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active section highligher
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Logo scroll to top
    const logo = document.getElementById('nav-logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    
    // ==========================================
    // 4. Fade-in Element Animations
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });
    
    
    // ==========================================
    // 5. Projects Filter Logic
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    // Trigger fade-in animation again
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    
    // ==========================================
    // 6. Interactive Simulators
    // ==========================================
    
    // (A) Triton Performance Simulator
    const btnTriton = document.getElementById('btn-triton-sim');
    const panelTriton = document.getElementById('triton-panel');
    const chartTriton = document.getElementById('triton-chart');
    let tritonInterval = null;
    
    // Create initial chart bars
    const numBars = 16;
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        chartTriton.appendChild(bar);
    }
    const chartBars = document.querySelectorAll('#triton-chart .chart-bar');
    
    btnTriton.addEventListener('click', () => {
        if (panelTriton.style.display === 'none') {
            panelTriton.style.display = 'block';
            btnTriton.innerHTML = '<i class="fas fa-stop"></i> Stop Telemetry Stream';
            
            // Start simulation loop
            tritonInterval = setInterval(() => {
                // Update chart heights randomly
                chartBars.forEach(bar => {
                    const h = Math.floor(Math.random() * 85) + 10;
                    bar.style.height = `${h}%`;
                });
                
                // Update metrics with realistic random variations
                const throughput = Math.floor(Math.random() * 400) + 1750;
                const p50 = (Math.random() * 1.2 + 1.8).toFixed(1);
                const p99 = (Math.random() * 3.5 + 5.2).toFixed(1);
                const load = Math.floor(Math.random() * 18) + 78;
                const vram = (Math.random() * 0.8 + 14.4).toFixed(1);
                
                document.getElementById('triton-throughput').textContent = `${throughput} req/s`;
                document.getElementById('triton-p50').textContent = `${p50} ms`;
                document.getElementById('triton-p99').textContent = `${p99} ms`;
                document.getElementById('triton-load').textContent = `${load}%`;
                document.getElementById('triton-vram').textContent = `${vram} GB`;
            }, 250);
        } else {
            panelTriton.style.display = 'none';
            btnTriton.innerHTML = '<i class="fas fa-play"></i> Run Inference Benchmark';
            clearInterval(tritonInterval);
        }
    });
    
    // (B) LayoverOS RAG Trace Simulator
    const btnRag = document.getElementById('btn-rag-sim');
    const panelRag = document.getElementById('rag-panel');
    let ragInterval = null;
    let currentRagStep = 0;
    
    btnRag.addEventListener('click', () => {
        if (panelRag.style.display === 'none') {
            panelRag.style.display = 'flex';
            btnRag.innerHTML = '<i class="fas fa-stop"></i> Reset Trace Output';
            
            const steps = document.querySelectorAll('.rag-step');
            steps.forEach(s => s.classList.remove('active'));
            currentRagStep = 0;
            
            // Trigger trace updates step-by-step
            steps[currentRagStep].classList.add('active');
            
            ragInterval = setInterval(() => {
                steps[currentRagStep].classList.remove('active');
                currentRagStep = (currentRagStep + 1) % steps.length;
                steps[currentRagStep].classList.add('active');
            }, 1800);
        } else {
            panelRag.style.display = 'none';
            btnRag.innerHTML = '<i class="fas fa-search-location"></i> Trace RAG Pipeline';
            clearInterval(ragInterval);
        }
    });
    
    // (C) Spark Cluster Simulator
    const btnSpark = document.getElementById('btn-spark-sim');
    const panelSpark = document.getElementById('spark-panel');
    let sparkInterval = null;
    
    const nodeBars = {
        master: { bar: document.getElementById('node-master-bar'), state: document.getElementById('node-master-state'), progress: 0, vx: 0.8 },
        worker1: { bar: document.getElementById('node-worker1-bar'), state: document.getElementById('node-worker1-state'), progress: 0, vx: 1.5 },
        worker2: { bar: document.getElementById('node-worker2-bar'), state: document.getElementById('node-worker2-state'), progress: 0, vx: 2.2 }
    };
    
    btnSpark.addEventListener('click', () => {
        if (panelSpark.style.display === 'none') {
            panelSpark.style.display = 'flex';
            btnSpark.innerHTML = '<i class="fas fa-stop"></i> Disconnect Spark Cluster';
            
            // Loop for cluster block processing simulation
            sparkInterval = setInterval(() => {
                for (let key in nodeBars) {
                    const node = nodeBars[key];
                    node.progress += node.vx + (Math.random() - 0.5) * 0.4;
                    
                    if (node.progress >= 100) {
                        node.progress = 0;
                        node.state.textContent = 'REDUCING';
                        node.state.style.color = '#a855f7';
                    } else if (node.progress > 5 && node.progress < 85) {
                        node.state.textContent = 'MAPPING';
                        node.state.style.color = '#00f0ff';
                    } else if (node.progress >= 85) {
                        node.state.textContent = 'SHUFFLING';
                        node.state.style.color = '#f59e0b';
                    } else {
                        node.state.textContent = 'IDLE';
                        node.state.style.color = '#64748b';
                    }
                    
                    node.bar.style.width = `${Math.min(100, Math.max(0, node.progress))}%`;
                }
            }, 60);
        } else {
            panelSpark.style.display = 'none';
            btnSpark.innerHTML = '<i class="fas fa-network-wired"></i> Monitor Spark Cluster';
            clearInterval(sparkInterval);
            
            // Reset bars
            for (let key in nodeBars) {
                const node = nodeBars[key];
                node.progress = 0;
                node.bar.style.width = '0%';
                node.state.textContent = 'IDLE';
                node.state.style.color = '#64748b';
            }
        }
    });
    
});
