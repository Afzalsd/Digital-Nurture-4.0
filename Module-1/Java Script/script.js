// Community Events Portal JavaScript

// Global state management
let events = [];
let registrations = [];
let filteredEvents = [];

// Sample initial events data
const initialEvents = [
    {
        id: 1,
        name: "Summer Music Festival",
        date: "2025-07-15T18:00",
        category: "music",
        location: "downtown",
        seats: 500,
        availableSeats: 350,
        price: 25.00,
        description: "Join us for an amazing evening of live music featuring local and regional artists.",
        registrations: []
    },
    {
        id: 2,
        name: "Web Development Workshop",
        date: "2025-06-20T14:00",
        category: "workshop",
        location: "northside",
        seats: 30,
        availableSeats: 15,
        price: 0,
        description: "Learn the basics of modern web development with HTML, CSS, and JavaScript.",
        registrations: []
    },
    {
        id: 3,
        name: "Community Basketball Tournament",
        date: "2025-06-25T10:00",
        category: "sports",
        location: "eastside",
        seats: 200,
        availableSeats: 180,
        price: 10.00,
        description: "Annual basketball tournament for all skill levels. Prizes for winners!",
        registrations: []
    },
    {
        id: 4,
        name: "Food Truck Festival",
        date: "2025-08-05T12:00",
        category: "food",
        location: "westside",
        seats: 1000,
        availableSeats: 800,
        price: 5.00,
        description: "Taste amazing food from local food trucks and vendors.",
        registrations: []
    },
    {
        id: 5,
        name: "Tech Innovation Meetup",
        date: "2025-06-30T19:00",
        category: "tech",
        location: "downtown",
        seats: 100,
        availableSeats: 75,
        price: 15.00,
        description: "Network with tech professionals and learn about the latest innovations.",
        registrations: []
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load initial data
    events = [...initialEvents];
    filteredEvents = [...events];
    
    // Render initial content
    renderEvents();
    updateStatistics();
    
    // Set minimum date for event creation to today
    const today = new Date();
    today.setHours(today.getHours() + 1); // At least 1 hour from now
    document.getElementById('eventDate').min = today.toISOString().slice(0, 16);
}

// Event rendering functions
function renderEvents() {
    const container = document.getElementById('eventsContainer');
    
    if (filteredEvents.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No events found matching your criteria.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredEvents.map(event => createEventCard(event)).join('');
}

function createEventCard(event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const categoryClass = `category-${event.category}`;
    const seatStatus = event.availableSeats === 0 ? 'Sold Out' : `${event.availableSeats} seats left`;
    const priceDisplay = event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`;
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card event-card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">${event.name}</h5>
                    <span class="badge ${categoryClass} category-badge">${event.category}</span>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>${formattedDate}
                        </small><br>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>${formattedTime}
                        </small><br>
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>${capitalizeFirst(event.location)}
                        </small>
                    </div>
                    
                    ${event.description ? `<p class="card-text">${event.description}</p>` : ''}
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="fw-bold text-primary">${priceDisplay}</span>
                        <small class="text-muted">${seatStatus}</small>
                    </div>
                    
                    <button class="btn btn-primary w-100" 
                            onclick="openRegistrationModal(${event.id})"
                            ${event.availableSeats === 0 ? 'disabled' : ''}>
                        <i class="fas fa-user-plus me-2"></i>
                        ${event.availableSeats === 0 ? 'Sold Out' : 'Register Now'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Search and filter functions
function handleSearch(event) {
    if (event.key === 'Enter' || event.type === 'input') {
        applyFilters();
    }
}

function handleCategoryFilter() {
    applyFilters();
}

function handleLocationFilter() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    
    filteredEvents = events.filter(event => {
        const matchesSearch = !searchTerm || 
            event.name.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || event.category === categoryFilter;
        const matchesLocation = !locationFilter || event.location === locationFilter;
        
        return matchesSearch && matchesCategory && matchesLocation;
    });
    
    renderEvents();
}

// Registration modal functions
function openRegistrationModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    document.getElementById('selectedEvent').value = event.name;
    document.getElementById('registrationForm').dataset.eventId = eventId;
    
    // Reset form
    document.getElementById('registrationForm').reset();
    document.getElementById('selectedEvent').value = event.name;
    hideRegistrationMessage();
    
    const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
    modal.show();
}

function handleRegistration(event) {
    event.preventDefault();
    
    const eventId = parseInt(event.target.dataset.eventId);
    const formData = new FormData(event.target);
    
    const registration = {
        id: Date.now(),
        eventId: eventId,
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        phone: document.getElementById('userPhone').value.trim(),
        registrationDate: new Date().toISOString()
    };
    
    // Validate form
    if (!validateRegistrationForm(registration)) {
        return;
    }
    
    // Show loading state
    toggleRegistrationLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        // Check if event still has seats
        const eventIndex = events.findIndex(e => e.id === eventId);
        if (eventIndex === -1 || events[eventIndex].availableSeats <= 0) {
            showRegistrationMessage('This event is now sold out!', 'danger');
            toggleRegistrationLoading(false);
            return;
        }
        
        // Check for duplicate registration
        const existingRegistration = registrations.find(r => 
            r.eventId === eventId && r.email === registration.email
        );
        
        if (existingRegistration) {
            showRegistrationMessage('You are already registered for this event!', 'warning');
            toggleRegistrationLoading(false);
            return;
        }
        
        // Process registration
        registrations.push(registration);
        events[eventIndex].availableSeats--;
        events[eventIndex].registrations.push(registration);
        
        showRegistrationMessage('Registration successful! You will receive a confirmation email shortly.', 'success');
        
        // Update UI
        filteredEvents = [...events];
        renderEvents();
        updateStatistics();
        
        toggleRegistrationLoading(false);
        
        // Close modal after 2 seconds
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
            modal.hide();
        }, 2000);
        
    }, 1500);
}

function validateRegistrationForm(registration) {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    
    // Validate name
    if (registration.name.length < 2) {
        showFieldError('userName', 'nameError', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registration.email)) {
        showFieldError('userEmail', 'emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    
    field.classList.add('is-invalid');
    error.textContent = message;
}

function showRegistrationMessage(message, type) {
    const messageEl = document.getElementById('registrationMessage');
    messageEl.className = `alert alert-${type}`;
    messageEl.textContent = message;
    messageEl.style.display = 'block';
}

function hideRegistrationMessage() {
    document.getElementById('registrationMessage').style.display = 'none';
}

function toggleRegistrationLoading(isLoading) {
    const submitBtn = document.getElementById('submitRegistration');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitText.textContent = 'Registering...';
        submitSpinner.style.display = 'inline-block';
    } else {
        submitBtn.disabled = false;
        submitText.textContent = 'Register Now';
        submitSpinner.style.display = 'none';
    }
}

// Add event functions
function handleAddEvent(event) {
    event.preventDefault();
    
    const eventData = {
        id: Date.now(),
        name: document.getElementById('eventName').value.trim(),
        date: document.getElementById('eventDate').value,
        category: document.getElementById('eventCategory').value,
        location: document.getElementById('eventLocation').value,
        seats: parseInt(document.getElementById('eventSeats').value),
        availableSeats: parseInt(document.getElementById('eventSeats').value),
        price: parseFloat(document.getElementById('eventPrice').value) || 0,
        description: document.getElementById('eventDescription').value.trim(),
        registrations: []
    };
    
    // Validate event data
    if (!validateEventForm(eventData)) {
        return;
    }
    
    // Add event to collection
    events.push(eventData);
    filteredEvents = [...events];
    
    // Update UI
    renderEvents();
    updateStatistics();
    
    // Reset form
    document.getElementById('addEventForm').reset();
    
    // Show success message
    showAlert('Event added successfully!', 'success');
    
    // Scroll to events section
    scrollToEvents();
}

function validateEventForm(eventData) {
    // Basic validation - you can extend this
    if (!eventData.name || eventData.name.length < 3) {
        showAlert('Event name must be at least 3 characters long', 'danger');
        return false;
    }
    
    if (new Date(eventData.date) <= new Date()) {
        showAlert('Event date must be in the future', 'danger');
        return false;
    }
    
    if (eventData.seats < 1) {
        showAlert('Event must have at least 1 seat available', 'danger');
        return false;
    }
    
    return true;
}

// Statistics functions
function updateStatistics() {
    document.getElementById('totalEvents').textContent = events.length;
    document.getElementById('totalRegistrations').textContent = registrations.length;
    
    const musicEvents = events.filter(e => e.category === 'music').length;
    const workshopEvents = events.filter(e => e.category === 'workshop').length;
    
    document.getElementById('musicEvents').textContent = musicEvents;
    document.getElementById('workshopEvents').textContent = workshopEvents;
}

// Utility functions
function scrollToEvents() {
    document.getElementById('events').scrollIntoView({
        behavior: 'smooth'
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showAlert(message, type) {
    // Create and show a temporary alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Debug functions
function showDebugInfo() {
    const debugInfo = {
        totalEvents: events.length,
        totalRegistrations: registrations.length,
        events: events.map(e => ({
            id: e.id,
            name: e.name,
            availableSeats: e.availableSeats,
            registrations: e.registrations.length
        })),
        recentRegistrations: registrations.slice(-5)
    };
    
    document.getElementById('debugContent').textContent = JSON.stringify(debugInfo, null, 2);
    
    const modal = new bootstrap.Modal(document.getElementById('debugModal'));
    modal.show();
}

// Export functions for external access (if needed)
window.CommunityEvents = {
    getEvents: () => events,
    getRegistrations: () => registrations,
    addEvent: (eventData) => {
        events.push({...eventData, id: Date.now()});
        filteredEvents = [...events];
        renderEvents();
        updateStatistics();
    },
    searchEvents: (query) => {
        document.getElementById('searchInput').value = query;
        applyFilters();
    }
};