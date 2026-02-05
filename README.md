# WorkSync - HR Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-MERN-green.svg)

[**Live Demo**](https://work-sync-dpnc.vercel.app/)

**WorkSync** is a comprehensive Human Resource Management System (HRMS) designed to streamline workforce management. It provides a unified platform for Admin, HR, and Employees to manage attendance, leaves, payroll, and daily tasks efficiently.

## 🚀 Key Features

### 👥 Role-Based Access Control
- **Admin**: Full system control, employee management, and system configuration.
- **HR**: Manage attendance, leave requests, payroll processing, and notices.
- **Employee**: Mark attendance, request leaves, view profile, and manage personal tasks.

### 🛠 Modules

- **Dashboard**: Interactive dashboard with real-time insights, attendance stats, and quick actions.
- **Attendance System**:
  - Daily check-in/check-out.
  - Attendance history and status tracking (Present, Absent, Leave).
  - Admin/HR manual attendance management.
- **Leave Management**:
  - Apply for leaves with different categories (Sick, Casual, Paid).
  - Approval workflow for HR/Admin.
  - Leave balance tracking.
- **Payroll Management**:
  - Automated salary calculation based on attendance and leaves.
  - Salary slip generation and history.
- **Employee Directory**:
  - Comprehensive employee profiles with search and filter capabilities.
  - Onboarding and offboarding management.
- **Notice Board**:
  - Digital announcements for company-wide updates.
  - Priority levels (General, Urgent, Event).
- **Task Management**:
  - Personal Todo list for employees to track daily deliverables.

## 💻 Technology Stack

This project is built using the **MERN** stack:

- **Frontend**: React.js, Vite, Context API, CSS3 (Glassmorphism & Modern UI Details).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT (JSON Web Tokens).

## 🛠️ Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URL)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/WorkSync.git
cd WorkSync
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm start
# Server runs on http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
# App runs on http://localhost:5173
```

## 📸 Usage

1.  **Login**: Use the demo credentials provided on the login page or create a new account.
2.  **Navigation**: Use the sidebar/navbar to access different modules based on your role.
3.  **Pro Tip**: Check out the **Dark Mode** and responsive design on mobile devices.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
