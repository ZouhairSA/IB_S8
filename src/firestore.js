import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";

async function loadCourses() {
  const coursesList = document.getElementById('coursesList');
  coursesList.innerHTML = '';

  const querySnapshot = await getDocs(collection(db, "courses"));
  querySnapshot.forEach((doc) => {
    const course = doc.data();
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
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editCourse('${doc.id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse('${doc.id}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
    coursesList.appendChild(courseElement);
  });
}

export { loadCourses };