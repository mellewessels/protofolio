<?php
include 'db.php';

$project_id = $_GET['id'] ?? null;
if (!$project_id) {
    exit("Project not specified.");
}

// Verify project exists
$stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
$stmt->execute([$project_id]);
if (!$stmt->fetch()) {
    exit("Project not found.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add text content
    if (!empty($_POST['text'])) {
        $text = trim($_POST['text']);
        $stmt = $pdo->prepare("INSERT INTO project_content (project_id, content_type, content) VALUES (?, 'text', ?)");
        $stmt->execute([$project_id, $text]);
    }

    // Add image content
    if (!empty($_FILES['image']['name'])) {
        $imageName = basename($_FILES['image']['name']);
        $targetDir = 'uploads/';
        if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
        $targetPath = $targetDir . $imageName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $stmt = $pdo->prepare("INSERT INTO project_content (project_id, content_type, content) VALUES (?, 'image', ?)");
            $stmt->execute([$project_id, $imageName]);
        } else {
            echo "<p>Failed to upload image.</p>";
        }
    }

    header("Location: project.php?id=$project_id");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Add Content to Project</title>
</head>
<body>
  <h1>Add Content to Project</h1>

  <form method="post" enctype="multipart/form-data">
    <label for="text">Text:</label><br>
    <textarea name="text" id="text" rows="5" cols="50" placeholder="Enter documentation or notes..."></textarea><br><br>

    <label for="image">Or upload an image:</label><br>
    <input type="file" name="image" id="image"><br><br>

    <button type="submit">Add Content</button>
  </form>

  <p><a href="project.php?id=<?= htmlspecialchars($project_id) ?>">Back to Project</a></p>
</body>
</html>