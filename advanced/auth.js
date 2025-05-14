// auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Slideshow
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slideshow img');
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, 5000);

    // Password Toggle
    document.querySelector('.toggle-password').addEventListener('click', (e) => {
        const passwordInput = document.querySelector('#loginPassword');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        e.target.classList.toggle('fa-eye-slash');
    });

    // Real-time Validation
    const emailInput = document.querySelector('#loginEmail');
    const passwordInput = document.querySelector('#loginPassword');

    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailInput.value);
        showValidation(emailInput, isValid, 'Valid email address');
    }

    function validatePassword() {
        const isValid = passwordInput.value.length >= 8;
        showValidation(passwordInput, isValid, 'Password must be at least 8 characters');
    }

    function showValidation(input, isValid, message) {
        const container = input.closest('.form-group');
        let feedback = container.querySelector('.validation-message');
        
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'validation-message';
            container.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.classList.toggle('success', isValid);
        feedback.classList.toggle('error', !isValid);
    }

    // Form Submission
    document.querySelector('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.querySelector('#loginBtn');
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'Authenticating...';
        btn.querySelector('.loader').classList.remove('hidden');

        // Simulate API call
        setTimeout(() => {
            btn.disabled = false;
            btn.querySelector('.btn-text').textContent = 'Login Successful!';
            btn.querySelector('.loader').classList.add('hidden');
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = 'Login';
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 2000);
    });

    // Secret Action (Long press on logo)
    const logo = document.querySelector('.logo');
    let pressTimer;

    logo.addEventListener('mousedown', startPress);
    logo.addEventListener('mouseup', cancelPress);
    logo.addEventListener('touchstart', startPress);
    logo.addEventListener('touchend', cancelPress);

    function startPress(e) {
        e.preventDefault();
        pressTimer = setTimeout(showSecret, 2000);
    }

    function cancelPress() {
        clearTimeout(pressTimer);
    }

    function showSecret() {
        const secretMessage = document.querySelector('#secretMessage');
        secretMessage.classList.remove('hidden');
        setTimeout(() => secretMessage.classList.add('hidden'), 5000);
    }

    // Enter Key Submission
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.querySelector('#loginBtn').click();
        }
    });

    // Hover Effects
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'scale(1.1) translateY(-5px)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'scale(1) translateY(0)';
        });
    });
});