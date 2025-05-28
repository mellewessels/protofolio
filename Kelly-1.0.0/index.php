<?php
include 'db.php';

$project_id = $_GET['id'] ?? null;
if (!$project_id) {
    exit("Project not specified.");
}

// Fetch project
$stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
$stmt->execute([$project_id]);
$project = $stmt->fetch();
if (!$project) {
    exit("Project not found.");
}

// Fetch project content (texts & images)
$stmt = $pdo->prepare("SELECT * FROM project_content WHERE project_id = ? ORDER BY id");
$stmt->execute([$project_id]);
$contents = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><?= htmlspecialchars($project['title']) ?></title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #fafafa; }
    .container { max-width: 900px; margin: auto; background: white; padding: 30px; border-radius: 10px; }
    h1 { margin-top: 0; }
    .content-item { margin-bottom: 20px; }
    .content-text { white-space: pre-wrap; font-size: 1.1em; }
    .content-image img { max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    a.button { display: inline-block; background: #42a5f5; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; }
    a.button:hover { background: #357abd; }
  </style>
</head>
<body>
  <div class="container">
    <h1><?= htmlspecialchars($project['title']) ?></h1>
    <p><?= nl2br(htmlspecialchars($project['description'])) ?></p>

    <h2>Project Content</h2>
    <?php if (!$contents): ?>
      <p>No content added yet.</p>
    <?php else: ?>
      <?php foreach ($contents as $content): ?>
        <div class="content-item">
          <?php if ($content['content_type'] === 'text'): ?>
            <div class="content-text"><?= nl2br(htmlspecialchars($content['content'])) ?></div>
          <?php elseif ($content['content_type'] === 'image'): ?>
            <div class="content-image">
              <img src="uploads/<?= htmlspecialchars($content['content']) ?>" alt="Project Image">
            </div>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>

    <p><a href="add_content.php?id=<?= $project_id ?>" class="button">+ Add Text or Image</a></p>
    <p><a href="index.php">Back to Projects</a></p>
  </div>
</body>
</html>