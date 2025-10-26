<?php

namespace App\Controller;
use App\Utils\TicketManager;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class DashboardController extends BaseController
{
    private TicketManager $ticketManager;

    public function __construct(\Twig\Environment $twig, TicketManager $ticketManager)
    {
        parent::__construct($twig);
        $this->ticketManager = $ticketManager;
    }

    public function index(Request $request, Response $response): Response
    {
        $stats = $this->ticketManager->getStats();
        
        return $this->render($response, 'dashboard.html.twig', [
            'stats' => $stats,
            'flash' => $this->getFlash()
        ]);
    }
}
