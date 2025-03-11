<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCkF_8D0S6cgTYzB5vVLJISJ1vU4zH_Za0",
    authDomain: "m1-ibtihal-university.firebaseapp.com",
    projectId: "m1-ibtihal-university",
    storageBucket: "m1-ibtihal-university.firebasestorage.app",
    messagingSenderId: "946534824102",
    appId: "1:946534824102:web:2b21b23ca72813664a9c67",
    measurementId: "G-HPQPNXKY18"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>