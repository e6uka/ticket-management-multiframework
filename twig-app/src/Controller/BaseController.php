<?php

namespace App\Controller;

use Psr\Http\Message\ResponseInterface as Response;
use Twig\Environment;

class BaseController
{
    protected Environment $twig;

    public function __construct(Environment $twig)
    {
        $this->twig = $twig;
    }

    protected function render(Response $response, string $template, array $data = []): Response
    {
        // Add session data to all templates
        $templateData = array_merge($data, [
            'session' => $_SESSION,
            'flash' => $this->getFlash()
        ]);
        
        $response->getBody()->write($this->twig->render($template, $templateData));
        return $response;
    }

    protected function redirect(Response $response, string $path): Response
    {
        return $response
            ->withHeader('Location', $path)
            ->withStatus(302);
    }

    protected function flash(string $message, string $type = 'success'): void
    {
        $_SESSION['flash'] = ['message' => $message, 'type' => $type];
    }

    protected function getFlash(): ?array
    {
        if (isset($_SESSION['flash'])) {
            $flash = $_SESSION['flash'];
            unset($_SESSION['flash']);
            return $flash;
        }
        return null;
    }
}
