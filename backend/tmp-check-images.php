<?php
$base = 'C:/xampp/htdocs/Fanuels website/frontend/dist/frontend/browser/';
$images = [
  'images/posts/tests-before-features.svg',
  'images/posts/cloud-cost-mistakes.svg',
  'images/posts/buy-versus-build.svg',
  'images/posts/backup-restore-drill.svg',
  'images/posts/legacy-rewrite-or-retire.svg',
  'images/posts/infrastructure-as-code.svg',
  'images/posts/education-campus-management.svg',
  'images/real/cloud-server.jpg',
  'images/real/team-meeting.jpg',
  'images/social/tiktok.png',
  'images/social/youtube.jpeg',
];
foreach ($images as $img) {
  $full = $base . $img;
  $status = file_exists($full) ? 'EXISTS (' . filesize($full) . ' bytes)' : 'MISSING';
  echo basename($img) . ': ' . $status . "\n";
}
