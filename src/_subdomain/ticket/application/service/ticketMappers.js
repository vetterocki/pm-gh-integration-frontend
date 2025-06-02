export const mapPriority = (apiPriority) => {
    switch (apiPriority?.toUpperCase()) {
        case 'CRITICAL':
            return 'high';
        case 'MAJOR':
            return 'medium';
        case 'MINOR':
            return 'low';
        case 'BLOCKER':
            return 'blocker';
        default:
            return '';
    }
};

export const mapApiTicketToUiTicket = (apiTicket) => ({
    id: apiTicket.id,
    ticketIdentifier: apiTicket.ticketIdentifier,
    title: apiTicket.summary,
    priority: mapPriority(apiTicket.priority),
    labels: apiTicket.labels,
    assignee: apiTicket.assignee && {
        name: apiTicket.assignee.firstName + ' ' + apiTicket.assignee.lastName,
        avatar: apiTicket.assignee.avatarUrl ?? "",
        loginId: apiTicket.assignee.loginInGithub
    },
    reporter: {
        id: apiTicket.reporter.id,
        name: apiTicket.reporter.firstName + ' ' + apiTicket.reporter.lastName,
        "email": apiTicket.reporter.email,
        "teamId": apiTicket.reporter.teamId,
        "position": apiTicket.reporter.position,
        "loginInGithub": apiTicket.reporter.loginInGithub,
        "avatar": apiTicket.reporter.avatarUrl ?? ""
    },
    description: apiTicket.description,
    githubDescription: apiTicket.githubDescription,
    createdAt: new Date(apiTicket.createdAt).toLocaleString(),
    linkedTicketIds: apiTicket.linkedTicketIds,
    status: apiTicket.status,
    "linkedPullRequests": apiTicket.linkedPullRequests,
    "linkedWorkflowRuns": apiTicket.linkedWorkflowRuns,
});

export const mapAssignee = (ticket) => ({
    name: ticket.assignee.firstName + ' ' + ticket.assignee.lastName,
    avatar: ticket.assignee.avatarUrl ?? "",
    loginId: ticket.assignee.loginInGithub
})

export const getPriorityClass = (priority) => {
    switch (priority) {
        case 'high':
            return 'priority-high';
        case 'medium':
            return 'priority-medium';
        case 'low':
            return 'priority-low';
        case 'blocker':
            return 'priority-blocker';
        default:
            return '';
    }
};

export const filterTicketsByText = (ticketsByStatus, filterText) => {
    if (!filterText.trim()) return ticketsByStatus;

    const lowerFilter = filterText.toLowerCase();
    const filtered = {};

    for (const statusId in ticketsByStatus) {
        filtered[statusId] = ticketsByStatus[statusId].filter(ticket =>
            ticket.title.toLowerCase().includes(lowerFilter) ||
            ticket.ticketIdentifier.toLowerCase().includes(lowerFilter) ||
            ticket.labels.some(label => label.name.toLowerCase().includes(lowerFilter)) ||
            (ticket.assignee?.name.toLowerCase().includes(lowerFilter))
        );
    }
    return filtered;
};

export const filterTicketsByTextList = (tickets, filterText) => {
    if (!filterText.trim()) return tickets;

    const lowerFilter = filterText.toLowerCase();

    return tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(lowerFilter) ||
        ticket.ticketIdentifier.toLowerCase().includes(lowerFilter) ||
        ticket.labels.some(label => label.name.toLowerCase().includes(lowerFilter)) ||
        (ticket.assignee?.name.toLowerCase().includes(lowerFilter)) ||
        (ticket.description.toLowerCase().includes(lowerFilter)) ||
        (ticket.githubDescription.toLowerCase().includes(lowerFilter)))
};

export const conclusionIcons = {
    action_required: '⚠️',
    cancelled: '⏹️',
    failure: '❌',
    neutral: '➖',
    skipped: '⏭️',
    stale: '⌛',
    success: '✅',
    timed_out: '⏰',
    startup_failure: '🔥',
    null: '❓',
};

  