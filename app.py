from flask import Flask, g, request, jsonify, url_for, redirect
from flaskext.mysql import MySQL
import os
import json
import re
from pyModules.Queries import Queries
from pyModules.recommendation import Recommendation
from pyModules.executeCode import exeucteCode
from pyModules.generatePics import generatePics

app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '123456'
app.config['MYSQL_DATABASE_DB'] = 'CodeCraft'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


@app.route('/')
def index():
    get_conn()
    return app.send_static_file('index.html')


@app.route('/js/<filename>')
def index_js(filename):
    return app.send_static_file('js/' + filename + '.js')

@app.route('/img/<filename>')
def get_img(filename):
    return app.send_static_file('img/' + filename + 'png')


def get_conn():
    conn = getattr(g, '_database', None)
    if conn is None:
        conn = g._database = mysql.connect()
        cursor = conn.cursor()
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
@app.route('/profile')
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

    if result is not None:
        cursor.execute('SELECT * FROM UserProfile_Preferences WHERE userID=(SELECT id FROM UserProfile WHERE username=%s)', (data['username']))
        result = cursor.fetchone()
        cursor.close()
        if result is None:
            return jsonify({'msg': 0, 'preference': {'font_name': 'default', 'theme_name': 'default'}})
        return jsonify({'msg': 0, 'preference': {'font_name': result[2], 'theme_name': result[3]}})
    cursor.close()
    return jsonify({'msg': 1})


@app.route('/registration', methods=['POST'])
def registration():
    data = request.get_json()
    if 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify(1)
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.lookupLoginExists(), (data['username']))
    result = cursor.fetchone()
    path = generatePics.randomPic(data['username'])
    if result is None:
        cursor.execute(Queries.insertIntoRegister(), (data['username'], data['email'], data['password'], path, 0, 0, 0, 0, 0, 0))
        conn.commit()
        cursor.close()
        return jsonify({'msg': 0, 'preference': {'font_name': 'default', 'theme_name': 'default'}})
    cursor.close()
    return jsonify({'msg': 1})


@app.route('/post_code_test', methods=['POST'])
def receiveResponse():
    data = request.get_json()
    print(data)
    if 'username' not in data or 'question_id' not in data or 'source_code' not in data or 'language' not in data:
        failed = {}
        failed['header'] = 'Failed to submit your answer'
        failed['content'] = 'You have input invalid information'
        return jsonify(failed)
    language_pool = {
        'ruby': 'ruby',
        'javascript': 'node',
        'python': 'python3',
        'java': 'javac'
    }
    conn = get_conn()
    cursor = conn.cursor()
    username = data['username']
    source_code = data['source_code']
    language = data['language']
    question_id = data['question_id']

    executable = language_pool.get(data['language'], None)
    if executable is None:
        try:
            cursor.execute(Queries.storeQuestionAnswer(),
                           (source_code, language, username, question_id, 'default'))
        except Exception:
            cursor.execute((Queries.updateQuestionAnswer(), (source_code, 'default', language, username, question_id)))
        conn.commit()
        saved = {}
        saved['header'] = 'Success'
        saved['content'] = 'Your response has been saved!'
        print(saved)
        return jsonify(saved)
    else:
        def execute_code():
            temp_filename = 'temp' + username + str(question_id)
            if executable == 'ruby':
                complete_filename = temp_filename + '.rb'
                with open(complete_filename, 'w') as file:
                    file.write(source_code)
                result = exeucteCode.runcode(complete_filename, temp_filename, executable)
                os.remove(complete_filename)
                return result
            elif executable == 'python3':
                complete_filename = temp_filename + '.py'
                with open(complete_filename, 'w') as file:
                    file.write(source_code)
                result = exeucteCode.runcode(complete_filename, temp_filename, executable)
                os.remove(complete_filename)
                return result
            elif executable == 'node':
                complete_filename = temp_filename + '.js'
                with open(complete_filename, 'w') as file:
                    file.write(source_code)
                result = exeucteCode.runcode(complete_filename, temp_filename, executable)
                os.remove(complete_filename)
                return result
            elif executable == 'javac':
                temp_filename = re.search("(?:(?<=\n)|(?<=\A))(?:public\s)?(class|interface|enum)\s([^\n\s]*)",
                                          source_code).group(2)
                complete_filename = temp_filename + '.java'
                with open(complete_filename, 'w') as file:
                    file.write(source_code)
                result = exeucteCode.runcode(complete_filename,temp_filename,executable)
                os.remove(complete_filename)
                return result

        result = execute_code()
        try:
            cursor.execute(Queries.storeQuestionAnswer(),
                           (source_code, language, username, question_id, result))
        except Exception:
            cursor.execute((Queries.updateQuestionAnswer(), (source_code, result, language, username, question_id)))

        saved = {}
        saved['header'] = 'Success'
        saved['content'] = result

        # update submission count
        cursor.execute('SELECT correctQuestionCount FROM UserProfile WHERE username=%s', (username))
        current_count = cursor.fetchone()[0]
        cursor.execute('UPDATE UserProfile SET correctQuestionCount=%s WHERE username=%s', (current_count+1, username))
        cursor.execute('SELECT eBucks FROM UserProfile WHERE username=%s', (username))
        curr_bucks = cursor.fetchone()[0]
        cursor.execute('UPDATE UserProfile SET eBucks=%s WHERE username=%s', (curr_bucks + 1, username))
        conn.commit()
        return jsonify(saved)


@app.route('/get_code_test', methods=['GET'])
def sendCode():
    id = request.args.get('id')
    keywords = request.args.get('title')
    already_searched = request.args.get('already_searched')
    if id is None or keywords is None:
        return jsonify([])
    conn = get_conn()
    cursor = conn.cursor()
    if already_searched == '1':
        cursor.execute(Queries.getQuestion(), (keywords))
    else:
        cursor.execute(Queries.getQuestionFuzzy(), ('%' + keywords + '%', '%' + keywords + '%'))
    temp = [{'title': x[1], 'id': x[0], 'article': x[2]} for x in cursor.fetchall()]
    return jsonify(temp)


@app.route('/get_comments', methods=['GET'])
def getComments():
    is_for_road_map = request.args.get('is_for_road_map')
    question_id = request.args.get('question_id')
    if is_for_road_map is None or question_id is None:
        return redirect('/404')
    conn = get_conn()
    cursor = conn.cursor()
    if is_for_road_map == '1':
        # meaning for roadmap
        cursor.execute(Queries.getAllRoadmapTopLevelComments(), (question_id))
        first_level = [
            {'id': x[0], 'imageSource': x[1], 'user': x[2], 'comment': x[3], 'upvoteNum': x[4], 'downvoteNum': x[5]} for
            x in cursor.fetchall()]
        for item in first_level:
            if item['imageSource'] == 'default':
                cursor.execute('SELECT userPicSource FROM UserProfile WHERE username=%s', (item['user']))
                item['imageSource'] = cursor.fetchone()[0]
            first_id = item['id']
            cursor.execute(Queries.getAllRoadmapSecondLevelComments(), (question_id, first_id))
            second_level = [
                {'id': x[0], 'imageSource': x[1], 'user': x[2], 'comment': x[3], 'upvoteNum': x[4], 'downvoteNum': x[5]}
                for x in cursor.fetchall()]
            for temp_item in second_level:
                if temp_item['imageSource'] == 'default':
                    cursor.execute('SELECT userPicSource FROM UserProfile WHERE username=%s', (temp_item['user']))
                    temp_item['imageSource'] = cursor.fetchone()[0]
            item['secondaryComments'] = second_level
        cursor.close()
        return jsonify(first_level)
    else:
        cursor.execute(Queries.getAllQuestionTopComments(), (question_id))
        first_level = [
            {'id': x[0], 'imageSource': x[1], 'user': x[2], 'comment': x[3], 'upvoteNum': x[4], 'downvoteNum': x[5]} for
            x in cursor.fetchall()]
        for item in first_level:
            if item['imageSource'] == 'default':
                cursor.execute('SELECT userPicSource FROM UserProfile WHERE username=%s', (item['user']))
                item['imageSource'] = cursor.fetchone()[0]
            first_id = item['id']
            cursor.execute(Queries.getAllQuestionSecondLevelComments(), (question_id, first_id))
            second_level = [
                {'id': x[0], 'imageSource': x[1], 'user': x[2], 'comment': x[3], 'upvoteNum': x[4], 'downvoteNum': x[5]}
                for x in cursor.fetchall()]
            item['secondaryComments'] = second_level
            for temp_item in second_level:
                if temp_item['imageSource'] == 'default':
                    cursor.execute('SELECT userPicSource FROM UserProfile WHERE username=%s', (temp_item['user']))
                    temp_item['imageSource'] = cursor.fetchone()[0]
        cursor.close()
        print(first_level)
        return jsonify(first_level)


@app.route('/update_comments', methods=['POST'])
def upvoteComment():
    data = request.get_json()
    comment_id = data['comment_id']
    value = data['value']
    is_upvote = data['is_upvote']


    conn = get_conn()
    cursor = conn.cursor()

    if is_upvote == 1:
        # upvoting
        cursor.execute('UPDATE Comments SET upvoteNum=%s WHERE id=%s', (value, comment_id))
    else:
        cursor.execute('UPDATE Comments SET downvoteNum=%s WHERE id=%s', (value, comment_id))

    conn.commit()
    cursor.close()
    return jsonify(0)


@app.route('/post_comments', methods=['POST'])
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
        if parent_comment_id != -1:
            cursor.execute(Queries.insertIntoSubComments(), (parent_comment_id, comment_id))
    else:
        cursor.execute(Queries.insertIntoComments(), ('default', username, content, 0, 0))
        cursor.execute(Queries.getCommentID(), ('default', username, content))
        comment_id = cursor.fetchone()
        cursor.execute(Queries.insertIntoQuestionCode_Comments(), (question_id, comment_id))
        if parent_comment_id != -1:
            cursor.execute(Queries.insertIntoSubComments(), (parent_comment_id, comment_id))
    cursor.execute('SELECT commentCount FROM UserProfile WHERE username=%s', (username))
    curr_count = cursor.fetchone()[0]
    cursor.execute('UPDATE UserProfile SET commentCount=%s WHERE username=%s', (curr_count + 1, username))
    cursor.execute('SELECT eBucks FROM UserProfile WHERE username=%s', (username))
    curr_bucks = cursor.fetchone()[0]
    cursor.execute('UPDATE UserProfile SET eBucks=%s WHERE username=%s', (curr_bucks + 5, username))
    conn.commit()
    cursor.close()
    return jsonify(comment_id)


@app.route('/get_rating', methods=['GET'])
def getRating():
    question_id = request.args.get('question_id')
    is_for_road_map = request.args.get('is_for_road_map')
    conn = get_conn()
    cursor = conn.cursor()
    if is_for_road_map == '1':
        cursor.execute(Queries.getRoadmapRating(), (question_id))
    else:
        cursor.execute(Queries.getQuestionRating(), (question_id))
    result = cursor.fetchone()
    cursor.close()
    if result[0] == 0:
        return jsonify(0)
    print(result[0], result[1])
    return jsonify(result[0] / result[1])


@app.route('/post_rating', methods=['POST'])
def postRating():
    data = request.get_json()
    is_for_road_map = data['is_for_road_map']
    question_id = data['question_id']
    value = data['value']
    conn = get_conn()
    cursor = conn.cursor()
    if is_for_road_map == 0:
        cursor.execute(Queries.getQuestionRating(), (question_id))
        result = cursor.fetchone()
        cursor.execute(Queries.updateQuestionRating(), (result[0] + value, result[1] + 1, question_id))
    else:
        cursor.execute(Queries.getRoadmapRating(), (question_id))
        result = cursor.fetchone()
        cursor.execute(Queries.updateRoadmapRating(), (result[0] + value, result[1] + 1, question_id))
    conn.commit()
    cursor.close()
    return jsonify(0)


@app.route('/post_tag', methods=['POST'])
def postTag():
    data = request.get_json()
    print(data)
    tags = data['tags']
    question_id = data['question_id']

    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute('SELECT tag FROM QuestionCode_Tag WHERE questionID=%s', (question_id))
    result = [x[0] for x in cursor.fetchall()]
    for tag in tags:
        cursor.execute(Queries.insertQuestionTag(), (question_id, tag))
    conn.commit()
    cursor.close()
    result.extend(tags)
    return jsonify({'tags': result})


@app.route('/get_tag', methods=['GET'])
def getTag():
    question_id = request.args.get('question_id')
    conn = get_conn()
    cursor = conn.cursor()
    print(question_id)
    cursor.execute(Queries.getQuestionTags(), (question_id))
    result = [x[0] for x in cursor.fetchall()]
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
    cursor.execute(Queries.updateUserProfileuploadQuestionCount(), (result[7] + 1, result[0]))
    cursor.execute(Queries.insertIntoQuestionCode(), (title, content, 'default', 0, 0, username))

    cursor.execute('SELECT uploadQuestionCount FROM UserProfile WHERE username=%s', (username))
    curr_count = cursor.fetchone()[0]
    cursor.execute('UPDATE UserProfile SET uploadQuestionCount=%s WHERE username=%s', (curr_count+1, username))
    cursor.execute('SELECT eBucks FROM UserProfile WHERE username=%s', (username))
    curr_bucks = cursor.fetchone()[0]
    cursor.execute('UPDATE UserProfile SET eBucks=%s WHERE username=%s', (curr_bucks + 10, username))
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
    cursor.execute(Queries.updateUserProfileuploadTestCaseCount(), (result[8] + 1, result[0]))
    cursor.execute(Queries.insertTestcases(), (question_id, content))
    conn.commit()
    cursor.close()
    return jsonify('Success')


@app.route('/all_roadmap', methods=['GET'])
def getAllRoadmaps():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.getAllRoadmap())
    result = []
    for x in cursor.fetchall():
        cursor.execute('SELECT username FROM UserProfile WHERE id=%s', (x[4]))
        username = cursor.fetchone()
        cursor.execute(Queries.getAllRoadmapTopLevelComments(), (x[0]))
        first_level = [
            {'id': y[0], 'imageSource': y[1], 'user': y[2], 'comment': y[3], 'upvoteNum': y[4], 'downvoteNum': y[5]} for
            y in cursor.fetchall()]
        for item in first_level:
            first_id = item['id']
            cursor.execute(Queries.getAllRoadmapSecondLevelComments(), (x[0], first_id))
            second_level = [
                {'id': y[0], 'imageSource': y[1], 'user': y[2], 'comment': y[3], 'upvoteNum': y[4], 'downvoteNum': y[5]}
                for y in cursor.fetchall()]
            item['secondaryComments'] = second_level

        result.append({'id': x[0], 'description': x[1], 'graphData': json.loads(x[2]), 'name': x[3], 'author': username,
                       'upvoteNum': x[5], 'downvoteNum': x[6], 'comments': first_level})

    cursor.close()
    return jsonify(result)


@app.route('/upvote_roadmap', methods=['POST'])
def upvoteRoadmap():
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
def downvoteRoadmap():
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
    username = data['username']
    roadmap_id = data['roadmap_id']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.insertUserProfile_RoadMap(), (username, roadmap_id))
    conn.commit()
    cursor.close()
    return jsonify(0)


@app.route('/save_user_roadmap', methods=['POST'])
def saveRoadMap():
    data = request.get_json()
    title = data['title']
    description = data['description']
    author = data['author']
    graphData = json.dumps(data['graphData'])
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.insertRoadMap(), (description, graphData, title, author, 0, 0, 0, 0))
    # cursor.execute(Queries.getUserProfile(), author)
    # user_id = cursor.fetchone()
    cursor.execute(Queries.getRoadMapID(), (description, graphData, title))
    roadmap_id = cursor.fetchone()[0]
    cursor.execute(Queries.insertUserProfile_RoadMap(), (author, roadmap_id))
    conn.commit()
    cursor.close()
    return jsonify('Success')


@app.route('/get_user_roadmap', methods=['GET'])
def getAllUserFavs():
    username = request.args.get('username')
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.getAllUserProfile_RoadMap(), (username))
    result = []
    for k in cursor.fetchall():
        cursor.execute('SELECT * FROM RoadMap WHERE id=%s', (k[2]))
        x = cursor.fetchone()
        cursor.execute('SELECT username FROM UserProfile WHERE id=%s', (x[4]))
        username = cursor.fetchone()
        cursor.execute(Queries.getAllRoadmapTopLevelComments(), (x[0]))
        first_level = [
            {'id': y[0], 'imageSource': y[1], 'user': y[2], 'comment': y[3], 'upvoteNum': y[4], 'downvoteNum': y[5]} for
            y in cursor.fetchall()]
        for item in first_level:
            first_id = item['id']
            cursor.execute(Queries.getAllRoadmapSecondLevelComments(), (x[0], first_id))
            second_level = [
                {'id': y[0], 'imageSource': y[1], 'user': y[2], 'comment': y[3], 'upvoteNum': y[4], 'downvoteNum': y[5]}
                for y in cursor.fetchall()]
            item['secondaryComments'] = second_level

        result.append({'id': x[0], 'description': x[1], 'graphData': json.loads(x[2]), 'name': x[3], 'author': username,
                       'upvoteNum': x[5], 'downvoteNum': x[6], 'comments': first_level})

    conn.commit()
    cursor.close()
    return jsonify(result)


@app.route('/delete_user_roadmap', methods=['POST'])
def deleteUserFav():
    data = request.get_json()
    username = data['username']
    roadmap_id = data['roadmap_id']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.deleteUserProfile_RoadMap(), (username, roadmap_id))
    conn.commit()
    cursor.close()
    return jsonify(0)


@app.route('/get_user_profile', methods=['GET'])
def getUserprofile():
    username = request.args.get('username')
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.getUserProfile(), (username))
    temp = cursor.fetchone()
    cursor.execute('SELECT friendName FROM UserProfile_Friends WHERE userID=%s', (temp[0]))
    friends = [x[0] for x in cursor.fetchall()]
    cursor.execute('SELECT itemStr FROM UserProfile_Items WHERE userID=(SELECT userID FROM UserProfile WHERE username=%s)', (username))
    items = [x[0] for x in cursor.fetchall()]
    new_level = (temp[5] * 1 + temp[6] * 5 + temp[7] * 10 + len(friends) * 5) // 100
    cursor.execute('UPDATE UserProfile SET userLevel=%s WHERE username=%s', (new_level, username))
    result = {
        'id': temp[0],
        'username': temp[1],
        'userEmail': temp[2],
        'userPicSource': temp[4],
        'correctQuestionCount': temp[5],
        'commentCount': temp[6],
        'uploadQuestionCount': temp[7],
        'uploadTestCaseCount': temp[8],
        'eBucks': temp[9],
        'level': new_level,
        'friends': friends,
        'items': items
    }
    cursor.close()
    print(result)
    return jsonify(result)


@app.route('/change_user_settings', methods=['POST'])
def changeUserSetting():
    data = request.get_json()
    password = data['password']
    email = data['email']
    user_id = data['user_id']
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(Queries.updateUserProfilepassword(), (password, user_id))
    cursor.execute(Queries.updateUserProfileuseremail(), (email, user_id))
    conn.commit()
    cursor.close()
    return jsonify(0)


@app.route('/update_balance_and_items', methods=['POST'])
def updateBalanceAndItems():
    data = request.get_json()
    username = data['username']
    new_items = data['new_items']
    new_balance = data['new_balance']
    conn = get_conn()
    cursor = conn.cursor()

    for new_item in new_items:
        cursor.execute(
            'INSERT INTO UserProfile_Items(userID, itemStr) VALUES((SELECT id FROM UserProfile WHERE username=%s), %s)',
            (username, new_item))
    cursor.execute('UPDATE UserProfile SET eBucks=%s WHERE username=%s', (new_balance, username))
    conn.commit()
    cursor.close()
    return jsonify('Success')


@app.route('/check_valid_question_id', methods=['POST'])
def checkValidQuestionID():
    data = request.get_json()
    question_id = data['question_id']

    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute('SELECT title FROM QuestionCode WHERE id=%s', (question_id))

    result = cursor.fetchone()[0]
    cursor.close()
    if result is None:
        return jsonify({'msg': 'Failed'})
    return jsonify({'msg': 'Success', 'name': result})

@app.route('/add_friend_by_search', methods=['POST'])
def addFriendBySearch():
    data = request.get_json()
    search_string = data['search_string']
    current_user = data['username']
    conn = get_conn()
    cursor = conn.cursor()
    obj = {}
    cursor.execute('SELECT * FROM UserProfile WHERE id=%s OR username=%s', (search_string, search_string))
    result = cursor.fetchone()
    if result is None:
        obj['msg'] = 'Failed'
        return jsonify(obj)
    else:
        obj['msg'] = 'Success'
        obj['userProfile'] = {
            'id': result[0],
            'username': result[1],
            'userEmail': result[2],
            'userPicSource': result[4],
            'correctQuestionCount': result[5],
            'commentCount': result[6],
            'uploadQuestionCount': result[7],
            'uploadTestCaseCount': result[8],
            'eBucks': result[9],
            'level': result[10],
            'items': result
        }
    # check if friends is here, if not then insert
    cursor.execute('SELECT * FROM UserProfile_Friends WHERE userID=(SELECT id FROM UserProfile WHERE username=%s) AND friendName=%s', (current_user, result[1]))
    result = cursor.fetchall()
    if result is None:
        cursor.execute('INSERT INTO UserProfile_Friends(userID, friendName) VALUES((SELECT id FROM UserProfile WHERE username=%s), (SELECT username FROM UserProfile WHERE id=%s))', (current_user, result[0]))
    else:
        obj['msg'] = 'Duplicate'
    conn.commit()
    cursor.close()
    return jsonify(obj)

@app.route('/change_font', methods=['POST'])
def change_font():
    data = request.get_json()
    username = data['username']
    new_font = data['new_font']

    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute('INSERT INTO UserProfile_Preferences(userID, fontName) VALUES((SELECT id FROM UserProfile WHERE username=%s), %s) ON DUPLICATE KEY UPDATE fontName=%s', (username, new_font, new_font))
    conn.commit()
    return jsonify(0)


@app.route('/change_theme', methods=['POST'])
def change_theme():
    data = request.get_json()
    username = data['username']
    new_theme = data['new_theme']
    conn = get_conn()
    cursor = conn.cursor()

    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute(
        'INSERT INTO UserProfile_Preferences(userID, themeName) VALUES((SELECT id FROM UserProfile WHERE username=%s), %s) ON DUPLICATE KEY UPDATE themeName=%s',
        (username, new_theme, new_theme))
    conn.commit()
    return jsonify(0)


if __name__ == '__main__':
    app.run('0.0.0.0', port=80)
