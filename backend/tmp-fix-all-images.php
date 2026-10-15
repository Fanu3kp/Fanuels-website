<?php
// Comprehensive script to fix all blog post images
$pdo = new PDO('mysql:host=127.0.0.1;port=3307;dbname=fanuel_website;charset=utf8mb4', 'root', '');

echo "=== Current posts ===\n";
$stmt = $pdo->query("SELECT id, slug, image FROM posts ORDER BY id");
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($posts as $row) {
    echo $row['id'] . ' | ' . $row['slug'] . ' | ' . $row['image'] . "\n";
}

// Map slugs to correct image paths (all existing files with cache-busting)
$imageMap = [
    'why-we-write-tests-before-we-write-features' => '/images/posts/tests-before-features.svg?v=4',
    'three-cloud-cost-mistakes-we-see-in-every-audit' => '/images/posts/cloud-cost-mistakes.svg?v=4',
    'buy-versus-build-is-a-staffing-decision' => '/images/posts/buy-versus-build.svg?v=4',
    'your-backups-are-not-tested-until-you-have-restored-one' => '/images/posts/backup-restore-drill.svg?v=4',
    'legacy-systems-rewrite-or-retire' => '/images/posts/legacy-rewrite-or-retire.svg?v=4',
    'infrastructure-as-code-without-the-ceremony' => '/images/posts/infrastructure-as-code.svg?v=4',
    'digital-transformation-in-education-next-generation-campus-management' => '/images/posts/education-campus-management.svg?v=4',
    'zero-trust-architecture-practical-adoption-guide-african-businesses' => '/images/posts/infrastructure-as-code.svg?v=4',
    'hidden-cost-technical-debt-legacy-systems' => '/images/posts/legacy-rewrite-or-retire.svg?v=4',
    'building-reliable-systems-uptime-vs-resilience' => '/images/real/cloud-server.jpg?v=4',
    'microservices-at-scale-when-to-decompose-and-when-to-hold-back' => '/images/posts/legacy-rewrite-or-retire.svg?v=4',
    'data-privacy-africa-gdpr-kenya-dpa-sector-regulations' => '/images/posts/infrastructure-as-code.svg?v=4',
    'building-inclusive-products-east-africa-linguistic-diversity' => '/images/real/team-meeting.jpg?v=4',
];

echo "\n=== Updating all posts ===\n";
foreach ($imageMap as $slug => $imagePath) {
    $stmt = $pdo->prepare("UPDATE posts SET image = ? WHERE slug = ?");
    $stmt->execute([$imagePath, $slug]);
    $affected = $stmt->rowCount();
    echo "Updated '$slug' -> '$imagePath' ($affected rows)\n";
}

// Clear Laravel cache
echo "\n=== Final state ===\n";
$stmt = $pdo->query("SELECT id, slug, image FROM posts ORDER BY id");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Check if image file exists
    $imagePath = $row['image'];
    $localPath = 'C:/xampp/htdocs/Fanuels website/frontend/dist/frontend/browser' . $imagePath;
    $exists = file_exists($localPath) ? 'EXISTS' : 'MISSING!';
    echo $row['id'] . ' | ' . $row['slug'] . ' | ' . $exists . ' | ' . $row['image'] . "\n";
}

$pdo = null;
echo "\nDone.\n";
