# Ticket Management System - Twig/PHP

Server-side rendered implementation using Twig templating engine with PHP backend, matching the React and Vue versions' functionality and design.

## Status

✅ **IN PROGRESS** - Entry point, controllers, templates, and utilities created. Requires PHP and Composer to run.

## Technologies

- **PHP 8+** - Server-side language
- **Twig 3** - Template engine
- **Slim Framework** - Lightweight routing
- **PHP Sessions** - Session management
- **JSON File Storage** - Data persistence

## Quick Start

> **Note**: This application requires PHP 8+ and Composer to run. If these are not installed on your system, please install them first.

```bash
# Install PHP dependencies
composer install

# Start PHP built-in server (port 8000)
php -S localhost:8000 -t public

# Or use Apache/Nginx with document root set to public/
```

## Project Structure

```
twig-app/
├── public/
│   ├── index.php       # Entry point
│   └── assets/
│       ├── css/        # Shared CSS from React
│       └── js/         # Client-side JS
├── src/
│   ├── Controller/     # PHP route handlers
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   └── TicketController.php
│   ├── templates/      # Twig templates
│   │   ├── base.html.twig
│   │   ├── landing.html.twig
│   │   ├── login.html.twig
│   │   ├── signup.html.twig
│   │   ├── dashboard.html.twig
│   │   └── tickets.html.twig
│   └── Utils/
│       ├── Auth.php
│       └── TicketManager.php
├── composer.json
└── README.md
```

## Implementation Guide

### 1. Setup Composer (`composer.json`)
```json
{
  "require": {
    "php": ">=8.0",
    "twig/twig": "^3.0",
    "slim/slim": "^4.0",
    "slim/psr7": "^1.0"
  }
}
```

### 2. Entry Point (`public/index.php`)
```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$app = AppFactory::create();

// Configure Twig
$loader = new FilesystemLoader(__DIR__ . '/../src/templates');
$twig = new Environment($loader);

// Routes
$app->get('/', 'LandingController:index');
$app->get('/auth/login', 'AuthController:showLogin');
// ... more routes

$app->run();
```

### 3. Create Twig Templates

**Base Layout** (`templates/layout.twig`):
```twig
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}Ticket Management{% endblock %}</title>
    <link rel="stylesheet" href="/assets/css/global.css">
</head>
<body>
    {% block content %}{% endblock %}
    {% block scripts %}{% endblock %}
</body>
</html>
```

**Landing Page** (`templates/landing.twig`):
```twig
{% extends "layout.twig" %}

{% block content %}
<div class="landing-page">
    <div class="hero">
        <div class="decorative-circle circle-1"></div>
        <div class="container hero-content">
            <h1>Ticket Management System</h1>
            <p class="hero-description">...</p>
            <div class="hero-actions">
                <a href="/auth/login" class="btn btn-primary">Login</a>
                <a href="/auth/signup" class="btn btn-secondary">Get Started</a>
            </div>
        </div>
        <svg class="wave">...</svg>
    </div>
</div>
{% endblock %}
```

### 4. PHP Session Management

**Auth Utility** (`src/Utils/Auth.php`):
```php
<?php
namespace App\Utils;

class Auth {
    const SESSION_KEY = 'ticketapp_session';
    
    public static function login($email, $password) {
        if ($email === 'demo@example.com' && $password === 'password123') {
            $_SESSION[self::SESSION_KEY] = base64_encode($email . ':' . time());
            return ['success' => true];
        }
        return ['success' => false, 'error' => 'Invalid credentials'];
    }
    
    public static function isAuthenticated() {
        return isset($_SESSION[self::SESSION_KEY]);
    }
    
    public static function logout() {
        unset($_SESSION[self::SESSION_KEY]);
    }
}
```

### 5. Data Persistence

Options:
- **JSON File**: Simple file-based storage
- **SQLite**: Lightweight database
- **MySQL/PostgreSQL**: Full database

**Example JSON Storage**:
```php
class TicketManager {
    private $file = __DIR__ . '/../../data/tickets.json';
    
    public function getAll() {
        $data = file_get_contents($this->file);
        return json_decode($data, true);
    }
    
    public function create($ticket) {
        $tickets = $this->getAll();
        $ticket['id'] = uniqid();
        $tickets[] = $ticket;
        file_put_contents($this->file, json_encode($tickets));
        return $ticket;
    }
}
```

## Demo Credentials

```
Email: demo@example.com
Password: password123
```

## Features Checklist

- [x] Landing page with wavy hero
- [x] Login/Signup forms with validation
- [ ] Session-based authentication
- [ ] Dashboard with statistics
- [ ] Full CRUD ticket management
- [ ] Server-side validation
- [ ] Flash messages (like toasts)
- [x] Responsive design

## Key Differences from React/Vue

### Server-Side Rendering
- Pages rendered on server, not client
- Form submissions via POST requests
- Page refreshes on navigation (can be mitigated with AJAX)

### Session Management
- PHP `$_SESSION` instead of localStorage
- Server-side session validation
- Cookies for session persistence

### Form Handling
- Traditional form POST or AJAX
- Server-side validation required
- CSRF token protection recommended

## CSS Reuse

Copy CSS from React implementation:
```bash
cp ../react-app/src/styles/global.css assets/css/
cp ../react-app/src/pages/*.css assets/css/
```

Then reference in Twig templates:
```twig
<link rel="stylesheet" href="/assets/css/global.css">
<link rel="stylesheet" href="/assets/css/landing.css">
```

## References

- Refer to `../react-app` for complete UI reference
- Twig documentation: https://twig.symfony.com
- Slim Framework: https://www.slimframework.com
