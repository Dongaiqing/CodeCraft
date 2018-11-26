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
        return 'INSERT INTO QuestionCode(title, article, answer, totalRating, numRating, author) VALUES (%s,%s,%s,%s,%s);'
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
        return 'SELECT * FROM Comments WHERE Comments.id in (SELECT commentsID FROM RoadMap_Comments WHERE roadmapID = %s) AND Comments.id in (SELECT commentsID FROM Comments_Comments)'
    @staticmethod
    def getAllRoadmapSecondLevelComments():
        return 'SELECT * FROM Comments WHERE Comments.id in (SELECT commentsID FROM RoadMap_Comments WHERE roadmapID = %s) AND Comments.id in (SELECT secondaryCommentsID FROM Comments_Comments WHERE Comments_Comments.commentsID = %s)'

    @staticmethod
    def getAllQuestionTopComments():
        return 'SELECT * FROM Comments WHERE Comments.id in (SELECT commentsID FROM QuestionCode_Comments WHERE roadmapID = %s) AND Comments.id in (SELECT commentsID FROM Comments_Comments)'
    @staticmethod
    def getAllQuestionSecondLevelComments():
        return 'SELECT * FROM Comments WHERE Comments.id in (SELECT commentsID FROM QuestionCode_Comments WHERE roadmapID = %s) AND Comments.id in (SELECT secondaryCommentsID FROM Comments_Comments WHERE Comments_Comments.commentsID = %s)'
    @staticmethod
    def insertIntoComments():
        return 'INSERT INTO Comments(imageSource, username, comment, upvoteNum, downvoteNum) VALUES(%s, %s, %s, %s, %s)'
    @staticmethod
    def insertIntoSubComments():
        return 'INSERT INTO Comments_Comments(commentsID, secondaryCommentsID) VALUES((SELECT id FROM Comments WHERE id=%s), (SELECT id FROM Comments WHERE id=%s))'
    @staticmethod
    def insertIntoRoadMap_Comments():
        return 'INSERT INTO RoadMap_Comments(roadmapID, commentsID) VALUES((SELECT id FROM RoadMap WHERE id=%s), (SELECT id FROM Comments WHERE id=%s))'
    @staticmethod
    def insertIntoQuestionCode_Comments():
        return 'INSERT INTO QuestionCode_Comments(roadmapID, commentsID) VALUES((SELECT id FROM QuestionCode WHERE id=%s), (SELECT id FROM Comments WHERE id=%s))'
    @staticmethod
    def getCommentID():
        return 'SELECT id FROM Comments WHERE Comments.imageSource=%s AND Comments.username=%s AND Comments.comment=%s'
    @staticmethod
    def getQuestionRating():
        return 'SELECT totalRating, numRating FROM QuestionCode WHERE id=%s'
    @staticmethod
    def getRoadmapRating():
        return 'SELECT totalRating, numRating FROM RoadMap WHERE id=%s'
    @staticmethod
    def updateQuestionRating():
        return 'UPDATE QuestionCode SET totalRating=%s numRating=%s WHERE id=%s'
    @staticmethod
    def updateRoadmapRating():
        return 'UPDATE RoadMap SET totalRating=%s numRating=%s WHERE id=%s'
    @staticmethod
    def getQuestionTags():
        return 'SELECT tag FROM QuestionCode_Tag WHERE questionID=%s'
    @staticmethod
    def insertQuestionTag():
        return 'INSERT INTO QuestionCode_Tag(questionID, tag) VALUES((SELECT id FROM QuestionCode WHERE id=%s), %s)'
    @staticmethod
    def getUserProfile():
        return 'SELECT * FROM UserProfile WHERE username=%s'
    @staticmethod
    def updateUserProfilecommentCount():
        return 'UPDATE UserProfile SET commentCount=%s WHERE id=%s'
    @staticmethod
    def updateUserProfileuploadQuestionCount():
        return 'UPDATE UserProfile SET uploadQuestionCount=%s WHERE id=%s'
    @staticmethod
    def updateUserProfileuploadTestCaseCount():
        return 'UPDATE UserProfile SET uploadTestCaseCount=%s WHERE id=%s'
    @staticmethod
    def updateUserProfilecorrectQuestionCount():
        return 'UPDATE UserProfile SET correctQuestionCount=%s WHERE id=%s'
    @staticmethod
    def updateUserProfileuseremail():
        return 'UPDATE UserProfile SET useremail=%s WHERE id=%s'
    @staticmethod
    def updateUserProfilepassword():
        return 'UPDATE UserProfile SET password=%s WHERE id=%s'
    @staticmethod
    def insertTestcases():
        return 'INSERT INTO QuestionCode_Testcases(questionID, testcase) VALUES((SELECT id FROM QuestionCode WHERE id=%s), %s)'
    @staticmethod
    def getAllRoadmap():
        return 'SELECT * FROM RoadMap'
    @staticmethod
    def updateRoadmapUpvote():
        return 'UPDATE RoadMap SET upvoteNum=%s WHERE id=%s'
    @staticmethod
    def updateRoadmapDownvote():
        return 'UPDATE RoadMap SET downvoteNum=%s WHERE id=%s'
    @staticmethod
    def insertUserProfile_RoadMap():
        return 'INSERT INTO UserProfile_RoadMap(userID, roadmapID) VALUES((SELECT id FROM UserProfile WHERE id=%s), (SELECT id FROM RoadMap WHERE id=%s))'
    @staticmethod
    def deleteUserProfile_RoadMap():
        return 'DELETE FROM UserProfile_RoadMap WHERE userID=%s AND roadmapsID=%s'
    @staticmethod
    def getAllUserProfile_RoadMap():
        return 'SELECT * FROM UserProfile_RoadMap WHERE userID=%s'
    @staticmethod
    def insertRoadMap():
        return 'INSERT INTO RoadMap(description, graphData, title, userID, upvoteNum, downvoteNum, totalRating, numRating) VALUES(%s,%s,%s,(SELECT id FROM UserProfile WHERE username=%s),%s,%s,%s,%s)'
    @staticmethod
    def getRoadMapID():
        return 'SELECT id FROM RoadMap WHERE description=%s AND graphData=%s AND title=%s'

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
                                       (obj['question_theme'], obj['question'], obj['answer'], 0, 0, 'default'))
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
    conn = get_conn()
    cursor = conn.cursor()
    if is_for_road_map == 1:
        # meaning for roadmap
        cursor.execute(Queries.getAllRoadmapTopLevelComments(), (question_id))
        first_level = cursor.fetchall()
        temp = {}
        for first_id in first_level:
            cursor.execute(Queries.getAllRoadmapSecondLevelComments(), (question_id, first_id))
            temp['id'] = cursor.fetchall()
        cursor.close()
        return jsonify(temp)
    else:
        cursor.execute(Queries.getAllQuestionTopComments(), (question_id))
        first_level = cursor.fetchall()
        temp = {}
        for first_id in first_level:
            cursor.execute(Queries.getAllQuestionSecondLevelComments(), (question_id, first_id))
            temp['id'] = cursor.fetchall()
        cursor.close()
        return jsonify(temp)

@app.route('/post_comments_url', methods=['POST'])
def postComments():
    data = request.get_json()
    is_for_road_map = data['is_for_road_map']
    username = data['username']
    question_id = data['question_id']
    parent_comment_id = data['parent_comment_id']
    content = data['content']

    conn = get_conn()
    cursor = conn.cursor()

    if is_for_road_map == 1:
        # insert into roadmap
        cursor.execute(Queries.insertIntoComments(), ('default', username, content, 0, 0))
        cursor.execute(Queries.getCommentID(), ('default', username, content))
        comment_id = cursor.fetchone()
        cursor.execute(Queries.insertIntoRoadMap_Comments(), (question_id, comment_id))
        if parent_comment_id == -1:
            cursor.execute(Queries.insertIntoSubComments(), (parent_comment_id, comment_id))
    else:
        cursor.execute(Queries.insertIntoComments(), ('default', username, content, 0, 0))
        cursor.execute(Queries.getCommentID(), ('default', username, content))
        comment_id = cursor.fetchone()
        cursor.execute(Queries.insertIntoQuestionCode_Comments(), (question_id, comment_id))
        if parent_comment_id == -1:
            cursor.execute(Queries.insertIntoSubComments(), (parent_comment_id, comment_id))
    conn.commit()
    cursor.close()
    return jsonify('Success')

@app.route('/get_rating', methods=['GET'])
def getRating():
    question_id = request.args.get('question_id')
    is_for_road_map = request.args.get('is_for_road_map')
    conn = get_conn()
    cursor = conn.cursor()
    if is_for_road_map == 1:
        cursor.execute(Queries.getRoadmapRating(), (question_id))
    else:
        cursor.execute(Queries.getQuestionRating(), (question_id))
    result = cursor.fetchone()
    cursor.close()
    if (result['totalRating'] == 0) :
        return jsonify(0)
    return jsonify(result['totalRating']/result['numRating'])

@app.route('/post_rating', methods=['POST'])
def postRating():
    data = request.get_json()
    is_for_road_map = data['is_for_road_map']
    question_id = data['question_id']
    conn = get_conn()
    cursor = conn.cursor()
    if is_for_road_map == 1:
        cursor.execute(Queries.getQuestionRating(), (question_id))
        result = cursor.fetchone()
        cursor.execute(Queries.updateQuestionRating(), (result['totalRating'], result['numRating'], question_id))
    else:
        cursor.execute(Queries.getRoadmapRating(), (question_id))
        result = cursor.fetchone()
        cursor.execute(Queries.updateRoadmapRating(), (result['totalRating'], result['numRating'], question_id))
    cursor.close()
    return jsonify(0)

@app.route('/post_tag', methods=['POST'])
def postTag():
    data = request.get_json()
    tag = data['tag']
    question_id = data['question_id']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.insertQuestionTag(), question_id, tag)
    conn.commit()
    cursor.close()
    return jsonify(0)

@app.route('/get_tag', methods=['GET'])
def getTag():
    question_id = request.args.get('question_id')
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.getQuestionTags(), question_id)
    result = cursor.fetchall()
    conn.commit()
    cursor.close()
    return jsonify(result)

@app.route('/post_question', methods=['POST'])
def postQuestion():
    data = request.get_json()
    username = data['username']
    title = data['title']
    content = data['content']

    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute(Queries.getUserProfile(), (username))
    result = cursor.fetchone()
    cursor.execute(Queries.updateUserProfileuploadQuestionCount(), (result['uploadQuestionCount']+1, result['id']))
    cursor.execute(Queries.insertIntoQuestionCode(), (title, content, 'default', 0, 0, username))
    conn.commit()
    cursor.close()
    return jsonify('Success')

@app.route('/post_testcase', methods=['POST'])
def postTestcase():
    data = request.get_json()
    username = data['username']
    question_id = data['question_id']
    content = data['content']

    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute(Queries.getUserProfile(), (username))
    result = cursor.fetchone()
    cursor.execute(Queries.updateUserProfileuploadTestCaseCount(), (result['uploadTestCaseCount'] + 1, result['id']))
    cursor.execute(Queries.insertTestcases(), (question_id, content))
    conn.commit()
    cursor.close()
    return jsonify('Success')

@app.route('/all_roadmap', methods=['GET'])
def getAllRoadmaps():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.getAllRoadmap())
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

@app.route('/upvote_roadmap', methods=['POST'])
def updateRoadmapUpvote():
    data = request.get_json()
    roadmap_id = data['roadmap_id']
    value = data['value']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.updateRoadmapUpvote(), (value, roadmap_id))
    conn.commit()
    cursor.close()
    return jsonify(0)

@app.route('/downvote_roadmap', methods=['POST'])
def updateRoadmapUpvote():
    data = request.get_json()
    roadmap_id = data['roadmap_id']
    value = data['value']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.updateRoadmapDownvote(), (value, roadmap_id))
    conn.commit()
    cursor.close()
    return jsonify(0)

@app.route('/add_to_fav_roadmap', methods=['POST'])
def addFavRoadmap():
    data = request.get_json()
    user_id = data['user_id']
    roadmap_id = data['roadmap_id']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.insertUserProfile_RoadMap(), (user_id, roadmap_id))
    conn.commit()
    cursor.close()
    return jsonify(0)

@app.route('/save_user_roadmap', methods=['POST'])
def saveRoadMap():
    data = request.get_json()
    title = data['title']
    description = data['description']
    author = data['author']
    graphData = data['graphData']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.insertRoadMap(), (description, graphData, title, author, 0, 0, 0, 0))
    cursor.execute(Queries.getUserProfile(), author)
    user_id = cursor.fetchone()['id']
    cursor.execute(Queries.getRoadMapID(), (description, graphData, title))
    roadmap_id = cursor.fetchone()['id']
    cursor.execute(Queries.insertUserProfile_RoadMap(), (user_id, roadmap_id))
    conn.commit()
    cursor.close()
    return jsonify('Success')

@app.route('/get_user_roadmap', methods=['POST'])
def getAllUserFavs():
    user_id = request.args.get('user_id')
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.getAllUserProfile_RoadMap(), (user_id))
    result = cursor.fetchall()
    conn.commit()
    cursor.close()
    return jsonify(result)

@app.route('/delete_user_roadmap', methods=['POST'])
def deleteUserFav():
    data = request.get_json()
    user_id = data['user_id']
    roadmap_id = data['roadmap_id']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.deleteUserProfile_RoadMap(), (user_id, roadmap_id))
    conn.commit()
    cursor.close()
    return jsonify(0)

if __name__ == '__main__':
    app.run()
