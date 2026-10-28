import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Configuration Firebase exacte basée sur ton projet "Monde du pompier"
const firebaseConfig = {
  apiKey: "TON_API_KEY_ICI", // Remplace juste cette ligne par ta vraie clé (ex: AIzaSy...)
  authDomain: "monde-du-pompier.firebaseapp.com",
  databaseURL: "https://monde-du-pompier-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "monde-du-pompier",
  storageBucket: "monde-du-pompier.appspot.com",
  messagingSenderId: "1036756593120",
  appId: "1:1036756593120:web:41a3a9f5a06bdee5aee385"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let isSignup = false;

const toggleBtn = document.getElementById('toggle-auth');
const gradeField = document.getElementById('grade-field');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');

// Gestion bascule Connexion / Inscription
toggleBtn?.addEventListener('click', () => {
  isSignup = !isSignup;
  formTitle.textContent = isSignup ? "Inscription" : "Connexion";
  submitBtn.textContent = isSignup ? "S'inscrire" : "Se connecter";
  gradeField.classList.toggle('hidden', !isSignup);
  toggleBtn.textContent = isSignup ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'inscrire";
});

// Envoi du formulaire à Firebase
document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    if (isSignup) {
      // Création du compte utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const status = document.getElementById('user-status').value;
      
      // Enregistrement des données de profil dans la Realtime Database
      await set(ref(db, 'users/' + userCredential.user.uid), {
        email: email,
        status: status,
        role: 'membre',
        createdAt: new Date().toISOString()
      });

      alert("Compte créé avec succès !");
    } else {
      // Connexion de l'utilisateur
      await signInWithEmailAndPassword(auth, email, password);
      alert("Connexion réussie !");
    }
    // Redirection vers la page des cours après connexion/inscription
    window.location.href = "cours/index.html";
  } catch (error) {
    alert("Erreur : " + error.message);
  }
});
