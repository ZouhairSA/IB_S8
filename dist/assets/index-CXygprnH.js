(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function t(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerPolicy&&(c.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?c.credentials="include":s.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(s){if(s.ep)return;s.ep=!0;const c=t(s);fetch(s.href,c)}})();const i={users:{student:{email:"student@test.com",password:"student123",role:"student",name:"Jean Dupont"},teacher:{email:"teacher@test.com",password:"teacher123",role:"teacher",name:"Prof Martin"},admin:{email:"admin@test.com",password:"admin123",role:"admin",name:"Admin System"}},courses:[{id:1,name:"Mathématiques",description:"Cours de mathématiques avancées",teacher:"Prof Martin"},{id:2,name:"Physique",description:"Introduction à la physique",teacher:"Prof Martin"}],grades:[{id:1,studentId:"student",courseId:1,grade:85},{id:2,studentId:"student",courseId:2,grade:78}],announcements:[{id:1,title:"Rentrée scolaire",content:"Bienvenue pour cette nouvelle année!",date:"2023-09-01"},{id:2,title:"Examens",content:"Les examens commencent le 15 décembre",date:"2023-11-15"}],messages:[{id:1,from:"teacher",to:"student",content:"N'oubliez pas le devoir pour demain",date:"2023-11-20"},{id:2,from:"student",to:"teacher",content:"Merci pour le rappel",date:"2023-11-20"}]};let a=null;const g={student:[{text:"Tableau de bord",href:"#dashboard",icon:"house"},{text:"Mes Cours",href:"#courses",icon:"book"},{text:"Mes Notes",href:"#grades",icon:"star"},{text:"Annonces",href:"#announcements",icon:"megaphone"},{text:"Messages",href:"#messages",icon:"envelope"}],teacher:[{text:"Tableau de bord",href:"#dashboard",icon:"house"},{text:"Mes Classes",href:"#courses",icon:"people"},{text:"Gestion des Notes",href:"#grades",icon:"pencil"},{text:"Annonces",href:"#announcements",icon:"megaphone"},{text:"Messages",href:"#messages",icon:"envelope"}],admin:[{text:"Tableau de bord",href:"#dashboard",icon:"house"},{text:"Gestion des Cours",href:"#courses",icon:"book"},{text:"Utilisateurs",href:"#users",icon:"people"},{text:"Annonces",href:"#announcements",icon:"megaphone"},{text:"Système",href:"#system",icon:"gear"}]};window.login=function(){const n=document.getElementById("email").value,e=document.getElementById("password").value,t=document.getElementById("userType").value,o=i.users[t];o&&o.email===n&&o.password===e?(a={...o,email:n},h(),E()):alert("Email ou mot de passe incorrect")};function h(){r(),document.getElementById("loginForm").style.display="none",document.getElementById("dashboard").style.display="block",f(),b()}function f(){const n=document.getElementById("navMenu");n.innerHTML="",g[a.role].forEach(o=>{const s=document.createElement("li");s.className="nav-item",s.innerHTML=`
      <a class="nav-link" href="${o.href}" onclick="navigateTo('${o.href}')">
        <i class="bi bi-${o.icon}"></i> ${o.text}
      </a>
    `,n.appendChild(s)});const t=document.createElement("li");t.className="nav-item ms-auto",t.innerHTML=`
    <a class="nav-link" href="#" onclick="window.logout()">
      <i class="bi bi-box-arrow-right"></i> Déconnexion (${a.email})
    </a>
  `,n.appendChild(t)}window.navigateTo=function(n){r();const e=n.substring(1),t=document.getElementById(e);t&&(t.style.display="block",p(e))};function r(){document.querySelectorAll(".content-section").forEach(e=>e.style.display="none"),document.getElementById("dashboard").style.display="none"}function p(n){switch(n){case"courses":l();break;case"grades":y();break;case"announcements":m();break;case"messages":v();break}}function b(){const n=i.courses.length,e=i.announcements.length,t=i.messages.filter(o=>o.to===a.role||o.from===a.role).length;document.getElementById("coursesCount").textContent=`${n} cours`,document.getElementById("announcementsCount").textContent=`${e} annonces`,document.getElementById("messagesCount").textContent=`${t} messages`}function l(){const n=document.getElementById("coursesList");n.innerHTML="",i.courses.forEach(e=>{const t=document.createElement("div");t.className="list-group-item",t.innerHTML=`
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">${e.name}</h5>
          <p class="mb-1">${e.description}</p>
          <small>Enseignant: ${e.teacher}</small>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editCourse(${e.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${e.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `,n.appendChild(t)})}function y(){const n=document.getElementById("gradesList");n.innerHTML="",i.grades.forEach(e=>{const t=i.users[e.studentId],o=i.courses.find(c=>c.id===e.courseId),s=document.createElement("tr");s.className="grade-row",s.innerHTML=`
      <td>${t.name}</td>
      <td>${o.name}</td>
      <td>${e.grade}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-2" onclick="editGrade(${e.id})">
          <i class="bi bi-pencil"></i>
        </button>
      </td>
    `,n.appendChild(s)})}function m(){const n=document.getElementById("announcementsList");n.innerHTML="",i.announcements.forEach(e=>{const t=document.createElement("div");t.className="list-group-item",t.innerHTML=`
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">${e.title}</h5>
          <p class="mb-1">${e.content}</p>
          <small>Date: ${e.date}</small>
        </div>
        ${a.role==="admin"?`
          <div>
            <button class="btn btn-sm btn-outline-primary me-2" onclick="editAnnouncement(${e.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteAnnouncement(${e.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `:""}
      </div>
    `,n.appendChild(t)})}function v(){const n=document.getElementById("conversationsList");n.innerHTML="",[...new Set(i.messages.filter(t=>t.to===a.role||t.from===a.role).map(t=>t.to===a.role?t.from:t.to))].forEach(t=>{const o=i.users[t],s=document.createElement("a");s.className="list-group-item list-group-item-action conversation-item",s.innerHTML=`
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1">${o.name}</h6>
          <small>${o.role}</small>
        </div>
      </div>
    `,s.onclick=()=>u(t),n.appendChild(s)})}function u(n){const e=document.getElementById("messagesList");e.innerHTML="",document.getElementById("currentConversationTitle").textContent=`Conversation avec ${i.users[n].name}`,i.messages.filter(o=>o.to===a.role&&o.from===n||o.from===a.role&&o.to===n).forEach(o=>{const s=document.createElement("div");s.className=`message ${o.from===a.role?"sent":"received"}`,s.innerHTML=`
      <div>${o.content}</div>
      <small>${o.date}</small>
    `,e.appendChild(s)})}window.addCourse=function(){const n=document.getElementById("courseName").value,e=document.getElementById("courseDescription").value;if(n&&e){const t={id:i.courses.length+1,name:n,description:e,teacher:a.name};i.courses.push(t),l(),document.getElementById("addCourseForm").reset()}};window.addAnnouncement=function(){const n=document.getElementById("announcementTitle").value,e=document.getElementById("announcementContent").value;if(n&&e){const t={id:i.announcements.length+1,title:n,content:e,date:new Date().toISOString().split("T")[0]};i.announcements.push(t),m(),document.getElementById("addAnnouncementForm").reset()}};window.sendMessage=function(){const n=document.getElementById("messageContent").value,e=document.getElementById("currentConversationTitle").textContent.split(" ")[2];if(n&&e){const t={id:i.messages.length+1,from:a.role,to:Object.keys(i.users).find(o=>i.users[o].name===e),content:n,date:new Date().toISOString().split("T")[0]};i.messages.push(t),document.getElementById("messageContent").value="",u(t.to)}};window.logout=function(){a=null,document.getElementById("loginForm").style.display="block",document.getElementById("dashboard").style.display="none",document.getElementById("authForm").reset(),r()};function E(){window.addEventListener("hashchange",()=>{navigateTo(window.location.hash||"#dashboard")}),navigateTo(window.location.hash||"#dashboard")}document.addEventListener("DOMContentLoaded",()=>{a||(document.getElementById("loginForm").style.display="block",r())});
