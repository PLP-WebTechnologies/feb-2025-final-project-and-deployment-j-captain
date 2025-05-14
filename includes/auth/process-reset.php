<?php
require '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Show password update form
    $token = $_GET['token'] ?? '';
    
    try {
        $stmt = $pdo->prepare("SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        $reset = $stmt->fetch();
        
        if (!$reset) {
            header("Location: reset-password.html?status=error&message=" . urlencode("Invalid or expired token"));
            exit;
        }
        
        // Show password update form
        echo "<!DOCTYPE html>
        <html>
        <head>
            <title>Update Password</title>
            <link rel='stylesheet' href='../assets/css/style.css'>
        </head>
        <body>
            <div class='reset-container'>
                <form action='process-reset.php' method='post'>
                    <input type='hidden' name='token' value='$token'>
                    <div class='form-group'>
                        <label>New Password</label>
                        <input type='password' name='password' required>
                    </div>
                    <div class='form-group'>
                        <label>Confirm Password</label>
                        <input type='password' name='confirm_password' required>
                    </div>
                    <button type='submit'>Update Password</button>
                </form>
            </div>
        </body>
        </html>";
        
    } catch (PDOException $e) {
        header("Location: reset-password.html?status=error&message=" . urlencode("Database error"));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process password update
    $token = $_POST['token'];
    $password = $_POST['password'];
    $confirm = $_POST['confirm_password'];
    
    if ($password !== $confirm) {
        header("Location: process-reset.php?token=$token&error=Passwords don't match");
        exit;
    }
    
    try {
        // Verify token
        $stmt = $pdo->prepare("SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        $reset = $stmt->fetch();
        
        if (!$reset) {
            header("Location: reset-password.html?status=error&message=" . urlencode("Invalid or expired token"));
            exit;
        }
        
        // Update password
        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stmt->execute([$hashed, $reset['email']]);
        
        // Delete used token
        $stmt = $pdo->prepare("DELETE FROM password_resets WHERE token = ?");
        $stmt->execute([$token]);
        
        header("Location: login.html?status=success&message=" . urlencode("Password updated successfully"));
    } catch (PDOException $e) {
        header("Location: reset-password.html?status=error&message=" . urlencode("Database error"));
    }
}
?>