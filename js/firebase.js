import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ===>>> C'est ICI qu'il faut coller ton "firebaseConfig" avec tes vraies clés <<<===
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "monde-du-pompier.firebaseapp.com",
  databaseURL: "https://monde-du-pompier-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "monde-du-pompier",
  storageBucket: "monde-du-pompier.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Le reste de ton code d'authentification...

let isSignup = false;

const toggleBtn = document.getElementById('toggle-auth');
const gradeField = document.getElementById('grade-field');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');

toggleBtn?.addEventListener('click', () => {
  isSignup = !isSignup;
  formTitle.textContent = isSignup ? "Inscription" : "Connexion";
  submitBtn.textContent = isSignup ? "S'inscrire" : "Se connecter";
  gradeField.classList.toggle('hidden', !isSignup);
  toggleBtn.textContent = isSignup ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire";
});

document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    if (isSignup) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const status = document.getElementById('user-status').value;
      
      // Enregistrement dans la Realtime Database
      await set(ref(db, 'users/' + userCredential.user.uid), {
        email: email,
        status: status,
        role: 'membre',
        createdAt: new Date().toISOString()
      });

      alert("Compte créé avec succès !");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Connexion réussie !");
    }
    window.location.href = "cours/index.html";
  } catch (error) {
    alert("Erreur : " + error.message);
  }
});
