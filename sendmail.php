<?php

$msg = "";
if (isset($_POST['submit'])) {
  require_once __DIR__ . '/vendor/autoload.php';

  function sendMail($to, $from, $fromName, $body, $attachment) {
    $mail = new \PHPMailer\PHPMailer\PHPMailer();
    $mail->setFrom($from, $fromName);
    $mail->addAddress($to);
    $mail->addAttachment($attachment);
    $mail->Subject = 'Онлайн заявка с сайта Спецтруб';
    $mail->Body = $body;
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

    return $mail->send();
  }
  $name = $_POST['name'];
  $phone = $_POST['phone'];
  $email = $_POST['email'];
  $company = $_POST['company'];
  $comment = $_POST['comment'];
  $body = "Имя: {$name}<br> Email: {$email}<br> Телефон: {$phone}<br> Компания: {$company}<br> Комментарий: " . nl2br($comment);

  $file = "attachment/" . basename($_FILES['attachment']['name']);

  // перемещаем загруженный файл в новое место
  move_uploaded_file($_FILES['attachment']['tmp_name'], $file);

  if (sendMail('sergey_bobkov@inbox.ru', $email, $name, $body, $file)) {
    $msg = "Сообщение отправлено";
  } else {
    $msg = "Не отправлено";
  }
}

echo $msg;
