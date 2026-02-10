// Auth guard to protect dashboard and other pages
async function checkAuth() {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error) throw error;
    
    // If no session and on protected page, redirect to login
    const protectedPages = ['dashboard.html', 'add-job.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!session && protectedPages.includes(currentPage)) {
      window.location.href = 'login.html';
      return null;
    }
    
    // If session exists and on auth pages, redirect to dashboard
    const authPages = ['login.html', 'signup.html'];
    if (session && authPages.includes(currentPage)) {
      window.location.href = 'dashboard.html';
      return session;
    }
    
    return session;
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
}

// Logout function
async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    
    window.location.href = 'index.html';
  } catch (error) {
    alert('Error logging out: ' + error.message);
  }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);
