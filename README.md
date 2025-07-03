 
# 🦷 Dental Center Management System

A comprehensive dental practice management dashboard built with **React** and modern web technologies. This system enables dental centers to manage patients, appointments, and treatment records with **role-based access control**.

---

## 🚀 Live Demo

🔗 [View Live Application](https://dentalcare-entnt-w829.vercel.app/)  


---

## 📋 Features

### 🔑 Core Functionality

- ✅ **User Authentication** (Admin / Patient)
- 🧾 **Patient Management** — Full CRUD operations
- 📅 **Appointment Management** — Schedule, update & track
- 🗓️ **Calendar View** — Monthly & weekly views
- 📂 **File Upload** — Upload treatment records & invoices
- 📊 **Dashboard Analytics** — Revenue, patients, appointments KPIs

### 👥 User Roles

- **Admin (Dentist)**: Full system access
- **Patient**: View appointments & treatment history only

### ⚙️ Technical Highlights

- 📱 **Responsive Design** — Mobile-first layout
- 💾 **Data Persistence** — Stored in `localStorage`
- 📎 **File Handling** — Base64 encoding
- ✅ **Form Validation** — Built-in checks
- ✨ **Modern UI** — Built with Tailwind CSS & React Icons

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| **React 18** | Frontend Framework |
| **JavaScript (ES6+)** | Programming Language |
| **Tailwind CSS** | Styling |
| **React Icons** | Icons |
| **React Router DOM** | Routing |
| **React Context API** | State Management |
| **localStorage** | Data Persistence |

---

## 📦 Installation & Setup


### ▶️ Local Development

```bash
# Clone the repo
git clone https://github.com/rajaiswal6544/Dentalcare_ENTNT
cd Dentalcare_ENTNT

# Install dependencies
npm install
# or
yarn install

# Start the dev server
npm start
# or
yarn start
````

Navigate to: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Demo Credentials

### 👨‍⚕️ Admin Access

* **Email**: `admin@entnt.in`
* **Password**: `admin123`

### 🧑‍🦰 Patient Access

* **Email**: `john@entnt.in`
* **Password**: `patient123`

---

## 🏗️ Project Structure

```
src/
├── components/         # Shared UI components
│   ├── Layout.js
│   ├── ProtectedRoute.js
│   ├── AdminDashboard.js
│   └── PatientDashboard.js
├── contexts/           # Context providers
│   ├── AuthContext.js
│   └── DataContext.js
├── pages/              # Route-level pages
│   ├── LoginPage.js
│   ├── Dashboard.js
│   ├── Patients.js
│   ├── Appointments.js
│   └── Calendar.js
├── App.js              # App entry
├── index.js            # ReactDOM renderer
└── index.css           # Tailwind + global styles
```

---

## 🧠 State Management

* `AuthContext`: Manages login state and user role
* `DataContext`: Stores patients and appointments in `localStorage`

---

## 🗃️ Data Models

### 👤 User

```js
const user = {
  id: 'string',
  role: 'Admin' | 'Patient',
  email: 'string',
  patientId: 'string' // if Patient
}
```

### 🧾 Patient

```js
const patient = {
  id: 'string',
  name: 'string',
  dob: 'string',
  contact: 'string',
  healthInfo: 'string'
}
```

### 📅 Appointment / Incident

```js
const incident = {
  id: 'string',
  patientId: 'string',
  title: 'string',
  description: 'string',
  comments: 'string',
  appointmentDate: 'string',
  cost: number,
  treatment: 'string',
  status: 'Scheduled' | 'Completed' | 'Cancelled',
  nextDate: 'string',
  files: [{ name: 'string', url: 'string' }]
}
```

---

## 🚀 Deployment

### 🔄 Vercel

## 📄 License

This project is for **educational and assessment purposes**. All rights reserved.

---

## 🙋 Made By

**Raj Jaiswal**
📧 Email: [rajaiswaldev24@gmail.com](mailto:rajaiswaldev24@gmail.com)
🌐 GitHub: [rajaiswal6544](https://github.com/rajaiswal6544)

---

