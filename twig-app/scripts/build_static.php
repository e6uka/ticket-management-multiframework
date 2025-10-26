<?php
/**
 * Build static HTML output of the Twig app into the `dist/` folder.
 *
 * Usage:
 *   php scripts/build_static.php
 */

require __DIR__ . '/../vendor/autoload.php';

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$root = realpath(__DIR__ . '/..');
$templatesDir = $root . '/src/templates';
$distDir = $root . '/dist';
$assetsSrc = $root . '/public/assets';
$assetsDest = $distDir . '/assets';
$dataFile = $root . '/data/tickets.json';

function rrmdir($dir) {
    if (!is_dir($dir)) return;
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($items as $item) {
        if ($item->isDir()) rmdir($item->getPathname());
        else unlink($item->getPathname());
    }
    rmdir($dir);
}

function rcopy($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst, 0755, true);
    while(false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                rcopy($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

// prepare dist
if (is_dir($distDir)) {
    echo "Cleaning existing dist/ folder...\n";
    rrmdir($distDir);
}

mkdir($distDir, 0755, true);

// load tickets data if present
$tickets = [];
if (file_exists($dataFile)) {
    $json = file_get_contents($dataFile);
    $tickets = json_decode($json, true) ?: [];
}

// compute stats
$stats = ['total' => 0, 'open' => 0, 'inProgress' => 0, 'closed' => 0];
foreach ($tickets as $t) {
    $stats['total']++;
    $status = $t['status'] ?? 'open';
    if ($status === 'open') $stats['open']++;
    elseif ($status === 'in_progress') $stats['inProgress']++;
    elseif ($status === 'closed') $stats['closed']++;
}

// setup Twig
$loader = new FilesystemLoader($templatesDir);
$twig = new Environment($loader, [
    'cache' => false,
    'autoescape' => false,
]);

$pages = [
    'index.html' => 'landing.html.twig',
    'login/index.html' => 'login.html.twig',
    'signup/index.html' => 'signup.html.twig',
    'dashboard/index.html' => 'dashboard.html.twig',
    'tickets/index.html' => 'tickets.html.twig',
];

// common context
$baseContext = [
    'session' => ['user' => null],
    'errors' => [],
    'flash' => null,
    'tickets' => $tickets,
    'stats' => $stats,
];

foreach ($pages as $out => $template) {
    $outPath = $distDir . '/' . $out;
    $outDir = dirname($outPath);
    if (!is_dir($outDir)) mkdir($outDir, 0755, true);
    echo "Rendering {$template} -> {$outPath}\n";
    $html = $twig->render($template, $baseContext);
    file_put_contents($outPath, $html);
}

// copy assets
if (is_dir($assetsSrc)) {
    echo "Copying assets...\n";
    rcopy($assetsSrc, $assetsDest);
}

echo "Static build complete. Output in: {$distDir}\n";

exit(0);
