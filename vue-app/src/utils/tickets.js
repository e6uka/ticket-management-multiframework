const TICKETS_KEY = 'ticketapp_tickets';

const initTickets = () => {
  const existing = localStorage.getItem(TICKETS_KEY);
  if (!existing) {
    const sampleTickets = [
      {
        id: '1',
        title: 'Fix login bug',
        description: 'Users cannot login with correct credentials',
        status: 'open',
        priority: 'high',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Update documentation',
        description: 'Add API documentation for new endpoints',
        status: 'in_progress',
        priority: 'medium',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Improve UI design',
        description: 'Modernize the dashboard layout',
        status: 'closed',
        priority: 'low',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(TICKETS_KEY, JSON.stringify(sampleTickets));
  }
};

initTickets();

export const tickets = {
  getAll: () => {
    try {
      const data = localStorage.getItem(TICKETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load tickets:', error);
      return [];
    }
  },

  getById: (id) => {
    const allTickets = tickets.getAll();
    return allTickets.find(ticket => ticket.id === id);
  },

  create: (ticket) => {
    try {
      const allTickets = tickets.getAll();
      const newTicket = {
        ...ticket,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      allTickets.push(newTicket);
      localStorage.setItem(TICKETS_KEY, JSON.stringify(allTickets));
      return { success: true, ticket: newTicket };
    } catch (error) {
      return { success: false, error: 'Failed to create ticket' };
    }
  },

  update: (id, updates) => {
    try {
      const allTickets = tickets.getAll();
      const index = allTickets.findIndex(ticket => ticket.id === id);
      if (index === -1) {
        return { success: false, error: 'Ticket not found' };
      }
      allTickets[index] = { ...allTickets[index], ...updates };
      localStorage.setItem(TICKETS_KEY, JSON.stringify(allTickets));
      return { success: true, ticket: allTickets[index] };
    } catch (error) {
      return { success: false, error: 'Failed to update ticket' };
    }
  },

  delete: (id) => {
    try {
      const allTickets = tickets.getAll();
      const filtered = allTickets.filter(ticket => ticket.id !== id);
      localStorage.setItem(TICKETS_KEY, JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete ticket' };
    }
  },

  getStats: () => {
    const allTickets = tickets.getAll();
    return {
      total: allTickets.length,
      open: allTickets.filter(t => t.status === 'open').length,
      inProgress: allTickets.filter(t => t.status === 'in_progress').length,
      closed: allTickets.filter(t => t.status === 'closed').length
    };
  }
};
