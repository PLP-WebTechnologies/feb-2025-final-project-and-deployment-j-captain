document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strengthBar = document.querySelector('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            const password = this.value;
            let strength = 0;
            
            // Check password length
            if (password.length >= 8) strength += 1;
            if (password.length >= 12) strength += 1;
            
            // Check for mixed case
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;
            
            // Check for numbers
            if (password.match(/([0-9])/)) strength += 1;
            
            // Check for special chars
            if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;
            
            // Update UI
            const width = (strength / 5) * 100;
            strengthBar.style.width = `${width}%`;
            
            if (strength <= 2) {
                strengthBar.style.backgroundColor = 'var(--error)';
                strengthText.textContent = 'Weak';
            } else if (strength <= 3) {
                strengthBar.style.backgroundColor = 'orange';
                strengthText.textContent = 'Medium';
            } else {
                strengthBar.style.backgroundColor = 'var(--success)';
                strengthText.textContent = 'Strong';
            }
        });
    }

    // Form validation and submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Simulate form submission
            console.log('Form submitted:', {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                nickname: document.getElementById('nickname').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('countryCode').value + document.getElementById('phone').value,
                password: password
            });
            
            // Show OTP modal
            document.getElementById('otpModal').style.display = 'flex';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate login
            console.log('Login attempt with:', {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            });
            
            // Redirect to dashboard (simulated)
            alert('Login successful! Redirecting to dashboard...');
            // window.location.href = 'dashboard.html';
        });
    }

    // OTP input auto-focus
    const otpInputs = document.querySelectorAll('.otp-inputs input');
    if (otpInputs.length > 0) {
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                if (this.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }

    // Close modal
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // OTP form submission
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect OTP
            let otp = '';
            document.querySelectorAll('.otp-inputs input').forEach(input => {
                otp += input.value;
            });
            
            console.log('OTP submitted:', otp);
            
            // Simulate verification
            alert('Account verified successfully! Redirecting to login...');
            document.getElementById('otpModal').style.display = 'none';
            // window.location.href = 'login.html';
        });
    }
});