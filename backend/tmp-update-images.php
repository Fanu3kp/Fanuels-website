<?php
// Temporary script to update blog post images in the database
$pdo = new PDO('mysql:host=127.0.0.1;port=3307;dbname=fanuel_website;charset=utf8mb4', 'root', '');

$updates = [
    'microservices' => '/images/posts/legacy-rewrite-or-retire.svg?v=4',
    'data-privacy' => '/images/posts/infrastructure-as-code.svg?v=4',
    'inclusive-design' => '/images/real/team-meeting.jpg?v=4',
    'zero-trust' => '/images/posts/infrastructure-as-code.svg?v=4',
    'education-campus-management' => '/images/posts/education-campus-management.svg?v=4',
    'tests-before-features' => '/images/posts/tests-before-features.svg?v=4',
    'cloud-cost-mistakes' => '/images/posts/cloud-cost-mistakes.svg?v=4',
    'buy-versus-build' => '/images/posts/buy-versus-build.svg?v=4',
    'backup-restore-drill' => '/images/posts/backup-restore-drill.svg?v=4',
];

echo "=== Before ===\n";
$stmt = $pdo->query("SELECT id, slug, image FROM posts ORDER BY id");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['id'] . ' | ' . $row['slug'] . ' | ' . $row['image'] . "\n";
}

echo "\n=== Updating ===\n";
foreach ($updates as $slugPart => $imagePath) {
    $stmt = $pdo->prepare("UPDATE posts SET image = ? WHERE slug LIKE ?");
    $result = $stmt->execute([$imagePath, '%' . $slugPart . '%']);
    $affected = $stmt->rowCount();
    echo "Updated '$slugPart' -> '$imagePath' ($affected rows)\n";
}

echo "\n=== After ===\n";
$stmt = $pdo->query("SELECT id, slug, image FROM posts ORDER BY id");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['id'] . ' | ' . $row['slug'] . ' | ' . $row['image'] . "\n";
}

$pdo = null;
echo "\nDone.\n";
