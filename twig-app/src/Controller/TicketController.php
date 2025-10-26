<?php

namespace App\Controller;

use App\Utils\TicketManager;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class TicketController extends BaseController
{
    private TicketManager $ticketManager;

    public function __construct(\Twig\Environment $twig, TicketManager $ticketManager)
    {
        parent::__construct($twig);
        $this->ticketManager = $ticketManager;
    }

    public function index(Request $request, Response $response): Response
    {
        $tickets = $this->ticketManager->getAll();
        
        return $this->render($response, 'tickets.html.twig', [
            'tickets' => $tickets,
            'flash' => $this->getFlash()
        ]);
    }

    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $result = $this->ticketManager->create($data);
        
        if ($result['success']) {
            $this->flash('Ticket created successfully!', 'success');
        } else {
            $this->flash($result['error'] ?? 'Failed to create ticket', 'error');
        }
        
        return $this->redirect($response, '/tickets');
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $data = $request->getParsedBody();
        $result = $this->ticketManager->update($args['id'], $data);
        
        if ($result['success']) {
            $this->flash('Ticket updated successfully!', 'success');
        } else {
            $this->flash($result['error'] ?? 'Failed to update ticket', 'error');
        }
        
        return $this->redirect($response, '/tickets');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $result = $this->ticketManager->delete($args['id']);
        
        if ($result['success']) {
            $this->flash('Ticket deleted successfully!', 'success');
        } else {
            $this->flash($result['error'] ?? 'Failed to delete ticket', 'error');
        }
        
        return $this->redirect($response, '/tickets');
    }
}