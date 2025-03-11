// Simulated database
const db = {
  users: {
    student: { email: 'ibtihal@gmail.com', password: 'ibtihal123', role: 'student', name: 'BOULMAL IBTIHAL' },
    teacher: { email: 'Ratli@gmail.com', password: 'ratli123', role: 'teacher', name: 'Prof RATLI' },
    admin: { email: 'boulmal@gmail.com', password: 'boulmal321', role: 'admin', name: 'ADMIN IBTIHAL' }
  },
  courses: [
    { id: 1, name: 'PHP', description: 'BACK END', teacher: 'Prof RATLI' },
    { id: 2, name: 'REACT JS', description: 'FRONT END', teacher: 'Prof RATLI' }
  ],
  grades: [
    { id: 1, studentId: 'student', courseId: 1, grade: 85 },
    { id: 2, studentId: 'student', courseId: 2, grade: 78 }
  ],
  announcements: [
    { id: 1, title: 'Rentrée scolaire', content: 'Bienvenue pour cette nouvelle année!', date: '2025-01-01' },
    { id: 2, title: 'Examens', content: 'Les examens commencent le 15 décembre', date: '2025-03-15' }
  ],
  messages: [
    { id: 1, from: 'teacher', to: 'student', content: 'N\'oubliez pas le devoir pour demain', date: '2023-11-20' },
    { id: 2, from: 'student', to: 'teacher', content: 'Merci pour le rappel', date: '2023-11-20' }
  ]
};

// Current user session
let currentUser = null;

// Menu items for different user roles
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

// Login function
window.login = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userType = document.getElementById('userType').value;

  const user = db.users[userType];
  if (user && user.email === email && user.password === password) {
    currentUser = { ...user, email };
    showDashboard();
    setupNavigation();
  } else {
    alert('Email ou mot de passe incorrect');
  }
};

// Show dashboard and update UI
function showDashboard() {
  hideAllSections();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  updateNavMenu();
  updateDashboardStats();
}

// Update navigation menu based on user role
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

  // Add logout button
  const logout = document.createElement('li');
  logout.className = 'nav-item ms-auto';
  logout.innerHTML = `
    <a class="nav-link" href="#" onclick="window.logout()">
      <i class="bi bi-box-arrow-right"></i> Déconnexion (${currentUser.email})
    </a>
  `;
  navMenu.appendChild(logout);
}

// Navigation function
window.navigateTo = function(hash) {
  hideAllSections();
  const sectionId = hash.substring(1);
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = 'block';
    loadSectionData(sectionId);
  }
};

// Hide all content sections
function hideAllSections() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => section.style.display = 'none');
  document.getElementById('dashboard').style.display = 'none';
}

// Load section specific data
function loadSectionData(sectionId) {
  switch (sectionId) {
    case 'courses':
      loadCourses();
      break;
    case 'grades':
      loadGrades();
      break;
    case 'announcements':
      loadAnnouncements();
      break;
    case 'messages':
      loadMessages();
      break;
  }
}

// Update dashboard statistics
function updateDashboardStats() {
  const courseCount = db.courses.length;
  const announcementCount = db.announcements.length;
  const messageCount = db.messages.filter(m => 
    m.to === currentUser.role || m.from === currentUser.role
  ).length;

  document.getElementById('coursesCount').textContent = `${courseCount} cours`;
  document.getElementById('announcementsCount').textContent = `${announcementCount} annonces`;
  document.getElementById('messagesCount').textContent = `${messageCount} messages`;
}

// Course Management
function loadCourses() {
  const coursesList = document.getElementById('coursesList');
  coursesList.innerHTML = '';

  db.courses.forEach(course => {
    const courseElement = document.createElement('div');
    courseElement.className = 'list-group-item';
    courseElement.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">${course.name}</h5>
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

// Grade Management
function loadGrades() {
  const gradesList = document.getElementById('gradesList');
  gradesList.innerHTML = '';

  db.grades.forEach(grade => {
    const student = db.users[grade.studentId];
    const course = db.courses.find(c => c.id === grade.courseId);
    
    const row = document.createElement('tr');
    row.className = 'grade-row';
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${course.name}</td>
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

// Announcement Management
function loadAnnouncements() {
  const announcementsList = document.getElementById('announcementsList');
  announcementsList.innerHTML = '';

  db.announcements.forEach(announcement => {
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

// Message Management
function loadMessages() {
  const conversationsList = document.getElementById('conversationsList');
  conversationsList.innerHTML = '';

  // Get unique conversations
  const conversations = [...new Set(db.messages
    .filter(m => m.to === currentUser.role || m.from === currentUser.role)
    .map(m => m.to === currentUser.role ? m.from : m.to)
  )];

  conversations.forEach(userId => {
    const user = db.users[userId];
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
  document.getElementById('currentConversationTitle').textContent = `Conversation avec ${db.users[userId].name}`;

  const messages = db.messages.filter(m => 
    (m.to === currentUser.role && m.from === userId) ||
    (m.from === currentUser.role && m.to === userId)
  );

  messages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.from === currentUser.role ? 'sent' : 'received'}`;
    messageElement.innerHTML = `
      <div>${message.content}</div>
      <small>${message.date}</small>
    `;
    messagesList.appendChild(messageElement);
  });
}

// Add new course
window.addCourse = function() {
  const name = document.getElementById('courseName').value;
  const description = document.getElementById('courseDescription').value;

  if (name && description) {
    const newCourse = {
      id: db.courses.length + 1,
      name,
      description,
      teacher: currentUser.name
    };

    db.courses.push(newCourse);
    loadCourses();
    document.getElementById('addCourseForm').reset();
  }
};

// Add new announcement
window.addAnnouncement = function() {
  const title = document.getElementById('announcementTitle').value;
  const content = document.getElementById('announcementContent').value;

  if (title && content) {
    const newAnnouncement = {
      id: db.announcements.length + 1,
      title,
      content,
      date: new Date().toISOString().split('T')[0]
    };

    db.announcements.push(newAnnouncement);
    loadAnnouncements();
    document.getElementById('addAnnouncementForm').reset();
  }
};

// Send message
window.sendMessage = function() {
  const content = document.getElementById('messageContent').value;
  const to = document.getElementById('currentConversationTitle').textContent.split(' ')[2];
  
  if (content && to) {
    const newMessage = {
      id: db.messages.length + 1,
      from: currentUser.role,
      to: Object.keys(db.users).find(key => db.users[key].name === to),
      content,
      date: new Date().toISOString().split('T')[0]
    };

    db.messages.push(newMessage);
    document.getElementById('messageContent').value = '';
    loadConversation(newMessage.to);
  }
};

// Logout function
window.logout = function() {
  currentUser = null;
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('authForm').reset();
  hideAllSections();
};

// Setup navigation
function setupNavigation() {
  window.addEventListener('hashchange', () => {
    navigateTo(window.location.hash || '#dashboard');
  });

  // Initial navigation
  navigateTo(window.location.hash || '#dashboard');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  if (!currentUser) {
    document.getElementById('loginForm').style.display = 'block';
    hideAllSections();
  }
});