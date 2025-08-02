-- Create database
CREATE DATABASE IF NOT EXISTS suraksha_db;
USE suraksha_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    age INT NOT NULL,
    role ENUM('admin', 'professional') NOT NULL,
    designation VARCHAR(100),
    department VARCHAR(100),
    specialization VARCHAR(100),
    experience_years INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create trainees table
CREATE TABLE IF NOT EXISTS trainees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    age INT NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    address VARCHAR(200) NOT NULL,
    block ENUM('Bastar', 'Bilaspur', 'Durg', 'Raigarh', 'Raipur', 'Surguja') NOT NULL,
    training_date DATE NOT NULL,
    cpr_training BOOLEAN DEFAULT FALSE,
    first_aid_kit_given BOOLEAN DEFAULT FALSE,
    life_saving_skills BOOLEAN DEFAULT FALSE,
    registered_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create trainings table
CREATE TABLE IF NOT EXISTS trainings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    training_topic VARCHAR(200) NOT NULL,
    address VARCHAR(200) NOT NULL,
    block ENUM('Bastar', 'Bilaspur', 'Durg', 'Raigarh', 'Raipur', 'Surguja') NOT NULL,
    training_date DATE NOT NULL,
    training_time TIME NOT NULL,
    duration_hours DECIMAL(3,1) DEFAULT 1.0,
    max_trainees INT DEFAULT 50,
    current_trainees INT DEFAULT 0,
    status ENUM('Planned', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Planned',
    conducted_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conducted_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, username, password, mobile_number, gender, age, role, designation, department, specialization, experience_years) VALUES 
('Admin User', 'admin', 'admin123', '9999999999', 'Male', 35, 'admin', 'System Administrator', 'IT Department', 'Healthcare IT', 5),
('Dr. Rajesh Smith', 'drsmith', '9876543210', '9876543210', 'Male', 42, 'professional', 'Senior Consultant', 'Cardiology', 'Interventional Cardiology', 12),
('Dr. Priya Johnson', 'drjohnson', '9123456789', '9123456789', 'Female', 38, 'professional', 'Associate Professor', 'Emergency Medicine', 'Trauma & Critical Care', 8),
('Dr. Amit Kumar', 'dramit', '9876543201', '9876543201', 'Male', 45, 'professional', 'Chief Medical Officer', 'Administration', 'Hospital Management', 15),
('Dr. Sunita Sharma', 'drsunita', '9876543202', '9876543202', 'Female', 40, 'professional', 'Senior Specialist', 'Pediatrics', 'Neonatal Care', 10),
('Dr. Vikram Singh', 'drvikram', '9876543203', '9876543203', 'Male', 37, 'professional', 'Consultant', 'Orthopedics', 'Joint Replacement', 7),
('Dr. Meera Patel', 'drmeera', '9876543204', '9876543204', 'Female', 39, 'professional', 'Associate Professor', 'Gynecology', 'Maternal Health', 9),
('Dr. Rohit Verma', 'drrohit', '9876543205', '9876543205', 'Male', 36, 'professional', 'Senior Resident', 'Neurology', 'Stroke Care', 6),
('Dr. Kavita Jain', 'drkavita', '9876543206', '9876543206', 'Female', 38, 'professional', 'Consultant', 'Dermatology', 'Cosmetic Surgery', 8),
('Dr. Ashish Gupta', 'drashish', '9876543207', '9876543207', 'Male', 44, 'professional', 'Senior Consultant', 'Oncology', 'Medical Oncology', 14),
('Dr. Neha Agarwal', 'drneha', '9876543208', '9876543208', 'Female', 41, 'professional', 'Associate Professor', 'Psychiatry', 'Child Psychology', 11),
('Dr. Sanjay Mishra', 'drsanjay', '9876543209', '9876543209', 'Male', 39, 'professional', 'Consultant', 'Pulmonology', 'Critical Care', 9),
('Dr. Ritu Chopra', 'drritu', '9876543220', '9876543220', 'Female', 43, 'professional', 'Senior Specialist', 'Radiology', 'Interventional Radiology', 13),
('Dr. Manish Joshi', 'drmanish', '9876543221', '9876543221', 'Male', 37, 'professional', 'Consultant', 'Anesthesiology', 'Pain Management', 7),
('Dr. Pooja Agarwal', 'drpooja', '9876543222', '9876543222', 'Female', 40, 'professional', 'Associate Professor', 'Pathology', 'Clinical Pathology', 10);

-- Insert sample trainees
INSERT INTO trainees (name, mobile_number, gender, age, department, designation, address, block, training_date, cpr_training, first_aid_kit_given, life_saving_skills, registered_by) VALUES 
('John Doe', '9876543211', 'Male', 28, 'Emergency', 'Emergency Responder', 'Main Hospital, Sector 1', 'Raipur', '2024-01-15', TRUE, TRUE, TRUE, 2),
('Jane Smith', '9876543212', 'Female', 25, 'Cardiology', 'Cardiac Technician', 'Cardiac Center, Block 2', 'Bilaspur', '2024-01-20', TRUE, FALSE, TRUE, 2),
('Bob Wilson', '9876543213', 'Male', 32, 'Pediatrics', 'Child Care Assistant', 'Children Hospital, Ward 3', 'Durg', '2024-01-25', FALSE, TRUE, FALSE, 3),
('Rahul Sharma', '9876543214', 'Male', 29, 'Emergency', 'Paramedic', 'Emergency Wing, Floor 1', 'Raipur', '2024-02-01', TRUE, TRUE, TRUE, 4),
('Anjali Verma', '9876543215', 'Female', 26, 'Cardiology', 'Heart Monitor Tech', 'ICU Block, Room 205', 'Bilaspur', '2024-02-05', TRUE, TRUE, FALSE, 2),
('Suresh Kumar', '9876543216', 'Male', 34, 'Orthopedics', 'Physiotherapist', 'Rehab Center, Building A', 'Durg', '2024-02-10', FALSE, TRUE, TRUE, 6),
('Priya Singh', '9876543217', 'Female', 27, 'Gynecology', 'Nursing Assistant', 'Maternity Ward, Floor 2', 'Raigarh', '2024-02-15', TRUE, FALSE, TRUE, 7),
('Arjun Patel', '9876543218', 'Male', 31, 'Neurology', 'Neuro Technician', 'Neuro Center, Block C', 'Surguja', '2024-02-20', TRUE, TRUE, TRUE, 8),
('Sneha Jain', '9876543219', 'Female', 24, 'Dermatology', 'Skin Care Assistant', 'Derma Clinic, Room 301', 'Bastar', '2024-02-25', FALSE, TRUE, FALSE, 9),
('Vikash Gupta', '9876543230', 'Male', 30, 'Oncology', 'Cancer Care Aide', 'Oncology Ward, Floor 4', 'Raipur', '2024-03-01', TRUE, TRUE, TRUE, 10),
('Kavya Sharma', '9876543231', 'Female', 23, 'Psychiatry', 'Mental Health Assistant', 'Psychiatry Block, Room 102', 'Bilaspur', '2024-03-05', TRUE, FALSE, TRUE, 11),
('Rohit Mishra', '9876543232', 'Male', 35, 'Pulmonology', 'Respiratory Therapist', 'Pulmonary Wing, Floor 3', 'Durg', '2024-03-10', FALSE, TRUE, TRUE, 12),
('Nisha Chopra', '9876543233', 'Female', 28, 'Radiology', 'Imaging Technician', 'Radiology Center, Basement', 'Raigarh', '2024-03-15', TRUE, TRUE, FALSE, 13),
('Amit Joshi', '9876543234', 'Male', 33, 'Anesthesiology', 'Anesthesia Technician', 'OR Complex, Floor 5', 'Surguja', '2024-03-20', TRUE, TRUE, TRUE, 14),
('Riya Agarwal', '9876543235', 'Female', 26, 'Pathology', 'Lab Technician', 'Pathology Lab, Building B', 'Bastar', '2024-03-25', FALSE, FALSE, TRUE, 15);

-- Insert sample trainings
INSERT INTO trainings (title, description, training_topic, address, block, training_date, training_time, duration_hours, max_trainees, current_trainees, status, conducted_by) VALUES 
('CPR & Life Support Training', 'Comprehensive training on CPR techniques and life support systems', 'CPR & Life Support', 'Medical Training Center, Main Campus', 'Raipur', '2024-08-15', '09:00:00', 4.0, 30, 25, 'Completed', 2),
('Emergency Response Workshop', 'Training on handling medical emergencies and crisis management', 'Emergency Response', 'Emergency Wing, Building A', 'Bilaspur', '2024-08-20', '10:00:00', 6.0, 25, 20, 'Completed', 3),
('First Aid Certification', 'Basic first aid training and certification program', 'First Aid', 'Community Health Center', 'Durg', '2024-08-25', '14:00:00', 3.0, 40, 35, 'Completed', 4),
('Advanced Cardiac Care', 'Advanced training on cardiac emergency procedures', 'Cardiac Care', 'Cardiology Department', 'Raipur', '2024-09-01', '11:00:00', 5.0, 20, 18, 'Ongoing', 2),
('Pediatric Emergency Care', 'Specialized training for handling pediatric emergencies', 'Pediatric Care', 'Children Hospital', 'Surguja', '2024-09-05', '09:30:00', 4.5, 25, 15, 'Planned', 5),
('Trauma Management', 'Training on trauma assessment and management techniques', 'Trauma Care', 'Trauma Center', 'Bastar', '2024-09-10', '13:00:00', 6.0, 30, 0, 'Planned', 6),
('Mental Health First Aid', 'Training on recognizing and responding to mental health crises', 'Mental Health', 'Psychiatry Block', 'Raigarh', '2024-09-15', '15:00:00', 3.5, 35, 0, 'Planned', 11),
('Infection Control Training', 'Training on infection prevention and control measures', 'Infection Control', 'Public Health Center', 'Bilaspur', '2024-09-20', '08:00:00', 2.5, 50, 0, 'Planned', 7);
