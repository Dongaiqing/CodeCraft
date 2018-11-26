import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb
import json
import re
import argparse
import base64


def main(args):
    fname = args.data_file_path
    db_user = args.db_user
    db_pass = args.db_pass
    is_py_2 = args.is_py_2

    try:
        db = MySQLdb.connect("localhost", db_user, db_pass, "CodeCraft", charset='utf8')
        cursor = db.cursor()

        try:
            sql = "ALTER TABLE question_code MODIFY COLUMN SOURCE_CODE LONGTEXT;"
            cursor.execute(sql)
            sql = "ALTER TABLE question_data MODIFY COLUMN ARTICLE LONGTEXT;"
            cursor.execute(sql)
            sql = "ALTER TABLE question_data MODIFY COLUMN ANSWER LONGTEXT;"
            cursor.execute(sql)
            db.commit()
        except (MySQLdb.Error, MySQLdb.Warning) as e:
            # Rollback in case there is any error
            print("Cannot execute SQL queries, error: " + str(e))
            db.rollback()

    except (MySQLdb.Error, MySQLdb.Warning) as e:
        print("Cannot connect to database, error: " + str(e))
        return
    
    with open(fname) as f:
        data = json.load(f)

    i = 1
    for question in data:
        print("Processing question {}...".format(i))
        i += 1

        try:
            if is_py_2:
                theme = str(question['question_theme'].encode('utf-8'))
                q = str(question['question'].encode('utf-8'))
                code = str(question['answer'].encode('utf-8'))

                code_encoded = base64.b64encode(code).decode('utf-8')
                question_encoded = base64.b64encode(q).decode('utf-8')

            else:
                theme = str(question['question_theme'])
                q = str(question['question'])
                code = str(question['answer'])

                code_encoded = base64.b64encode(code.encode()).decode('utf-8')
                question_encoded = base64.b64encode(q.encode()).decode('utf-8')

        except KeyError:
            continue
        
        sql = "INSERT INTO question_data(answer, article, title) \
                        VALUES (\"{}\", \"{}\", \"{}\");".format(code_encoded,
                                                                 question_encoded,
                                                                 get_title_from_theme(theme))
        try:
            cursor.execute(sql)
            db.commit()
        except (MySQLdb.Error, MySQLdb.Warning) as e:
            # Rollback in case there is any error
            print("Cannot execute SQL queries, error: " + str(e))
            db.rollback()
            continue

    cursor.close()
    print('Done!')


def get_title_from_theme(theme):
    return re.sub("([a-z])([A-Z])", "\g<1> \g<2>", theme).title()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('-f', dest='data_file_path', type=str, default="raw_output.json",
                        help='the directory of the json data')
    parser.add_argument('-u', dest='db_user', type=str, default="root",
                        help='the user name of the database, default is root')
    parser.add_argument('-p', dest='db_pass', type=str, default="", 
                        help='the password of the database, default is empty')
    parser.add_argument('-python2', dest='is_py_2', action='store_true', default="False")
    parser.set_defaults(is_py_2=False)

    args = parser.parse_args()
    main(args)