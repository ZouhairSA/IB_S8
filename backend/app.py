from flask import Flask, jsonify, request
import mysql.connector

app = Flask(__name__)

# Configuration de la base de données
db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'school_db'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

@app.route('/api/courses', methods=['GET'])
def get_courses():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM courses')
    courses = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(courses)

@app.route('/api/grades', methods=['GET'])
def get_grades():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM grades')
    grades = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(grades)

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM announcements')
    announcements = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(announcements)

@app.route('/api/messages', methods=['GET'])
def get_messages():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM messages')
    messages = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(messages)

@app.route('/api/courses', methods=['POST'])
def add_course():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO courses (title, description, teacher) VALUES (%s, %s, %s)',
                   (data['title'], data['description'], data['teacher']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Course added successfully!'}), 201

@app.route('/api/announcements', methods=['POST'])
def add_announcement():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO announcements (title, content, date) VALUES (%s, %s, %s)',
                   (data['title'], data['content'], data['date']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Announcement added successfully!'}), 201

@app.route('/api/messages', methods=['POST'])
def add_message():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO messages (sender_id, receiver_id, content, date) VALUES (%s, %s, %s, %s)',
                   (data['from'], data['to'], data['content'], data['date']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Message sent successfully!'}), 201

if __name__ == '__main__':
    app.run(debug=True)
