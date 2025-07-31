from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Production-ready configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'suraksha-medical-training-2024')
app.config['DEBUG'] = os.environ.get('FLASK_ENV') != 'production'

# Database configuration
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', '8305'),  # MySQL password updated
    'database': os.environ.get('DB_NAME', 'suraksha_db'),
    'charset': 'utf8mb4',
    'use_unicode': True
}

def get_db_connection():
    """Get database connection with better error handling"""
    try:
        connection = mysql.connector.connect(
            **DB_CONFIG,
            connection_timeout=30,
            autocommit=True
        )
        return connection
    except mysql.connector.Error as e:
        app.logger.error(f"Database connection error: {e}")
        return None

@app.route('/api/login', methods=['POST'])
def login():
    """Login endpoint"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    
    if not all([username, password, role]):
        return jsonify({'error': 'All fields are required'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE username = %s AND password = %s AND role = %s"
        cursor.execute(query, (username, password, role))
        user = cursor.fetchone()
        
        if user:
            return jsonify({
                'success': True,
                'user': {
                    'id': user['id'],
                    'name': user['name'],
                    'username': user['username'],
                    'mobile_number': user['mobile_number'],
                    'role': user['role'],
                    'designation': user.get('designation'),
                    'department': user.get('department'),
                    'specialization': user.get('specialization'),
                    'experience_years': user.get('experience_years')
                }
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/register_professional', methods=['POST'])
def register_professional():
    """Register new medical professional (admin only)"""
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    mobile_number = data.get('mobile_number')
    designation = data.get('designation', '')
    department = data.get('department', '')
    specialization = data.get('specialization', '')
    experience_years = data.get('experience_years', 0)
    
    if not all([name, username, mobile_number]):
        return jsonify({'error': 'Name, username and mobile number are required'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if username already exists
        check_query = "SELECT id FROM users WHERE username = %s"
        cursor.execute(check_query, (username,))
        if cursor.fetchone():
            return jsonify({'error': 'Username already exists'}), 400
        
        # Insert new professional (password will be mobile number)
        insert_query = """INSERT INTO users (name, username, password, mobile_number, role, designation, 
                         department, specialization, experience_years) 
                         VALUES (%s, %s, %s, %s, 'professional', %s, %s, %s, %s)"""
        cursor.execute(insert_query, (name, username, mobile_number, mobile_number, designation, 
                                    department, specialization, experience_years))
        connection.commit()
        
        return jsonify({'success': True, 'message': 'Professional registered successfully'})
        
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/register_trainee', methods=['POST'])
def register_trainee():
    """Register new trainee"""
    data = request.get_json()
    name = data.get('name')
    mobile_number = data.get('mobile_number')
    department = data.get('department')
    designation = data.get('designation', '')
    location = data.get('location')
    training_date = data.get('training_date')
    cpr_training = data.get('cpr_training', False)
    first_aid_kit_given = data.get('first_aid_kit_given', False)
    life_saving_skills = data.get('life_saving_skills', False)
    registered_by = data.get('registered_by')

    if not all([name, department, location, training_date, registered_by]):
        return jsonify({'error': 'All required fields must be provided'}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor()
        insert_query = """
            INSERT INTO trainees (name, mobile_number, department, designation, location, training_date, 
                                cpr_training, first_aid_kit_given, life_saving_skills, registered_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (name, mobile_number, department, designation, location, training_date,
                                    cpr_training, first_aid_kit_given, life_saving_skills, registered_by))
        connection.commit()

        return jsonify({'success': True, 'message': 'Trainee registered successfully'})

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/get_trainees', methods=['GET'])
def get_trainees():
    """Get trainees (filtered by user role)"""
    user_id = request.args.get('user_id')
    role = request.args.get('role')

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor(dictionary=True)

        if role == 'admin':
            # Admin sees all trainees
            query = """
                SELECT t.*, u.name as registered_by_name 
                FROM trainees t 
                JOIN users u ON t.registered_by = u.id
                ORDER BY t.created_at DESC
            """
            cursor.execute(query)
        else:
            # Professionals see only their own trainees
            query = """
                SELECT t.*, u.name as registered_by_name 
                FROM trainees t 
                JOIN users u ON t.registered_by = u.id
                WHERE t.registered_by = %s
                ORDER BY t.created_at DESC
            """
            cursor.execute(query, (user_id,))

        trainees = cursor.fetchall()

        # Convert date objects to strings
        for trainee in trainees:
            if trainee['training_date']:
                trainee['training_date'] = trainee['training_date'].strftime('%Y-%m-%d')
            if trainee['created_at']:
                trainee['created_at'] = trainee['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            # Ensure designation is present (for backward compatibility)
            if 'designation' not in trainee:
                trainee['designation'] = ''

        return jsonify({'success': True, 'trainees': trainees})

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/get_professionals', methods=['GET'])
def get_professionals():
    """Get all medical professionals (admin only)"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        # Fetch all relevant fields for professionals
        query = """
            SELECT id, name, username, mobile_number, designation, department, specialization, experience_years, created_at
            FROM users
            WHERE role = 'professional'
            ORDER BY created_at DESC
        """
        cursor.execute(query)
        professionals = cursor.fetchall()
        # Convert datetime to string
        for prof in professionals:
            if prof['created_at']:
                prof['created_at'] = prof['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        return jsonify({'success': True, 'professionals': professionals})
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/edit_trainee/<int:trainee_id>', methods=['PUT'])
def edit_trainee(trainee_id):
    """Edit trainee details"""
    data = request.get_json()
    name = data.get('name')
    mobile_number = data.get('mobile_number')
    department = data.get('department')
    designation = data.get('designation', '')
    location = data.get('location')
    training_date = data.get('training_date')
    cpr_training = data.get('cpr_training', False)
    first_aid_kit_given = data.get('first_aid_kit_given', False)
    life_saving_skills = data.get('life_saving_skills', False)

    if not all([name, department, location, training_date]):
        return jsonify({'error': 'All required fields must be provided'}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor()
        update_query = """
            UPDATE trainees 
            SET name = %s, mobile_number = %s, department = %s, designation = %s, location = %s, training_date = %s,
                cpr_training = %s, first_aid_kit_given = %s, life_saving_skills = %s
            WHERE id = %s
        """
        cursor.execute(update_query, (name, mobile_number, department, designation, location, training_date,
                                    cpr_training, first_aid_kit_given, life_saving_skills, trainee_id))
        connection.commit()

        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Trainee updated successfully'})
        else:
            return jsonify({'error': 'Trainee not found'}), 404

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/delete_trainee/<int:trainee_id>', methods=['DELETE'])
def delete_trainee(trainee_id):
    """Delete trainee"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        delete_query = "DELETE FROM trainees WHERE id = %s"
        cursor.execute(delete_query, (trainee_id,))
        connection.commit()
        
        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Trainee deleted successfully'})
        else:
            return jsonify({'error': 'Trainee not found'}), 404
        
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/delete_professional/<int:professional_id>', methods=['DELETE'])
def delete_professional(professional_id):
    """Delete medical professional"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if professional exists and is not admin
        check_query = "SELECT role FROM users WHERE id = %s"
        cursor.execute(check_query, (professional_id,))
        result = cursor.fetchone()
        
        if not result:
            return jsonify({'error': 'Professional not found'}), 404
        
        if result[0] == 'admin':
            return jsonify({'error': 'Cannot delete admin user'}), 403
        
        # Delete the professional
        delete_query = "DELETE FROM users WHERE id = %s AND role = 'professional'"
        cursor.execute(delete_query, (professional_id,))
        connection.commit()
        
        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Medical professional deleted successfully'})
        else:
            return jsonify({'error': 'Professional not found or could not be deleted'}), 404
        
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/edit_professional/<int:professional_id>', methods=['PUT'])
def edit_professional(professional_id):
    """Edit medical professional"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        data = request.get_json()
        cursor = connection.cursor()
        
        # Check if professional exists and is not admin
        check_query = "SELECT role FROM users WHERE id = %s"
        cursor.execute(check_query, (professional_id,))
        result = cursor.fetchone()
        
        if not result:
            return jsonify({'error': 'Professional not found'}), 404
        
        if result[0] == 'admin':
            return jsonify({'error': 'Cannot edit admin user'}), 403
        
        # Update the professional
        update_query = """
        UPDATE users SET 
            name = %s, 
            username = %s, 
            mobile_number = %s,
            designation = %s,
            department = %s,
            specialization = %s,
            experience_years = %s
        WHERE id = %s AND role = 'professional'
        """
        
        cursor.execute(update_query, (
            data.get('name'),
            data.get('username'),
            data.get('mobile_number'),
            data.get('designation'),
            data.get('department'),
            data.get('specialization'),
            data.get('experience_years'),
            professional_id
        ))
        connection.commit()
        
        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Professional updated successfully'})
        else:
            return jsonify({'error': 'Professional not found or could not be updated'}), 404
        
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        connection = get_db_connection()
        if connection:
            connection.close()
            return jsonify({
                'status': 'OK', 
                'message': 'Server and database are running',
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'status': 'ERROR', 
                'message': 'Database connection failed'
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'ERROR', 
            'message': f'Health check failed: {str(e)}'
        }), 500

# Error handlers for production
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled exception: {str(e)}")
    return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    # Production-ready settings
    port = int(os.environ.get('PORT', 6969))
    debug = app.config['DEBUG']
    
    if debug:
        app.run(debug=True, port=port, host='0.0.0.0')
    else:
        # For production, use a proper WSGI server like Gunicorn
        app.run(debug=False, port=port, host='0.0.0.0')
