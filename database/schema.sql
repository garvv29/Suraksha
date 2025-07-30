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
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    training_date DATE NOT NULL,
    cpr_training BOOLEAN DEFAULT FALSE,
    first_aid_kit_given BOOLEAN DEFAULT FALSE,
    life_saving_skills BOOLEAN DEFAULT FALSE,
    registered_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, username, password, mobile_number, role, designation, department, specialization, experience_years) VALUES 
('Admin User', 'admin', 'admin123', '9999999999', 'admin', 'System Administrator', 'IT Department', 'Healthcare IT', 5),
('Dr. Rajesh Smith', 'drsmith', '9876543210', '9876543210', 'professional', 'Senior Consultant', 'Cardiology', 'Interventional Cardiology', 12),
('Dr. Priya Johnson', 'drjohnson', '9123456789', '9123456789', 'professional', 'Associate Professor', 'Emergency Medicine', 'Trauma & Critical Care', 8),
('Dr. Amit Kumar', 'dramit', '9876543201', '9876543201', 'professional', 'Chief Medical Officer', 'Administration', 'Hospital Management', 15),
('Dr. Sunita Sharma', 'drsunita', '9876543202', '9876543202', 'professional', 'Senior Specialist', 'Pediatrics', 'Neonatal Care', 10),
('Dr. Vikram Singh', 'drvikram', '9876543203', '9876543203', 'professional', 'Consultant', 'Orthopedics', 'Joint Replacement', 7),
('Dr. Meera Patel', 'drmeera', '9876543204', '9876543204', 'professional', 'Associate Professor', 'Gynecology', 'Maternal Health', 9),
('Dr. Rohit Verma', 'drrohit', '9876543205', '9876543205', 'professional', 'Senior Resident', 'Neurology', 'Stroke Care', 6),
('Dr. Kavita Jain', 'drkavita', '9876543206', '9876543206', 'professional', 'Consultant', 'Dermatology', 'Cosmetic Surgery', 8),
('Dr. Ashish Gupta', 'drashish', '9876543207', '9876543207', 'professional', 'Senior Consultant', 'Oncology', 'Medical Oncology', 14),
('Dr. Neha Agarwal', 'drneha', '9876543208', '9876543208', 'professional', 'Associate Professor', 'Psychiatry', 'Child Psychology', 11),
('Dr. Sanjay Mishra', 'drsanjay', '9876543209', '9876543209', 'professional', 'Consultant', 'Pulmonology', 'Critical Care', 9),
('Dr. Ritu Chopra', 'drritu', '9876543220', '9876543220', 'professional', 'Senior Specialist', 'Radiology', 'Interventional Radiology', 13),
('Dr. Manish Joshi', 'drmanish', '9876543221', '9876543221', 'professional', 'Consultant', 'Anesthesiology', 'Pain Management', 7),
('Dr. Pooja Agarwal', 'drpooja', '9876543222', '9876543222', 'professional', 'Associate Professor', 'Pathology', 'Clinical Pathology', 10);

-- Insert sample trainees
INSERT INTO trainees (name, mobile_number, department, location, training_date, cpr_training, first_aid_kit_given, life_saving_skills, registered_by) VALUES 
('John Doe', '9876543211', 'Emergency', 'Block A', '2024-01-15', TRUE, TRUE, TRUE, 2),
('Jane Smith', '9876543212', 'Cardiology', 'Block B', '2024-01-20', TRUE, FALSE, TRUE, 2),
('Bob Wilson', '9876543213', 'Pediatrics', 'Block C', '2024-01-25', FALSE, TRUE, FALSE, 3),
('Rahul Sharma', '9876543214', 'Emergency', 'Block A', '2024-02-01', TRUE, TRUE, TRUE, 4),
('Anjali Verma', '9876543215', 'Cardiology', 'Block B', '2024-02-05', TRUE, TRUE, FALSE, 2),
('Suresh Kumar', '9876543216', 'Orthopedics', 'Block D', '2024-02-10', FALSE, TRUE, TRUE, 6),
('Priya Singh', '9876543217', 'Gynecology', 'Block E', '2024-02-15', TRUE, FALSE, TRUE, 7),
('Arjun Patel', '9876543218', 'Neurology', 'Block F', '2024-02-20', TRUE, TRUE, TRUE, 8),
('Sneha Jain', '9876543219', 'Dermatology', 'Block G', '2024-02-25', FALSE, TRUE, FALSE, 9),
('Vikash Gupta', '9876543230', 'Oncology', 'Block H', '2024-03-01', TRUE, TRUE, TRUE, 10),
('Kavya Sharma', '9876543231', 'Psychiatry', 'Block I', '2024-03-05', TRUE, FALSE, TRUE, 11),
('Rohit Mishra', '9876543232', 'Pulmonology', 'Block J', '2024-03-10', FALSE, TRUE, TRUE, 12),
('Nisha Chopra', '9876543233', 'Radiology', 'Block K', '2024-03-15', TRUE, TRUE, FALSE, 13),
('Amit Joshi', '9876543234', 'Anesthesiology', 'Block L', '2024-03-20', TRUE, TRUE, TRUE, 14),
('Riya Agarwal', '9876543235', 'Pathology', 'Block M', '2024-03-25', FALSE, FALSE, TRUE, 15),
('Deepak Kumar', '9876543236', 'Emergency', 'Block A', '2024-04-01', TRUE, TRUE, TRUE, 2),
('Sakshi Verma', '9876543237', 'Cardiology', 'Block B', '2024-04-05', TRUE, TRUE, FALSE, 4),
('Manish Singh', '9876543238', 'Pediatrics', 'Block C', '2024-04-10', FALSE, TRUE, TRUE, 5),
('Preeti Patel', '9876543239', 'Orthopedics', 'Block D', '2024-04-15', TRUE, FALSE, TRUE, 6),
('Rajesh Jain', '9876543240', 'Gynecology', 'Block E', '2024-04-20', TRUE, TRUE, TRUE, 7),
('Sonia Gupta', '9876543241', 'Neurology', 'Block F', '2024-04-25', FALSE, TRUE, FALSE, 8),
('Vivek Sharma', '9876543242', 'Dermatology', 'Block G', '2024-05-01', TRUE, TRUE, TRUE, 9),
('Nikita Mishra', '9876543243', 'Oncology', 'Block H', '2024-05-05', TRUE, FALSE, TRUE, 10),
('Karan Chopra', '9876543244', 'Psychiatry', 'Block I', '2024-05-10', FALSE, TRUE, TRUE, 11),
('Divya Joshi', '9876543245', 'Pulmonology', 'Block J', '2024-05-15', TRUE, TRUE, FALSE, 12),
('Arun Agarwal', '9876543246', 'Radiology', 'Block K', '2024-05-20', TRUE, TRUE, TRUE, 13),
('Pooja Kumar', '9876543247', 'Anesthesiology', 'Block L', '2024-05-25', FALSE, FALSE, TRUE, 14),
('Nikhil Verma', '9876543248', 'Pathology', 'Block M', '2024-06-01', TRUE, TRUE, TRUE, 15),
('Shruti Singh', '9876543249', 'Emergency', 'Block A', '2024-06-05', TRUE, TRUE, FALSE, 2),
('Gaurav Patel', '9876543250', 'Cardiology', 'Block B', '2024-06-10', FALSE, TRUE, TRUE, 4),
('Tanvi Jain', '9876543251', 'Pediatrics', 'Block C', '2024-06-15', TRUE, FALSE, TRUE, 5),
('Harsh Gupta', '9876543252', 'Orthopedics', 'Block D', '2024-06-20', TRUE, TRUE, TRUE, 6),
('Isha Sharma', '9876543253', 'Gynecology', 'Block E', '2024-06-25', FALSE, TRUE, FALSE, 7),
('Varun Mishra', '9876543254', 'Neurology', 'Block F', '2024-07-01', TRUE, TRUE, TRUE, 8),
('Aditi Chopra', '9876543255', 'Dermatology', 'Block G', '2024-07-05', TRUE, FALSE, TRUE, 9),
('Sahil Joshi', '9876543256', 'Oncology', 'Block H', '2024-07-10', FALSE, TRUE, TRUE, 10),
('Neha Agarwal', '9876543257', 'Psychiatry', 'Block I', '2024-07-15', TRUE, TRUE, FALSE, 11),
('Akash Kumar', '9876543258', 'Pulmonology', 'Block J', '2024-07-20', TRUE, TRUE, TRUE, 12),
('Riya Verma', '9876543259', 'Radiology', 'Block K', '2024-07-25', FALSE, FALSE, TRUE, 13),
('Vishal Singh', '9876543260', 'Anesthesiology', 'Block L', '2024-07-30', TRUE, TRUE, TRUE, 14);
