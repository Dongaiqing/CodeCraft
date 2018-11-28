import pymysql, sys

if len(sys.argv) != 3:
    print(str(sys.argv) + ': Not enough args!')
    sys.exit(1)
conn = pymysql.connect(user=sys.argv[1], passwd=sys.argv[2], host='localhost')
cursor = conn.cursor()
cursor.execute('DROP DATABASE IF EXISTS CodeCraft')
cursor.execute('CREATE DATABASE CodeCraft')
conn.commit()
cursor.close()
conn.close()