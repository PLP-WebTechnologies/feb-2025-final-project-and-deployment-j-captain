document.addEventListener('DOMContentLoaded', function() {
    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                phone: document.getElementById('phone').value
            };

            try {
                const response = await fetch('/auth/signup.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                if (data.status === 'success') {
                    // Show OTP verification section
                    document.querySelector('.otp-section').style.display = 'block';
                    alert('OTP sent to your email and phone');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during signup');
            }
        });
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            };

            try {
                const response = await fetch('/auth/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                if (data.status === 'success') {
                    window.location.href = '/dashboard.php';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login');
            }
        });
    }
});

// Password strength checker
function checkPasswordStrength(password) {
    // Implementation
}