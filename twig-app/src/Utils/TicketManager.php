<?php

namespace App\Utils;

class TicketManager
{
    private string $dataFile;

    public function __construct()
    {
        $dataDir = __DIR__ . '/../../data';
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        $this->dataFile = $dataDir . '/tickets.json';
        $this->initializeData();
    }

    private function initializeData(): void
    {
        if (!file_exists($this->dataFile)) {
            $sampleTickets = [
                [
                    'id' => '1',
                    'title' => 'Fix login bug',
                    'description' => 'Users cannot login with correct credentials',
                    'status' => 'open',
                    'priority' => 'high',
                    'createdAt' => date('c')
                ],
                [
                    'id' => '2',
                    'title' => 'Update documentation',
                    'description' => 'Add API documentation for new endpoints',
                    'status' => 'in_progress',
                    'priority' => 'medium',
                    'createdAt' => date('c')
                ],
                [
                    'id' => '3',
                    'title' => 'Improve UI design',
                    'description' => 'Modernize the dashboard layout',
                    'status' => 'closed',
                    'priority' => 'low',
                    'createdAt' => date('c')
                ]
            ];
            file_put_contents($this->dataFile, json_encode($sampleTickets, JSON_PRETTY_PRINT));
        }
    }

    public function getAll(): array
    {
        $data = file_get_contents($this->dataFile);
        return json_decode($data, true) ?? [];
    }

    public function getById(string $id): ?array
    {
        $tickets = $this->getAll();
        foreach ($tickets as $ticket) {
            if ($ticket['id'] === $id) {
                return $ticket;
            }
        }
        return null;
    }

    public function create(array $ticket): array
    {
        $tickets = $this->getAll();
        $newTicket = [
            'id' => (string)time(),
            'title' => $ticket['title'] ?? '',
            'description' => $ticket['description'] ?? '',
            'status' => $ticket['status'] ?? 'open',
            'priority' => $ticket['priority'] ?? 'medium',
            'createdAt' => date('c')
        ];
        $tickets[] = $newTicket;
        file_put_contents($this->dataFile, json_encode($tickets, JSON_PRETTY_PRINT));
        return ['success' => true, 'ticket' => $newTicket];
    }

    public function update(string $id, array $updates): array
    {
        $tickets = $this->getAll();
        $found = false;
        foreach ($tickets as &$ticket) {
            if ($ticket['id'] === $id) {
                $ticket = array_merge($ticket, $updates);
                $found = true;
                break;
            }
        }
        if (!$found) {
            return ['success' => false, 'error' => 'Ticket not found'];
        }
        file_put_contents($this->dataFile, json_encode($tickets, JSON_PRETTY_PRINT));
        return ['success' => true];
    }

    public function delete(string $id): array
    {
        $tickets = $this->getAll();
        $filtered = array_filter($tickets, fn($t) => $t['id'] !== $id);
        file_put_contents($this->dataFile, json_encode(array_values($filtered), JSON_PRETTY_PRINT));
        return ['success' => true];
    }

    public function getStats(): array
    {
        $tickets = $this->getAll();
        return [
            'total' => count($tickets),
            'open' => count(array_filter($tickets, fn($t) => $t['status'] === 'open')),
            'inProgress' => count(array_filter($tickets, fn($t) => $t['status'] === 'in_progress')),
            'closed' => count(array_filter($tickets, fn($t) => $t['status'] === 'closed'))
        ];
    }
}
