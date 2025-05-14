<?php
require '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() === 0) {
            echo json_encode(['status' => 'error', 'message' => 'Email not found']);
            exit;
        }

        // Generate unique token
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Store token in database
        $stmt = $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$email, $token, $expires]);

        // Send email with reset link
        $resetLink = "https://yourdomain.com/auth/process-reset.php?token=$token";
        $subject = "Football Arena Password Reset";
        $message = "Click this link to reset your password: $resetLink\n\n";
        $message .= "This link will expire in 1 hour.";
        
        mail($email, $subject, $message);

        echo json_encode(['status' => 'success', 'message' => 'Password reset link sent to your email']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error']);
    }
}
?>