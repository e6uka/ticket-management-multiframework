<?php

namespace App\Controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class LandingController extends BaseController
{
    public function index(Request $request, Response $response): Response
    {
        return $this->render($response, 'landing.html.twig');
    }

    public function login(Request $request, Response $response): Response
    {
        return $this->render($response, 'login.html.twig');
    }

    public function signup(Request $request, Response $response): Response
    {
        return $this->render($response, 'signup.html.twig');
    }
}
