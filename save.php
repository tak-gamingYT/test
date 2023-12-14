<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $message = $_POST['message'];
    if ($message === "") {
        file_put_contents('chat.txt', '');
        $backupFileName = 'chatbackup' . date('ymd') . '.txt';
        file_put_contents($backupFileName, file_get_contents('chat.txt'));
        echo "Chat content cleared, backup saved as $backupFileName";
    } else {
        file_put_contents('chat.txt', $message . PHP_EOL, FILE_APPEND);
        echo "Message saved successfully";
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
?>