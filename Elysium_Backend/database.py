import MySQLdb
import sys
try:
    conn = MySQLdb.connect(host="127.0.0.1", user="root", passwd="blahblah")
    print("Connection established")
except MySQLdb.Error as e:
    print(f"Connection Error: {e}")
    sys.exit(1)

cursor = conn.cursor()
try:
    cursor.execute("CREATE DATABASE elysium_db")
    print("Database created")
except MySQLdb.Error as e:
    print(f"Failed creating database: {e}")
finally:
    cursor.close()

try:
    conn.select_db('mydatabase')  # Switch to the new database
except MySQLdb.Error as e:
    print(f"Failed to switch database: {e}")
conn.close()