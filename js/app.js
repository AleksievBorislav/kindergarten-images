// Load content from JSON files
const API_BASE = 'data/';
const SITE_NAME = "Обединени детски ясли";

async function loadJSON(filename) {
    try {
        const response = await fetch(`${API_BASE}${filename}.json?v=${Date.now()}`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return null;
    }
}

// Helper to convert YouTube URL to embed format
function getEmbedUrl(url) {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;

    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// Lightbox Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Set site name in all logo elements
    document.querySelectorAll('.logo').forEach(el => el.textContent = SITE_NAME);

    // Replace site name in title and footer
    document.title = document.title.replace('Детски ясли Града', SITE_NAME);
    document.querySelectorAll('footer p').forEach(el => {
        el.innerHTML = el.innerHTML.replace('Детски ясли Града', SITE_NAME);
    });

    // Close lightbox with X button
    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) {
        closeBtn.onclick = closeLightbox;
    }

    // Close lightbox when clicking outside image
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.onclick = function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        };
    }

    // Next/Prev buttons
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    if (prevBtn) prevBtn.onclick = prevImage;
    if (nextBtn) nextBtn.onclick = nextImage;

    // Keyboard shortcuts
    document.addEventListener('keydown', function (event) {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (event.key === 'ArrowLeft') prevImage();
        if (event.key === 'ArrowRight') nextImage();
        if (event.key === 'Escape') closeLightbox();
    });
});

// Articles
async function loadArticles() {
    const data = await loadJSON('articles');
    const container = document.getElementById('articles');

    if (!data || !data.articles) {
        container.innerHTML = '<p>Няма налични статии.</p>';
        return;
    }

    container.innerHTML = data.articles.map((article, index) => `
        <div class="article-card" onclick="openArticleModal(${index})" style="cursor: pointer;">
            <h3>${article.title}</h3>
            <p class="date">${new Date(article.date).toLocaleDateString('bg-BG')}</p>
            <p>${article.content}</p>
        </div>
    `).join('');

    // Store articles globally for modal
    window.articlesData = data.articles;
}

function openArticleModal(index) {
    const article = window.articlesData[index];
    if (!article) return;

    document.getElementById('modalTitle').textContent = article.title;
    document.getElementById('modalDate').textContent = new Date(article.date).toLocaleDateString('bg-BG');
    document.getElementById('modalContent').innerHTML = article.expandedContent || article.content;

    const imagesContainer = document.getElementById('modalImages');
    imagesContainer.innerHTML = (article.images || []).map(img => `<img src="${img}" alt="Article image">`).join('');

    const videosContainer = document.getElementById('modalVideos');
    videosContainer.innerHTML = (article.videos || []).map(video => `<iframe src="${video}" frameborder="0" allowfullscreen></iframe>`).join('');

    document.getElementById('articleModal').style.display = 'block';
}

// Close modal when clicking close button
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('articleModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = function () {
                modal.style.display = 'none';
            };
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }
});

// Testimonials
async function loadTestimonials() {
    const data = await loadJSON('testimonials');
    const container = document.getElementById('testimonials');

    if (!data || !data.testimonials) {
        container.innerHTML = '<p>Няма налични отзиви.</p>';
        return;
    }

    container.innerHTML = data.testimonials.map(testimonial => `
        <div class="testimonial-card">
            <img src="${testimonial.photo || 'https://via.placeholder.com/80x80?text=Photo'}" alt="${testimonial.name}">
            <p>"${testimonial.text}"</p>
            <div class="name">${testimonial.name}</div>
        </div>
    `).join('');
}

// FAQ
async function loadFAQ() {
    const data = await loadJSON('faq');
    const container = document.getElementById('faq');

    if (!data || !data.faqs) {
        container.innerHTML = '<p>Няма налични въпроси.</p>';
        return;
    }

    container.innerHTML = data.faqs.map(faq => `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFAQ(this)">
                ${faq.question}
                <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
                ${faq.answer}
            </div>
        </div>
    `).join('');
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        toggle.textContent = '+';
    } else {
        answer.style.display = 'block';
        toggle.textContent = '-';
    }
}

// Gallery
async function loadGallery() {
    const data = await loadJSON('gallery');
    const container = document.getElementById('gallery');

    if (!data || !data.categories) {
        container.innerHTML = '<p>Няма налични медии.</p>';
        return;
    }

    container.innerHTML = data.categories.map(categoryObj => {
        const category = categoryObj.name;
        const items = categoryObj.items;
        const stackItems = items.slice(0, 5);
        const hasMore = items.length > 5;

        return `
        <div class="gallery-category">
            <h3 onclick="openCategoryLightbox('${category}')">${category}</h3>
            <div class="gallery-stack" onclick="openCategoryLightbox('${category}')">
                ${stackItems.map((item, index) => `
                    <div class="gallery-item stack-item" style="left: ${index * 210}px;">
                        ${item.type === 'video' ?
                `<iframe src="${getEmbedUrl(item.url)}" frameborder="0" allowfullscreen onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"></iframe><div style="display:none; text-align:center; height:200px; display:flex; align-items:center; justify-content:center;">🎥 Видео не е налично</div>` :
                `<img src="${item.url || 'https://via.placeholder.com/300x200?text=Image'}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Broken+Image'">`
            }
                    </div>
                `).join('')}
                ${hasMore ? `<div class="more-indicator">+${items.length - 5} повече</div>` : ''}
            </div>
        </div>
    `;
    }).join('');

    // Store gallery data globally for lightbox
    const flatGalleryData = {};
    data.categories.forEach(cat => {
        flatGalleryData[cat.name] = cat.items;
    });
    window.galleryData = flatGalleryData;
}

function openCategoryLightbox(category) {
    openLightbox(category, 0);
}

let currentLightboxIndex = 0;
let currentLightboxCategory = '';

function openLightbox(category, index) {
    currentLightboxCategory = category;
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const iframe = document.getElementById('lightbox-video');
    const item = window.galleryData[category][index];

    if (item.type === 'video') {
        img.style.display = 'none';
        iframe.style.display = 'block';
        iframe.src = getEmbedUrl(item.url);
        iframe.onerror = function () {
            this.style.display = 'none';
            const errorMsg = document.createElement('div');
            errorMsg.textContent = 'Видео не е налично';
            errorMsg.style.textAlign = 'center';
            errorMsg.style.padding = '20px';
            this.parentNode.appendChild(errorMsg);
        };
    } else {
        img.style.display = 'block';
        iframe.style.display = 'none';
        img.src = item.url;
        img.onerror = function () {
            this.src = 'https://via.placeholder.com/600x400?text=Broken+Image';
        };
    }

    lightbox.classList.add('active');
    updateLightboxThumbs();
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    // Stop video
    const iframe = document.getElementById('lightbox-video');
    iframe.src = '';
}

function nextImage() {
    const categoryItems = window.galleryData[currentLightboxCategory];
    currentLightboxIndex = (currentLightboxIndex + 1) % categoryItems.length;
    openLightbox(currentLightboxCategory, currentLightboxIndex);
}

function prevImage() {
    const categoryItems = window.galleryData[currentLightboxCategory];
    currentLightboxIndex = (currentLightboxIndex - 1 + categoryItems.length) % categoryItems.length;
    openLightbox(currentLightboxCategory, currentLightboxIndex);
}

function updateLightboxThumbs() {
    const thumbsContainer = document.getElementById('lightbox-thumbs');
    const categoryItems = window.galleryData[currentLightboxCategory];
    thumbsContainer.innerHTML = categoryItems.map((item, index) => `
        <div class="lightbox-thumb ${index === currentLightboxIndex ? 'active' : ''}" onclick="openLightbox('${currentLightboxCategory}', ${index})">
            ${item.type === 'video' ? '<div class="video-thumb">🎥</div>' : `<img src="${item.url}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/60x60?text=X'">`}
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

    const now = new Date();
    // Set time to beginning of day to include today's events
    now.setHours(0, 0, 0, 0);

    const upcomingEvents = data.events
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    if (upcomingEvents.length === 0) {
        container.innerHTML = '<p>Няма предстоящи събития.</p>';
        return;
    }

    container.innerHTML = upcomingEvents.map(event => `
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

        // Calculate day of week (0 = Monday, 6 = Sunday, 5 = Saturday)
        const dayOfWeek = (new Date(year, month, day).getDay() + 6) % 7;
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Saturday or Sunday

        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''} ${isWeekend ? 'weekend' : ''}" 
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
    const dayOfWeek = (dateObj.getDay() + 6) % 7;
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    let html = `<h3>${day} ${month} ${year} г. (${dayName})`;
    if (isWeekend) {
        html += ` <span style="background: #fff5e6; color: #c9944d; padding: 2px 8px; border-radius: 4px; font-size: 0.85em;">Почивен ден</span>`;
    }
    html += `</h3>`;

    if (data && data.events) {
        const eventsOnDate = data.events.filter(e => e.date.split('T')[0] === dateStr);

        if (eventsOnDate.length > 0) {
            html += eventsOnDate.map(event => `
                <div class="calendar-event-item" style="background: #fef9f3; border-left: 4px solid #d4a574;">
                    <strong style="color: #d4a574; font-size: 1.1em;">📅 ${event.title}</strong><br>
                    <span style="color: #c9944d; font-weight: 600;">⏰ ${event.time}</span>
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
