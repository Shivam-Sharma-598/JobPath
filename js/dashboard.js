// Dashboard functionality
let currentUser = null;
let jobApplications = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const session = await checkAuth();
  if (!session) return;
  
  currentUser = session.user;
  
  // Load user data
  await loadDashboard();
  
  // Setup logout
  setupLogout();
});

async function loadDashboard() {
  try {
    // Show loading state
    showLoader();
    
    // Update user name in welcome message
    updateUserName();
    
    // Load job applications
    await loadJobApplications();
    
    // Update statistics
    updateStats();
    
    // Display recent applications
    displayRecentApplications();
    
    hideLoader();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    hideLoader();
    alert('Error loading dashboard data');
  }
}

function updateUserName() {
  const welcomeH1 = document.querySelector('.welcome-section h1');
  if (welcomeH1 && currentUser) {
    const userName = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
    welcomeH1.textContent = `Welcome back, ${userName}! 👋`;
  }
}

async function loadJobApplications() {
  try {
    const { data, error } = await supabaseClient
      .from('job_applications')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    jobApplications = data || [];
  } catch (error) {
    console.error('Error loading job applications:', error);
    jobApplications = [];
  }
}

function updateStats() {
  const totalCount = jobApplications.length;
  const interviewCount = jobApplications.filter(job => 
    job.status === 'interview'
  ).length;
  const appliedCount = jobApplications.filter(job => 
    job.status === 'applied'
  ).length;
  const rejectedCount = jobApplications.filter(job => 
    job.status === 'rejected'
  ).length;
  
  // Update stat cards
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards[0]) {
    statCards[0].querySelector('.stat-number').textContent = totalCount;
  }
  if (statCards[1]) {
    statCards[1].querySelector('.stat-number').textContent = interviewCount;
  }
  if (statCards[2]) {
    statCards[2].querySelector('.stat-number').textContent = appliedCount;
  }
  if (statCards[3]) {
    statCards[3].querySelector('.stat-number').textContent = rejectedCount;
  }
}

function displayRecentApplications() {
  const applicationsList = document.querySelector('.applications-list');
  if (!applicationsList) return;
  
  // Clear existing applications (remove dummy data)
  applicationsList.innerHTML = '';
  
  if (jobApplications.length === 0) {
    applicationsList.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #5A6F7F;">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">No applications yet</p>
        <p>Click "Add New Job" to track your first application!</p>
      </div>
    `;
    return;
  }
  
  // Show recent 10 applications
  const recentJobs = jobApplications.slice(0, 10);
  
  recentJobs.forEach(job => {
    const card = createJobCard(job);
    applicationsList.appendChild(card);
  });
}

function createJobCard(job) {
  const card = document.createElement('div');
  card.className = 'application-card';
  card.setAttribute('data-job-id', job.id);
  
  // Get first letter of company name for logo
  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : '?';
  
  // Format date
  const appliedDate = job.applied_date ? new Date(job.applied_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Date not set';
  
  // Determine status class
  const statusClass = `status-${job.status || 'applied'}`;
  const statusText = formatStatus(job.status);
  
  card.innerHTML = `
    <div class="app-company-logo">${companyInitial}</div>
    <div class="app-details">
      <h4>${job.role || 'Unknown Role'}</h4>
      <p>${job.company || 'Unknown Company'}</p>
      <span class="app-date">Applied: ${appliedDate}</span>
    </div>
    <div class="app-status ${statusClass}">${statusText}</div>
    <button class="delete-btn" onclick="deleteJob('${job.id}')" title="Delete this application">
      🗑️
    </button>
  `;
  
  return card;
}

function formatStatus(status) {
  const statusMap = {
    'applied': 'Applied',
    'interview': 'Interview Scheduled',
    'review': 'In Review',
    'offer': 'Offer Received',
    'rejected': 'Rejected',
    'archived': 'Archived'
  };
  return statusMap[status] || 'Applied';
}

async function deleteJob(jobId) {
  if (!confirm('Are you sure you want to delete this application?')) {
    return;
  }
  
  showLoader();
  
  try {
    const { error } = await supabaseClient
      .from('job_applications')
      .delete()
      .eq('id', jobId)
      .eq('user_id', currentUser.id);
    
    if (error) throw error;
    
    // Remove from local array
    jobApplications = jobApplications.filter(job => job.id !== jobId);
    
    // Update UI
    updateStats();
    displayRecentApplications();
    
    hideLoader();
    
    // Optional: Show success message
    showNotification('Application deleted successfully');
  } catch (error) {
    console.error('Error deleting job:', error);
    hideLoader();
    alert('Error deleting application: ' + error.message);
  }
}

function setupLogout() {
  const userProfile = document.querySelector('.user-profile');
  if (userProfile) {
    userProfile.style.cursor = 'pointer';
    userProfile.addEventListener('click', () => {
      if (confirm('Do you want to logout?')) {
        logout();
      }
    });
  }
}

function showLoader() {
  let loader = document.getElementById('dashboard-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'dashboard-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    loader.innerHTML = `
      <div style="text-align: center;">
        <div style="
          width: 50px;
          height: 50px;
          border: 5px solid #E8F4FD;
          border-top: 5px solid #0B4F8A;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <p style="margin-top: 1rem; color: #0B4F8A; font-weight: 600;">Loading...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loader);
  }
  loader.style.display = 'flex';
}

function hideLoader() {
  const loader = document.getElementById('dashboard-loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#EF5350'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Make deleteJob available globally
window.deleteJob = deleteJob;
