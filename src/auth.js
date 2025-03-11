import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

window.login = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Utilisateur connecté :", user.email);
    // Rediriger vers le tableau de bord ou une autre page
  } catch (error) {
    alert('Email ou mot de passe incorrect');
  }
};