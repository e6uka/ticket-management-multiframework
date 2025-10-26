<?php

use App\Controller\DashboardController;
use App\Controller\LandingController;
use App\Controller\TicketController;
use App\Utils\TicketManager;
use DI\Container;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Twig\Loader\FilesystemLoader;

require __DIR__ . '/../vendor/autoload.php';

// Start session
session_start();

// Create Container
$container = new Container();
AppFactory::setContainer($container);

// Configure Twig
$container->set(\Twig\Environment::class, function() {
    $loader = new FilesystemLoader(__DIR__ . '/../src/templates');
    return new \Twig\Environment($loader, [
        'cache' => false, // Disable cache for development
        'debug' => true
    ]);
});

// Configure TicketManager
$container->set(TicketManager::class, function() {
    return new TicketManager();
});

// Configure Controllers
$container->set(LandingController::class, function(Container $c) {
    return new LandingController($c->get(\Twig\Environment::class));
});

$container->set(DashboardController::class, function(Container $c) {
    return new DashboardController($c->get(\Twig\Environment::class), $c->get(TicketManager::class));
});

$container->set(TicketController::class, function(Container $c) {
    return new TicketController($c->get(\Twig\Environment::class), $c->get(TicketManager::class));
});

// Create App
$app = AppFactory::create();

// Add Routing Middleware
$app->addRoutingMiddleware();

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Routes
$app->get('/', LandingController::class . ':index');
$app->get('/login', LandingController::class . ':login');
$app->get('/signup', LandingController::class . ':signup');

$app->get('/dashboard', DashboardController::class . ':index');

$app->get('/tickets', TicketController::class . ':index');
$app->post('/tickets', TicketController::class . ':create');
$app->post('/tickets/{id}', TicketController::class . ':update');
$app->post('/tickets/{id}/delete', TicketController::class . ':delete');

$app->run();
