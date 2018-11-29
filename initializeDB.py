import pymysql, sys, json

if len(sys.argv) != 3:
    print(str(sys.argv) + ': Not enough args!')
    sys.exit(1)
conn = pymysql.connect(user=sys.argv[1], passwd=sys.argv[2], host='localhost')
cursor = conn.cursor()
cursor.execute('DROP DATABASE IF EXISTS CodeCraft')
cursor.execute('CREATE DATABASE CodeCraft')
cursor.execute('USE CodeCraft;')
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
            cursor.execute('INSERT INTO QuestionCode(title, article, answer, totalRating, numRating, author) VALUES (%s,%s,%s,%s,%s,%s);',
                           (obj['question_theme'], obj['question'], obj['answer'], 0, 0, 'default'))
        except KeyError:
            print(obj)
conn.commit()
cursor.close()
conn.close()