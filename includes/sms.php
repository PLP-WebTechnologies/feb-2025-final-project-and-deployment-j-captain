<?php
require_once __DIR__ . '/twilio-php-main/src/Twilio/autoload.php';

use Twilio\Rest\Client;

function sendOTPSMS($phone, $otp) {
    try {
        $client = new Client($_ENV['TWILIO_SID'], $_ENV['TWILIO_TOKEN']);
        $client->messages->create(
            $phone,
            [
                'from' => $_ENV['TWILIO_NUMBER'],
                'body' => "Your Football Arena verification code: $otp (valid for 10 minutes)"
            ]
        );
        return true;
    } catch (Exception $e) {
        error_log("SMS Error: " . $e->getMessage());
        return false;
    }
}
?>