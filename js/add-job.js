// Add job functionality
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const session = await checkAuth();
  if (!session) return;
  
  currentUser = session.user;
  
  // Setup form submission
  const form = document.querySelector('.add-job-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Setup cancel button
  const cancelBtn = document.querySelector('.btn-secondary');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }
  
  // Set default date to today
  const dateInput = document.getElementById('appliedDate');
  if (dateInput) {
    dateInput.valueAsDate = new Date();
  }
});

// Generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = {
    id: generateUUID(), // Generate UUID for the job application
    user_id: currentUser.id,
    company: document.getElementById('company').value.trim(),
    role: document.getElementById('jobTitle').value.trim(),
    platform: document.getElementById('source').value || null,
    applied_date: document.getElementById('appliedDate').value,
    status: document.getElementById('status').value,
    priority: document.querySelector('input[name="priority"]:checked')?.value || 'medium',
    notes: document.getElementById('notes').value.trim() || null,
    created_at: new Date().toISOString()
  };
  
  // Validate required fields
  if (!formData.company || !formData.role || !formData.status || !formData.applied_date) {
    alert('Please fill all required fields');
    return;
  }
  
  // Show loader
  showLoader('Adding job application...');
  
  try {
    const { data, error } = await supabaseClient
      .from('job_applications')
      .insert([formData])
      .select();
    
    if (error) throw error;
    
    hideLoader();
    
    // Show success message
    showNotification('Job application added successfully!');
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
    
  } catch (error) {
    console.error('Error adding job:', error);
    hideLoader();
    alert('Error adding job application: ' + error.message);
  }
}

function showLoader(message = 'Processing...') {
  let loader = document.getElementById('form-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'form-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    loader.innerHTML = `
      <div style="text-align: center;">
        <div style="
          width: 60px;
          height: 60px;
          border: 6px solid #E8F4FD;
          border-top: 6px solid #0B4F8A;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <p style="margin-top: 1.5rem; color: #0B4F8A; font-weight: 600; font-size: 1.1rem;">${message}</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loader);
  } else {
    loader.querySelector('p').textContent = message;
  }
  loader.style.display = 'flex';
}

function hideLoader() {
  const loader = document.getElementById('form-loader');
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
    padding: 1.2rem 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    z-index: 10000;
    font-weight: 600;
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
    notification.remove();
  }, 3000);
}
