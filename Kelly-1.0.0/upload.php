<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$project_id = $_POST['project_id'] ?? 0;
$action = $_POST['action'] ?? '';

if (!$project_id) {
    die("Project ID missing.");
}

// Validate project exists for redirect safety
$stmt = $pdo->prepare("SELECT slug FROM projects WHERE id = ?");
$stmt->execute([$project_id]);
$project = $stmt->fetch();

if (!$project) {
    die("Project not found.");
}

if ($action === 'add_text') {
    $text = trim($_POST['text'] ?? '');
    if ($text !== '') {
        $stmt = $pdo->prepare("INSERT INTO project_content (project_id, content_type, content) VALUES (?, 'text', ?)");
        $stmt->execute([$project_id, $text]);
    }
} elseif ($action === 'add_image') {
    if (!empty($_FILES['image']['name'])) {
        $imageName = basename($_FILES['image']['name']);
        $targetDir = 'uploads/';
        $targetPath = $targetDir . $imageName;

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        // Simple check: avoid overwriting files by adding timestamp
        $pathInfo = pathinfo($imageName);
        $imageName = $pathInfo['filename'] . '_' . time() . '.' . $pathInfo['extension'];
        $targetPath = $targetDir . $imageName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $stmt = $pdo->prepare("INSERT INTO project_content (project_id, content_type, content) VALUES (?, 'image', ?)");
            $stmt->execute([$project_id, $imageName]);
        } else {
            die("Failed to upload image.");
        }
    }
}

// Redirect back to project page, show "Add Content" tab
header('Location: project.php?slug=' . urlencode($project['slug']) . '&tab=content');
exit;