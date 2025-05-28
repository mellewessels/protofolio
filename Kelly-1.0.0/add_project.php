<?php
include 'db.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');

    if ($title === '') {
        $error = "Title is required.";
    } else {
        $stmt = $pdo->prepare("INSERT INTO projects (title, description) VALUES (?, ?)");
        $stmt->execute([$title, $description]);

        header("Location: index.php");
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Add New Project</title>
</head>
<body>
  <h1>Add New Project</h1>
  <?php if ($error): ?>
    <p style="color:red;"><?= htmlspecialchars($error) ?></p>
  <?php endif; ?>
  <form method="post">
    <label>Project Title:<br>
      <input type="text" name="title" required>
    </label><br><br>
    <label>Description:<br>
      <textarea name="description" rows="5" cols="50" placeholder="Brief overview..."></textarea>
    </label><br><br>
    <button type="submit">Create Project</button>
  </form>
  <p><a href="index.php">Back to Projects</a></p>
</body>
</html>