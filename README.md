# Suraksha - Medical Training Management System

A full-stack web application for managing medical training programs with role-based access control.

## 🏥 Features

### Admin Dashboard
- View all medical professionals and trainees
- Add new medical professionals
- Edit/delete any trainee records
- System overview with statistics

### Medical Professional Dashboard
- Register new trainees (frontline workers)
- View and manage their own trainees
- Track training completion status
- Edit/delete their registered trainees

### Training Tracking
- CPR Training status
- First Aid Kit distribution
- Life-saving skills certification
- Department and location tracking

## 🚀 Tech Stack

- **Frontend**: React.js with clean CSS (no frameworks)
- **Backend**: Flask with raw MySQL queries
- **Database**: MySQL
- **Authentication**: Simple session-based authentication

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MySQL Server (v8.0 or higher)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Suraksha
```

### 2. Database Setup

1. Start your MySQL server
2. Create the database and tables:
```bash
mysql -u root -p < database/schema.sql
```

**Note**: The MySQL password is already configured for this setup. If you need to change it, update `backend/app.py`:
```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '8305',  # Current MySQL password
    'database': 'suraksha_db'
}
```

### 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app will run on `http://localhost:3000`

## 🔐 Demo Credentials

### Admin Login
- **Username**: admin
- **Password**: admin123
- **Role**: Administrator

### Medical Professional Login
- **Username**: drsmith
- **Password**: 9876543210 (mobile number)
- **Role**: Medical Professional

**Alternative Professional:**
- **Username**: drjohnson
- **Password**: 9123456789 (mobile number)
- **Role**: Medical Professional

## 📊 Database Schema

### Users Table
```sql
id (INT, PK, auto_increment)
name (VARCHAR)
username (VARCHAR, UNIQUE)
password (VARCHAR)
mobile_number (VARCHAR)
role (ENUM: 'admin', 'professional')
created_at (DATETIME)
```

### Trainees Table
```sql
id (INT, PK, auto_increment)
name (VARCHAR)
mobile_number (VARCHAR)
department (VARCHAR)
location (VARCHAR)
training_date (DATE)
cpr_training (BOOLEAN)
first_aid_kit_given (BOOLEAN)
life_saving_skills (BOOLEAN)
registered_by (INT, FK to users.id)
created_at (DATETIME)
```

## 🌐 API Endpoints

### Authentication
- `POST /api/login` - User login

### Professional Management (Admin only)
- `POST /api/register_professional` - Add new medical professional
- `GET /api/get_professionals` - Get all professionals

### Trainee Management
- `POST /api/register_trainee` - Register new trainee
- `GET /api/get_trainees` - Get trainees (filtered by role)
- `PUT /api/edit_trainee/<id>` - Update trainee
- `DELETE /api/delete_trainee/<id>` - Delete trainee

### Health Check
- `GET /api/health` - Server health check

## 🖥️ Application Flow

1. **Login Page**: Users select their role (Admin/Professional) and login
2. **Dashboard Routing**: Based on role, users are redirected to appropriate dashboard
3. **Admin Functions**: 
   - Manage medical professionals
   - View all trainees system-wide
   - Edit/delete any records
4. **Professional Functions**:
   - Register new trainees
   - Manage only their own trainees
   - Track training completion

## 🎨 UI Features

- Clean, responsive design without external CSS frameworks
- Role-based navigation and functionality
- Modal forms for adding/editing records
- Data tables with sorting and actions
- Success/error message notifications
- Loading states and error handling

## 🔧 Development

### Project Structure
```
Suraksha/
├── backend/
│   ├── app.py              # Flask application
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Global styles
│   │   ├── api.js         # API service
│   │   └── index.js       # Entry point
│   └── package.json       # Node dependencies
└── database/
    └── schema.sql         # Database schema
```

### Running in Development Mode

Both frontend and backend support hot reloading:

- Frontend: Changes auto-refresh the browser
- Backend: Flask runs in debug mode with auto-restart

### Adding New Features

1. **New API Endpoint**: Add to `backend/app.py`
2. **New UI Component**: Add to `frontend/src/components/`
3. **New Page**: Add to `frontend/src/pages/` and update routing in `App.js`
4. **Database Changes**: Update `database/schema.sql`

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL server is running
   - Verify credentials in `backend/app.py`
   - Ensure database `suraksha_db` exists

2. **CORS Issues**
   - Flask-CORS is configured for all origins in development
   - For production, update CORS settings

3. **Port Already in Use**
   - Backend: Change port in `app.py` (default: 5000)
   - Frontend: Set `PORT=3001` environment variable

4. **Module Not Found**
   - Backend: Run `pip install -r requirements.txt`
   - Frontend: Run `npm install`

## 📝 Notes

- This is a development setup with simplified authentication
- For production, implement proper JWT authentication and password hashing
- Update CORS settings for production deployment
- Consider adding input validation and sanitization
- Database connection pooling recommended for production

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure database is properly set up
4. Check console logs for detailed error messages
