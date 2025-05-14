<?php
header("Content-Type: application/json");
require_once 'db.php';

$response = ['success' => false, 'message' => ''];

// Signup endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'signup') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (empty($data['firstName']) || empty($data['lastName']) || empty($data['email']) || empty($data['phone']) || empty($data['password'])) {
        $response['message'] = 'All fields are required';
        echo json_encode($response);
        exit;
    }
    
    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        $response['message'] = 'Email already exists';
        echo json_encode($response);
        exit;
    }
    
    // Hash password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, nickname, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt->execute([$data['firstName'], $data['lastName'], $data['nickname'], $data['email'], $data['phone'], $hashedPassword])) {
        // Generate OTP
        $otp = rand(100000, 999999);
        $userId = $pdo->lastInsertId();
        
        // Store OTP (in a real app, you'd store this with an expiration)
        $stmt = $pdo->prepare("INSERT INTO otps (user_id, code) VALUES (?, ?)");
        $stmt->execute([$userId, $otp]);
        
        // Send OTP to email and phone (simulated)
        // In production, use services like Twilio for SMS and PHPMailer for email
        
        $response['success'] = true;
        $response['message'] = 'Signup successful. OTP sent to your email and phone.';
        $response['userId'] = $userId;
    } else {
        $response['message'] = 'Registration failed';
    }
}

// Verify OTP endpoint
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'verify') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("SELECT * FROM otps WHERE user_id = ? AND code = ?");
    $stmt->execute([$data['userId'], $data['otp']]);
    $otpRecord = $stmt->fetch();
    
    if ($otpRecord) {
        // Mark user as verified
        $stmt = $pdo->prepare("UPDATE users SET verified = 1 WHERE id = ?");
        $stmt->execute([$data['userId']]);
        
        // Delete used OTP
        $stmt = $pdo->prepare("DELETE FROM otps WHERE id = ?");
        $stmt->execute([$otpRecord['id']]);
        
        $response['success'] = true;
        $response['message'] = 'Verification successful';
    } else {
        $response['message'] = 'Invalid OTP';
    }
}

// Login endpoint
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($data['password'], $user['password'])) {
        if (!$user['verified']) {
            $response['message'] = 'Account not verified';
        } else {
            // Create session (in a real app, you'd use proper session handling)
            session_start();
            $_SESSION['user_id'] = $user['id'];
            
            $response['success'] = true;
            $response['message'] = 'Login successful';
        }
    } else {
        $response['message'] = 'Invalid email or password';
    }
}

echo json_encode($response);