// Auth functionality for signup and login
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleSignup();
    });
  }
  
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleLogin();
    });
  }
});

async function handleSignup() {
  const firstName = document.getElementById("firstName")?.value.trim() || '';
  const lastName = document.getElementById("lastName")?.value.trim() || '';
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword2").value;
  const loader = document.getElementById("btnLoader");

  if (!email || !password || !confirmPassword) {
    alert("Please fill all required fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (loader) loader.style.display = "inline";

  try {
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || email.split('@')[0]);
    
    // Sign up the user
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (error) throw error;

    if (loader) loader.style.display = "none";
    
    alert("Account created successfully! Redirecting to dashboard...");
    window.location.href = "dashboard.html";
    
  } catch (error) {
    if (loader) loader.style.display = "none";
    
    if (error.message.toLowerCase().includes("already")) {
      alert("An account with this email already exists");
    } else {
      alert(error.message);
    }
  }
}

async function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const loader = document.getElementById("btnLoader");

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  if (loader) loader.style.display = "inline";

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (loader) loader.style.display = "none";
    
    window.location.href = "dashboard.html";
    
  } catch (error) {
    if (loader) loader.style.display = "none";
    alert(error.message);
  }
}

// Google Sign In
async function signInWithGoogle() {
  try {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard.html'
      }
    });

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  }
}
