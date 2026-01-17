// Load content from JSON files
const API_BASE = 'data/';

async function loadJSON(filename) {
    try {
        const response = await fetch(`${API_BASE}${filename}.json`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return null;
    }
}

// Articles
async function loadArticles() {
    const data = await loadJSON('articles');
    const container = document.getElementById('articles');
    
    if (!data || !data.articles) {
        container.innerHTML = '<p>Няма налични статии.</p>';
        return;
    }

    container.innerHTML = data.articles.map(article => `
        <div class="article-card">
            <h3>${article.title}</h3>
            <p class="date">${new Date(article.date).toLocaleDateString('bg-BG')}</p>
            <p>${article.content}</p>
        </div>
    `).join('');
}

// Gallery
async function loadGallery() {
    const data = await loadJSON('gallery');
    const container = document.getElementById('gallery');
    
    if (!data || !data.images) {
        container.innerHTML = '<p>Няма налични снимки.</p>';
        return;
    }

    container.innerHTML = data.images.map(image => `
        <div class="gallery-item">
            <img src="${image.url || 'https://via.placeholder.com/300x200?text=Image'}" alt="${image.title}">
            <p>${image.title}</p>
        </div>
    `).join('');
}

// Staff
async function loadStaff() {
    const data = await loadJSON('staff');
    const container = document.getElementById('staff');
    
    if (!data || !data.members) {
        container.innerHTML = '<p>Няма налични членове на персонала.</p>';
        return;
    }

    container.innerHTML = data.members.map(member => `
        <div class="staff-card">
            <img src="${member.photo || 'https://via.placeholder.com/280x250?text=Photo'}" alt="${member.name}">
            <div class="staff-card-content">
                <h3>${member.name}</h3>
                <p class="position">${member.position}</p>
                <p>${member.bio}</p>
            </div>
        </div>
    `).join('');
}

// Events
async function loadEvents() {
    const data = await loadJSON('events');
    const container = document.getElementById('events');
    
    if (!data || !data.events) {
        container.innerHTML = '<p>Няма налични събития.</p>';
        return;
    }

    container.innerHTML = data.events.map(event => `
        <div class="event-card">
            <div class="event-date">${new Date(event.date).toLocaleDateString('bg-BG')}</div>
            <h3>${event.title}</h3>
            <p class="event-time">⏰ ${event.time}</p>
            <p>${event.description}</p>
        </div>
    `).join('');
}

// Calendar
let currentDate = new Date();

function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = [
        'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
        'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
    ];
    
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
    
    let html = `
        <div class="calendar-header">
            <button onclick="previousMonth()">← Назад</button>
            <h3>${monthNames[month]} ${year}</h3>
            <button onclick="nextMonth()">Напред →</button>
        </div>
        <div class="calendar-grid">
    `;
    
    // Day headers
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += `<div class="calendar-day other-month"></div>`;
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === new Date().getDate() && 
                       month === new Date().getMonth() && 
                       year === new Date().getFullYear();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = eventDates.includes(dateStr);
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}" 
                 onclick="selectDate('${dateStr}')">
                ${day}
            </div>
        `;
    }
    
    html += '</div>';
    
    return html;
}

let eventDates = [];

async function loadCalendar() {
    const data = await loadJSON('events');
    const container = document.getElementById('calendar');
    const eventsContainer = document.getElementById('calendar-events');
    
    if (data && data.events) {
        eventDates = data.events.map(e => e.date.split('T')[0]);
    }
    
    container.innerHTML = generateCalendar();
    selectDate(new Date().toISOString().split('T')[0]);
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar();
}

async function selectDate(dateStr) {
    const data = await loadJSON('events');
    const container = document.getElementById('calendar-events');
    
    const dateObj = new Date(dateStr);
    const dayNames = ['неделя', 'понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота'];
    const monthNames = [
        'януари', 'февруари', 'март', 'април', 'май', 'юни',
        'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'
    ];
    
    const day = dateObj.getDate();
    const dayName = dayNames[dateObj.getDay()];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    let html = `<h3>${day} ${month} ${year} г. (${dayName})</h3>`;
    
    if (data && data.events) {
        const eventsOnDate = data.events.filter(e => e.date.split('T')[0] === dateStr);
        
        if (eventsOnDate.length > 0) {
            html += eventsOnDate.map(event => `
                <div class="calendar-event-item">
                    <strong>${event.title}</strong><br>
                    ⏰ ${event.time}
                    <p>${event.description}</p>
                </div>
            `).join('');
        } else {
            html += '<p>Няма събития на този ден.</p>';
        }
    }
    
    container.innerHTML = html;
}

// Contacts
async function loadContacts() {
    const data = await loadJSON('contacts');
    const container = document.getElementById('contacts');
    
    if (!data) {
        container.innerHTML = '<p>Контактната информация не е налична.</p>';
        return;
    }

    container.innerHTML = `
        <div class="contact-card">
            <h3>Контактна информация</h3>
            <div class="contact-item">
                <label>Адрес:</label>
                <p>${data.address || '-'}</p>
            </div>
            <div class="contact-item">
                <label>Телефон:</label>
                <p>${data.phone || '-'}</p>
            </div>
            <div class="contact-item">
                <label>Email:</label>
                <p>${data.email || '-'}</p>
            </div>
        </div>
        <div class="contact-card">
            <h3>Работно време</h3>
            <div class="contact-item">
                <label>Работни дни:</label>
                <p>${data.workingDays || '-'}</p>
            </div>
            <div class="contact-item">
                <label>Време:</label>
                <p>${data.workingHours || '-'}</p>
            </div>
            <div class="contact-item">
                <label>Директор:</label>
                <p>${data.director || '-'}</p>
            </div>
        </div>
    `;
}
