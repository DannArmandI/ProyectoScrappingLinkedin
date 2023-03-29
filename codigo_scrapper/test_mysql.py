import mysql.connector


def main():
    mydb = mysql.connector.connect(
        host="db",
        user="worker",
        password="elpandaescuchaqueen",
        database="demoLinkedinScrapper3"
    )

    mycursor = mydb.cursor()
    
    query = "SELECT table_name FROM information_schema.tables;"

    mycursor.execute(query)
    
    myresult = mycursor.fetchall()
    
    print(myresult)
    
    mycursor.close()
    mydb.close()


if __name__ == '__main__':
    main()
