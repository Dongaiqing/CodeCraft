from flask import Flask, g, request, jsonify, url_for, redirect
from flaskext.mysql import MySQL
import os, json, subprocess


app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'CodeCraft'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

class Queries():
    @staticmethod
    def insertIntoQuestionCode():
        return 'INSERT INTO QuestionCode(title, article, answer, rating, author) VALUES (%s,%s,%s,%s,%s);'
    @staticmethod
    def tryLogin():
        return 'SELECT * FROM UserProfile WHERE username=%s AND password=%s'
    @staticmethod
    def lookupLoginExists():
        return 'SELECT * FROM UserProfile WHERE username=%s'
    @staticmethod
    def insertIntoRegister():
        return 'INSERT INTO UserProfile(username, useremail, password) VALUES(%s, %s, %s)'
    @staticmethod
    def getQuestionTitles():
        return 'SELECT title FROM QuestionCode WHERE title LIKE %s OR article LIKE %s'
    @staticmethod
    def storeQuestionAnswer():
        return 'INSERT INTO QuestionSubmission(sourceCode, sourceLanguage, userID, questionID, result) VALUES (%s,%s,%s,%s,%s)'
    @staticmethod
    def updateQuestionAnswer():
        return 'UPDATE QuestionSubmission SET sourceCode=%s, result=%s, sourceLanguage=%s WHERE userID=%s AND questionID=%s'
    @staticmethod
    def getAllRoadmapTopLevelComments():
        return 'SELECT * FROM Comments WHERE Comments.id='
    @staticmethod
    def getAllRoadmapSecondLevelComments():
        return

    @staticmethod
    def getAllQuestionTopComments():
        #
    @staticmethod
    def getAllQuestionSecondLevelComments():
        #

@app.route('/')
def index():
    get_conn()
    return app.send_static_file('index.html')

@app.route('/dist.js')
def index_js():
    return app.send_static_file('dist.js')


def get_conn():
    conn = getattr(g, '_database', None)
    if conn is None:
        conn = g._database = mysql.connect()
        cursor = conn.cursor()
        # check if any table exists
        table_exist = False
        with open('sql/testIfTableExists.sql', 'r') as file:
            data = file.read().replace('\n', '')
            cursor.execute(data)
            if cursor.fetchone()[0] == 1:
                table_exist = True

        # initialize database if does not exist
        if not table_exist:
            with open('sql/createTables.sql', 'r') as file:
                data = [line + ';' for line in file.read().replace('\n', '').split(';')]
                for line in data:
                    if line.strip() == ';':
                        continue
                    cursor.execute(line)
            with open('data/questions.json', 'r') as file:
                data = json.load(file)
                for obj in data:
                    try:
                        cursor.execute(Queries.insertIntoQuestionCode(),
                                       (obj['question_theme'], obj['question'], obj['answer'], 0, 'default'))
                    except KeyError:
                        print(obj)
            conn.commit()
        cursor.close()
    return conn

@app.teardown_appcontext
def close_connection(exception):
    conn = getattr(g, '_database', None)
    if conn is not None:
        conn.close()

def init_conn():
    with app.app_context():
        conn = get_conn()

# force redirecting to home
@app.route('/coding')
@app.route('/roulette')
@app.route('/roadmap')
def redirectToHome():
    return redirect(url_for('index'))

# starting to capture urls
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if 'username' not in data or 'password' not in data:
        return jsonify(1)
    cursor = get_conn().cursor()
    cursor.execute(Queries.tryLogin(), (data['username'], data['password']))
    result = cursor.fetchone()
    cursor.close()
    if result is not None:
        return jsonify(0)
    return jsonify(1)

@app.route('/registration', methods=['POST'])
def registration():
    data = request.get_json()
    if 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify(1)
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.lookupLoginExists(), (data['username']))
    result = cursor.fetchone()
    if result is None:
        cursor.execute(Queries.insertIntoRegister(), (data['username'], data['email'], data['password']))
        conn.commit()
        cursor.close()
        return jsonify(0)
    cursor.close()
    return jsonify(1)

@app.route('/code_test', methods=['GET', 'POST'])
def sendCodeANDreceiveResponse():
    if request.method == 'GET':
        id = request.args.get('id')
        keywords = request.args.get('title')
        if id is None or keywords is None:
            return jsonify([])
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute(Queries.getQuestionTitles(), ('%'+keywords+'%', '%'+keywords+'%'))
        return jsonify(cursor.fetchall())
    elif request.method == 'POST':
        data = request.get_json()
        if 'user_id' not in data or 'question_id' not in data or 'source_code' not in data or 'language' not in data:
            failed = {}
            failed['header'] = 'Failed to submit your answer'
            failed['content'] = 'You have input invalid information'
            return jsonify(failed)
        language_pool = {
            'ruby': 'rb',
            'javascript': 'node',
            'python': 'python3',
            'java': 'javac'
        }
        conn = get_conn()
        cursor = conn.cursor()
        user_id = data['user_id']
        source_code = data['source_code']
        language = data['language']
        question_id = data['question_id']

        executable = language_pool.get(data['language'], None)
        if executable is None:
            try:
                cursor.execute(Queries.storeQuestionAnswer(),
                               (source_code, language, user_id, question_id, 'default'))
            except Exception:
                cursor.execute((Queries.updateQuestionAnswer(), (source_code, 'default', language, user_id, question_id)))
            conn.commit()
            saved = {}
            saved['header'] = 'Success'
            saved['content'] = 'Your response has been saved!'
            return jsonify(saved)
        else:
            result = ''
            def execute_code():
                temp_filename = 'temp'+user_id+question_id
                temp_outputname = 'out'+user_id+question_id
                if executable == 'rb':
                    complete_filename = temp_filename+'.rb'
                    with open(complete_filename, 'w') as file:
                        file.write(source_code)
                        subprocess.call('rb '+complete_filename+' > '+temp_outputname)
                        with open(temp_outputname, 'r') as f:
                            result = f.read()
                    os.remove(complete_filename)
                    os.remove(temp_outputname)
                elif executable == 'python3':
                    complete_filename = temp_filename+'.py'
                    with open(complete_filename, 'w') as file:
                        file.write(source_code)
                        subprocess.call('python3 ' + complete_filename + ' > ' + temp_outputname)
                        with open(temp_outputname, 'r') as f:
                            result = f.read()
                    os.remove(complete_filename)
                    os.remove(temp_outputname)
                elif executable == 'node':
                    complete_filename = temp_filename+'.js'
                    with open(complete_filename, 'w') as file:
                        file.write(source_code)
                        subprocess.call('node ' + complete_filename + ' > ' + temp_outputname)
                        with open(temp_outputname, 'r') as f:
                            result = f.read()
                    os.remove(complete_filename)
                    os.remove(temp_outputname)
                elif executable == 'javac':
                    complete_filename = temp_filename+'.java'
                    with open(complete_filename, 'w') as file:
                        file.write(source_code)
                        subprocess.call('javac ' + complete_filename)
                        subprocess.call('java ' + temp_filename + ' > ' + temp_outputname)
                        with open(temp_outputname, 'r') as f:
                            result = f.read()
                    os.remove(complete_filename)
                    os.remove(temp_filename+'.class')
                    os.remove(temp_outputname)
            try:
                cursor.execute(Queries.storeQuestionAnswer(),
                               (source_code, language, user_id, question_id, result))
            except Exception:
                cursor.execute((Queries.updateQuestionAnswer(), (source_code, result, language, user_id, question_id)))
            conn.commit()
            saved = {}
            saved['header'] = 'Success'
            saved['content'] = result
            return jsonify(saved)

@app.route('/get_comments', methods=['GET'])
def getComments():
    is_for_road_map = request.args.get('is_for_road_map')
    question_id = request.args.get('question_id')
    if is_for_road_map is None or question_id is None:
        return redirect('/404')
    if is_for_road_map == 1:
        # meaning for roadmap


if __name__ == '__main__':
    app.run()
