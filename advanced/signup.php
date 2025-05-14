<?php
require '../includes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (empty($data['name']) || empty($data['email']) || empty($data['password']) || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Sanitize and validate inputs
$name = filter_var(trim($data['name']), FILTER_SANITIZE_STRING);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone = preg_replace('/[^0-9]/', '', $data['phone']);
$otp = rand(100000, 999999);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit;
}

if (strlen($data['password']) < 8) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 8 characters']);
    exit;
}

$password = password_hash($data['password'], PASSWORD_BCRYPT);

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
        exit;
    }

    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, phone, otp) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $password, $phone, $otp]);

    // Send OTPs
    require '../includes/mailer.php';
    require '../includes/sms.php';
    
    $emailSent = sendOTPEmail($email, $otp);
    $smsSent = sendOTPSMS($phone, $otp);

    if (!$emailSent || !$smsSent) {
        error_log("Failed to send OTP - Email: " . ($emailSent ? 'Yes' : 'No') . " | SMS: " . ($smsSent ? 'Yes' : 'No'));
    }

    echo json_encode([
        'status' => 'success', 
        'message' => 'OTP sent to your email and phone',
        'email_sent' => $emailSent,
        'sms_sent' => $smsSent,
        'email' => $email // Include email for verification step
    ]);
    
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Registration failed. Please try again.']);
}
?>