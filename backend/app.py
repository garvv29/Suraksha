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
                    'gender': user['gender'],
                    'age': user['age'],
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
    gender = data.get('gender')
    age = data.get('age')
    designation = data.get('designation', '')
    department = data.get('department', '')
    specialization = data.get('specialization', '')
    experience_years = data.get('experience_years', 0)
    
    if not all([name, username, mobile_number, gender, age]):
        return jsonify({'error': 'Name, username, mobile number, gender and age are required'}), 400
    
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
        insert_query = """INSERT INTO users (name, username, password, mobile_number, gender, age, role, designation, 
                         department, specialization, experience_years) 
                         VALUES (%s, %s, %s, %s, %s, %s, 'professional', %s, %s, %s, %s)"""
        cursor.execute(insert_query, (name, username, mobile_number, mobile_number, gender, age, designation, 
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
    gender = data.get('gender')
    age = data.get('age')
    department = data.get('department')
    designation = data.get('designation', '')
    address = data.get('address')
    block = data.get('block')
    training_date = data.get('training_date')
    cpr_training = data.get('cpr_training', False)
    first_aid_kit_given = data.get('first_aid_kit_given', False)
    life_saving_skills = data.get('life_saving_skills', False)
    registered_by = data.get('registered_by')

    if not all([name, gender, age, department, address, block, training_date, registered_by]):
        return jsonify({'error': 'All required fields must be provided'}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor()
        insert_query = """
            INSERT INTO trainees (name, mobile_number, gender, age, department, designation, address, block, training_date, 
                                cpr_training, first_aid_kit_given, life_saving_skills, registered_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (name, mobile_number, gender, age, department, designation, address, block, training_date,
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
    """Get all medical professionals with training and trainee counts (admin only)"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        # Fetch professionals with training and trainee counts
        query = """
            SELECT 
                u.id, u.name, u.username, u.mobile_number, u.gender, u.age, 
                u.designation, u.department, u.specialization, u.experience_years, u.created_at,
                COUNT(DISTINCT t.id) as total_trainings,
                COUNT(DISTINCT tr.id) as total_trainees_trained
            FROM users u
            LEFT JOIN trainings t ON u.id = t.conducted_by
            LEFT JOIN trainees tr ON u.id = tr.registered_by
            WHERE u.role = 'professional'
            GROUP BY u.id, u.name, u.username, u.mobile_number, u.gender, u.age, 
                     u.designation, u.department, u.specialization, u.experience_years, u.created_at
            ORDER BY u.created_at DESC
        """
        cursor.execute(query)
        professionals = cursor.fetchall()
        # Convert datetime to string
        for prof in professionals:
            if prof['created_at']:
                prof['created_at'] = prof['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            # Ensure counts are integers
            prof['total_trainings'] = int(prof['total_trainings']) if prof['total_trainings'] else 0
            prof['total_trainees_trained'] = int(prof['total_trainees_trained']) if prof['total_trainees_trained'] else 0
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
    gender = data.get('gender')
    age = data.get('age')
    department = data.get('department')
    designation = data.get('designation', '')
    address = data.get('address')
    block = data.get('block')
    training_date = data.get('training_date')
    cpr_training = data.get('cpr_training', False)
    first_aid_kit_given = data.get('first_aid_kit_given', False)
    life_saving_skills = data.get('life_saving_skills', False)

    if not all([name, gender, age, department, address, block, training_date]):
        return jsonify({'error': 'All required fields must be provided'}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor()
        update_query = """
            UPDATE trainees 
            SET name = %s, mobile_number = %s, gender = %s, age = %s, department = %s, designation = %s, address = %s, block = %s, training_date = %s,
                cpr_training = %s, first_aid_kit_given = %s, life_saving_skills = %s
            WHERE id = %s
        """
        cursor.execute(update_query, (name, mobile_number, gender, age, department, designation, address, block, training_date,
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
            gender = %s,
            age = %s,
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
            data.get('gender'),
            data.get('age'),
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

# Training endpoints
@app.route('/api/create_training', methods=['POST'])
def create_training():
    """Create new training session"""
    data = request.get_json()
    title = data.get('title')
    description = data.get('description', '')
    training_topic = data.get('training_topic')
    address = data.get('address')
    block = data.get('block')
    training_date = data.get('training_date')
    training_time = data.get('training_time')
    duration_hours = data.get('duration_hours', 1.0)
    max_trainees = data.get('max_trainees', 50)
    conducted_by = data.get('conducted_by')

    if not all([title, training_topic, address, block, training_date, training_time, conducted_by]):
        return jsonify({'error': 'All required fields must be provided'}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor()
        insert_query = """
            INSERT INTO trainings (title, description, training_topic, address, block, training_date, 
                                 training_time, duration_hours, max_trainees, conducted_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (title, description, training_topic, address, block, training_date,
                                    training_time, duration_hours, max_trainees, conducted_by))
        connection.commit()

        return jsonify({'success': True, 'message': 'Training created successfully'})

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/get_trainings', methods=['GET'])
def get_trainings():
    """Get trainings (filtered by user role)"""
    user_id = request.args.get('user_id')
    role = request.args.get('role')

    # Add validation for required parameters
    if not role:
        return jsonify({'error': 'Role parameter is required'}), 400
    
    if role != 'admin' and not user_id:
        return jsonify({'error': 'User ID is required for non-admin users'}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor(dictionary=True)

        if role == 'admin':
            # Admin sees all trainings
            query = """
                SELECT t.*, u.name as conducted_by_name 
                FROM trainings t 
                JOIN users u ON t.conducted_by = u.id
                ORDER BY t.training_date DESC, t.training_time DESC
            """
            cursor.execute(query)
        else:
            # Professionals see only their own trainings
            query = """
                SELECT t.*, u.name as conducted_by_name 
                FROM trainings t 
                JOIN users u ON t.conducted_by = u.id
                WHERE t.conducted_by = %s
                ORDER BY t.training_date DESC, t.training_time DESC
            """
            cursor.execute(query, (user_id,))

        trainings = cursor.fetchall()

        # Convert date and time objects to strings
        for training in trainings:
            if training['training_date']:
                training['training_date'] = training['training_date'].strftime('%Y-%m-%d')
            if training['training_time']:
                training['training_time'] = str(training['training_time'])
            if training['created_at']:
                training['created_at'] = training['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            if training['updated_at']:
                training['updated_at'] = training['updated_at'].strftime('%Y-%m-%d %H:%M:%S')

        return jsonify({'success': True, 'trainings': trainings})

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/edit_training/<int:training_id>', methods=['PUT'])
def edit_training(training_id):
    """Edit training details"""
    data = request.get_json()
    title = data.get('title')
    description = data.get('description', '')
    training_topic = data.get('training_topic')
    address = data.get('address')
    block = data.get('block')
    training_date = data.get('training_date')
    training_time = data.get('training_time')
    duration_hours = data.get('duration_hours', 1.0)
    max_trainees = data.get('max_trainees', 50)
    status = data.get('status', 'Planned')

    if not all([title, training_topic, address, block, training_date, training_time]):
        return jsonify({'error': 'All required fields must be provided'}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor()
        update_query = """
            UPDATE trainings 
            SET title = %s, description = %s, training_topic = %s, address = %s, block = %s, 
                training_date = %s, training_time = %s, duration_hours = %s, max_trainees = %s, status = %s
            WHERE id = %s
        """
        cursor.execute(update_query, (title, description, training_topic, address, block, training_date,
                                    training_time, duration_hours, max_trainees, status, training_id))
        connection.commit()

        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Training updated successfully'})
        else:
            return jsonify({'error': 'Training not found'}), 404

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/delete_training/<int:training_id>', methods=['DELETE'])
def delete_training(training_id):
    """Delete training"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        delete_query = "DELETE FROM trainings WHERE id = %s"
        cursor.execute(delete_query, (training_id,))
        connection.commit()
        
        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Training deleted successfully'})
        else:
            return jsonify({'error': 'Training not found'}), 404
        
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

@app.route('/api/data', methods=['GET'])
def get_all_data():
    """Get all data from all tables for viewing table structures"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get data from all tables
        data = {}
        
        # Users table
        cursor.execute("SELECT * FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        # Convert datetime objects to strings for users
        for user in users:
            if user['created_at']:
                user['created_at'] = user['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        data['users'] = users
        
        # Trainees table
        cursor.execute("SELECT * FROM trainees ORDER BY created_at DESC")
        trainees = cursor.fetchall()
        # Convert datetime and date objects to strings for trainees
        for trainee in trainees:
            if trainee['training_date']:
                trainee['training_date'] = trainee['training_date'].strftime('%Y-%m-%d')
            if trainee['created_at']:
                trainee['created_at'] = trainee['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        data['trainees'] = trainees
        
        # Trainings table
        cursor.execute("SELECT * FROM trainings ORDER BY created_at DESC")
        trainings = cursor.fetchall()
        # Convert datetime, date and time objects to strings for trainings
        for training in trainings:
            if training['training_date']:
                training['training_date'] = training['training_date'].strftime('%Y-%m-%d')
            if training['training_time']:
                training['training_time'] = str(training['training_time'])
            if training['created_at']:
                training['created_at'] = training['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            if training['updated_at']:
                training['updated_at'] = training['updated_at'].strftime('%Y-%m-%d %H:%M:%S')
        data['trainings'] = trainings
        
        return jsonify({
            'success': True, 
            'data': data,
            'message': 'All table data retrieved successfully'
        })

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

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
