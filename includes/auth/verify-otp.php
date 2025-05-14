<?php
require '../includes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (empty($data['email']) || empty($data['otp'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Email and OTP are required']);
    exit;
}

$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$otp = filter_var(trim($data['otp']), FILTER_SANITIZE_STRING);

try {
    // Verify OTP
    $stmt = $pdo->prepare("UPDATE users SET verified = 1 WHERE email = ? AND otp = ?");
    $stmt->execute([$email, $otp]);
    
    if ($stmt->rowCount() > 0) {
        // Start session and log user in
        session_start();
        $_SESSION['user_email'] = $email;
        
        echo json_encode(['status' => 'success', 'message' => 'Account verified successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid OTP or email']);
    }
} catch (PDOException $e) {
    error_log("OTP Verification Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Verification failed. Please try again.']);
}
?>