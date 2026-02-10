# 🛄 JobPath – Job Application Tracker

🔗 Live Site: https://job-path-eight.vercel.app/

A comprehensive job application tracking system built with vanilla JavaScript and Supabase.

## Features

✅ **User Authentication**

* Email/Password signup and login
* Protected dashboard routes
* User session management
* Automatic redirection based on auth state

✅ **Dashboard**

* Personalized welcome with user's name
* Real-time statistics (Total Applications, Interviews, Applied, Rejected)
* Quick action buttons
* Recent applications list with company initials
* Delete functionality for each application

✅ **Add Job Application**

* Comprehensive form for tracking job details
* Company, role, status, date, platform, priority, and notes
* Real-time form submission with loading states
* Automatic redirect to dashboard after submission

✅ **Real-time Updates**

* All statistics update automatically when jobs are added/deleted
* Recent applications list refreshes dynamically
* Loading indicators for all async operations

---

## Setup Instructions

### 1. Supabase Configuration

This project uses **Supabase** for authentication and database.

* Create your own Supabase project
* Add your **Project URL** and **Public Anon Key** in `js/supabase.js`
* Create the required database table (schema provided below)

```js
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";
```

---

### 2. Row Level Security (RLS) Policies

⚠️ **Important**: Enable Row Level Security (RLS) on the `job_applications` table.

Recommended policies:

* Users can read their own jobs
* Users can insert their own jobs
* Users can update their own jobs
* Users can delete their own jobs

All policies should ensure:

```sql
auth.uid() = user_id
```

---

### 3. Running the Application

You must run this project using a local server.

**Option A: Local server**

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

**Option B: VS Code Live Server**

* Install **Live Server** extension
* Right-click `index.html`
* Select **Open with Live Server**

**Option C: Deployment**

* Deploy on Netlify, Vercel, or GitHub Pages
* The site works instantly after deployment

---

### 4. First Time Usage

1. Open the application in your browser
2. Sign up with email and password
3. You will be redirected to the dashboard
4. Add your first job application
5. All data is stored securely in Supabase

---

## Project Structure

```
JobPath/
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── add-job.html
├── js/
│   ├── supabase.js
│   ├── auth.js
│   ├── auth-guard.js
│   ├── dashboard.js
│   └── add-job.js
├── css/
├── assets/
└── README.md
```

---

## Database Schema

```sql
create table public.job_applications (
  id uuid not null default gen_random_uuid(),
  user_id uuid null,
  company text null,
  role text null,
  platform text null,
  applied_date date null,
  status text null,
  priority text null,
  notes text null,
  created_at timestamp with time zone default now(),
  constraint job_applications_pkey primary key (id),
  constraint job_applications_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade
);
```

⚠️ This schema assumes **RLS is enabled**.

---

## Security Notes

* The **Supabase public anon key** is safe to use in frontend code
* **Never expose your Supabase service role key**
* Always enable RLS on all tables
* Users can only access their own data

---

## Technologies Used

* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Backend**: Supabase (PostgreSQL)
* **Authentication**: Supabase Auth
* **Hosting**: Netlify, Vercel, GitHub Pages

---

**Made with ❤️ for job seekers**
