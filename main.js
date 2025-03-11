let currentUser = null;

const menuItems = {
    student: [
        { text: 'Tableau de bord', href: '#dashboard', icon: 'house' },
        { text: 'Mes Cours', href: '#courses', icon: 'book' },
        { text: 'Mes Notes', href: '#grades', icon: 'star' },
        { text: 'Annonces', href: '#announcements', icon: 'megaphone' },
        { text: 'Messages', href: '#messages', icon: 'envelope' }
    ],
    teacher: [
        { text: 'Tableau de bord', href: '#dashboard', icon: 'house' },
        { text: 'Mes Classes', href: '#courses', icon: 'people' },
        { text: 'Gestion des Notes', href: '#grades', icon: 'pencil' },
        { text: 'Annonces', href: '#announcements', icon: 'megaphone' },
        { text: 'Messages', href: '#messages', icon: 'envelope' }
    ],
    admin: [
        { text: 'Tableau de bord', href: '#dashboard', icon: 'house' },
        { text: 'Gestion des Cours', href: '#courses', icon: 'book' },
        { text: 'Utilisateurs', href: '#users', icon: 'people' },
        { text: 'Annonces', href: '#announcements', icon: 'megaphone' },
        { text: 'Système', href: '#system', icon: 'gear' }
    ]
};

window.login = async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    const response = await fetch('/api/users');
    const users = await response.json();
    const user = users.find(u => u.email === email && u.password === password && u.role === userType);

    if (user) {
        currentUser = user;
        showDashboard();
        setupNavigation();
    } else {
        alert('Email ou mot de passe incorrect');
    }
};

function showDashboard() {
    hideAllSections();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    updateNavMenu();
    updateDashboardStats();
}

function updateNavMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = '';

    const items = menuItems[currentUser.role];
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <a class="nav-link" href="${item.href}" onclick="navigateTo('${item.href}')">
                <i class="bi bi-${item.icon}"></i> ${item.text}
            </a>
        `;
        navMenu.appendChild(li);
    });

    const logout = document.createElement('li');
    logout.className = 'nav-item ms-auto';
    logout.innerHTML = `
        <a class="nav-link" href="#" onclick="window.logout()">
            <i class="bi bi-box-arrow-right"></i> Déconnexion (${currentUser.email})
        </a>
    `;
    navMenu.appendChild(logout);
}

window.navigateTo = function(hash) {
    hideAllSections();
    const sectionId = hash.substring(1);
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        loadSectionData(sectionId);
    }
};

function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById('dashboard').style.display = 'none';
}

async function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'courses':
            await loadCourses();
            break;
        case 'grades':
            await loadGrades();
            break;
        case 'announcements':
            await loadAnnouncements();
            break;
        case 'messages':
            await loadMessages();
            break;
    }
}

async function updateDashboardStats() {
    const responseCourses = await fetch('/api/courses');
    const courses = await responseCourses.json();
    const courseCount = courses.length;

    const responseAnnouncements = await fetch('/api/announcements');
    const announcements = await responseAnnouncements.json();
    const announcementCount = announcements.length;

    const responseMessages = await fetch('/api/messages');
    const messages = await responseMessages.json();
    const messageCount = messages.filter(m =>
        m.to === currentUser.id || m.from === currentUser.id
    ).length;

    document.getElementById('coursesCount').textContent = `${courseCount} cours`;
    document.getElementById('announcementsCount').textContent = `${announcementCount} annonces`;
    document.getElementById('messagesCount').textContent = `${messageCount} messages`;
}

async function loadCourses() {
    const response = await fetch('/api/courses');
    const courses = await response.json();
    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = '';

    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'list-group-item';
        courseElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-1">${course.title}</h5>
                <p class="mb-1">${course.description}</p>
                <small>Enseignant: ${course.teacher}</small>
              </div>
              <div>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editCourse(${course.id})">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${course.id})">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
        `;
        coursesList.appendChild(courseElement);
    });
}

async function loadGrades() {
    const response = await fetch('/api/grades');
    const grades = await response.json();
    const gradesList = document.getElementById('gradesList');
    gradesList.innerHTML = '';

    grades.forEach(grade => {
        const student = users.find(u => u.id === grade.student_id);
        const course = courses.find(c => c.id === grade.course_id);

        const row = document.createElement('tr');
        row.className = 'grade-row';
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${course.title}</td>
            <td>${grade.grade}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-2" onclick="editGrade(${grade.id})">
                <i class="bi bi-pencil"></i>
              </button>
            </td>
        `;
        gradesList.appendChild(row);
    });
}

async function loadAnnouncements() {
    const response = await fetch('/api/announcements');
    const announcements = await response.json();
    const announcementsList = document.getElementById('announcementsList');
    announcementsList.innerHTML = '';

    announcements.forEach(announcement => {
        const announcementElement = document.createElement('div');
        announcementElement.className = 'list-group-item';
        announcementElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-1">${announcement.title}</h5>
                <p class="mb-1">${announcement.content}</p>
                <small>Date: ${announcement.date}</small>
              </div>
              ${currentUser.role === 'admin' ? `
                <div>
                  <button class="btn btn-sm btn-outline-primary me-2" onclick="editAnnouncement(${announcement.id})">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" onclick="deleteAnnouncement(${announcement.id})">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              ` : ''}
            </div>
        `;
        announcementsList.appendChild(announcementElement);
    });
}

async function loadMessages() {
    const response = await fetch('/api/messages');
    const messages = await response.json();
    const conversationsList = document.getElementById('conversationsList');
    conversationsList.innerHTML = '';

    const conversations = [...new Set(messages
        .filter(m => m.to === currentUser.id || m.from === currentUser.id)
        .map(m => m.to === currentUser.id ? m.from : m.to)
    )];

    conversations.forEach(userId => {
        const user = users.find(u => u.id === userId);
        const conversationElement = document.createElement('a');
        conversationElement.className = 'list-group-item list-group-item-action conversation-item';
        conversationElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">${user.name}</h6>
                <small>${user.role}</small>
              </div>
            </div>
        `;
        conversationElement.onclick = () => loadConversation(userId);
        conversationsList.appendChild(conversationElement);
    });
}

function loadConversation(userId) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    document.getElementById('currentConversationTitle').textContent = `Conversation avec ${users.find(u => u.id === userId).name}`;

    const messages = db.messages.filter(m =>
        (m.to === currentUser.id && m.from === userId) ||
        (m.from === currentUser.id && m.to === userId)
    );

    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.from === currentUser.id ? 'sent' : 'received'}`;
        messageElement.innerHTML = `
            <div>${message.content}</div>
            <small>${message.date}</small>
        `;
        messagesList.appendChild(messageElement);
    });
}

window.addCourse = async function() {
    const name = document.getElementById('courseName').value;
    const description = document.getElementById('courseDescription').value;

    if (name && description) {
        const newCourse = {
            title: name,
            description,
            teacher: currentUser.name
        };

        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCourse)
        });

        if (response.ok) {
            loadCourses();
            document.getElementById('addCourseForm').reset();
        }
    }
};

window.addAnnouncement = async function() {
    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;

    if (title && content) {
        const newAnnouncement = {
            title,
            content,
            date: new Date().toISOString().split('T')[0]
        };

        const response = await fetch('/api/announcements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAnnouncement)
        });

        if (response.ok) {
            loadAnnouncements();
            document.getElementById('addAnnouncementForm').reset();
        }
    }
};

window.sendMessage = async function() {
    const content = document.getElementById('messageContent').value;
    const to = document.getElementById('currentConversationTitle').textContent.split(' ')[2];

    if (content && to) {
        const newMessage = {
            from: currentUser.id,
            to: users.find(u => u.name === to).id,
            content,
            date: new Date().toISOString().split('T')[0]
        };

        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        });

        if (response.ok) {
            document.getElementById('messageContent').value = '';
            loadConversation(newMessage.to);
        }
    }
};

window.logout = function() {
    currentUser = null;
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('authForm').reset();
    hideAllSections();
};

function setupNavigation() {
    window.addEventListener('hashchange', () => {
        navigateTo(window.location.hash || '#dashboard');
    });

    navigateTo(window.location.hash || '#dashboard');
}

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) {
        document.getElementById('loginForm').style.display = 'block';
        hideAllSections();
    }
});
