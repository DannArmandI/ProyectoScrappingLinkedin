#!/usr/bin/env python
#_*_ coding: utf8 -*-
import os
from distutils.log import error
import random
from sys import flags
import traceback
from time import sleep

from selenium import webdriver
# from selenium.webdriver.chrome.options import Options


from selenium.webdriver.edge.options import Options
from selenium.webdriver.edge.service import Service

# from msedge.selenium_tools import Edge, EdgeOptions

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import TimeoutException
import string
from datetime import datetime
from dateutil.relativedelta import relativedelta
from utils import CaptchaException, commitQuery, getDescargas, rollbackQuery, runExtraction 
# from utils import scroll40Posts as scrollCargar40Posts, 
from utils import getUserInfo, connectMySql, wait, updateExtraction, deleteInfoCompany, getDescargas, getAccountsCompany, setLogDescarga, endDescarga


# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.chrome.options import Options
    
def main():
    
    mycursor, mydb = connectMySql()

    #se solicitan las cuentas
    

    #Se solicitan extracciones
    descargas = getDescargas(mycursor, mydb)


    print("Extracciones encontradas: ", descargas)

    # print("Total encontradas: ", len(descargas))


    #Se recorren extracciones
    i_extraction = 1 #índice descarga
    flag = True

    for descarga in descargas:
    
        # Obtine las
        accounts = getAccountsCompany(mycursor, mydb, descarga[0])
        # print(descargas)

        if(len(accounts)==0):
            setLogDescarga(mycursor, mydb, "no se han encontrado cuentas de linkedin para realizar extracción", descarga[0]);
            print("no se han encontrado cuentas de linkedin para realizar extracción")
        else:
            flag = True
            random.shuffle(accounts)
            while flag:

                

                for account in accounts:
                    #se toma una cuenta para hacer la extracción
                    user = account[1]
                    password = account[2]
                    try:
                        #Config driver original
                        # opts = Options()
                        # opts.add_argument("user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/71.0.3578.80 Chrome/71.0.3578.80 Safari/537.36")
                        
                        # driver = webdriver.Chrome('./chromedriver', chrome_options=opts)
                        
                        #para docker anterior
                        # opts.headless = True
                        # opts.add_argument("start-maximized");
                        # opts.add_argument("enable-automation");
                        # opts.add_argument("--no-sandbox"); 
                        # opts.add_argument("--disable-infobars");
                        # opts.add_argument("--disable-browser-side-navigation");
                        # opts.add_argument("--disable-gpu");

                        # capabilities = webdriver.DesiredCapabilities.CHROME.copy()
                        is_docker = os.environ.get('ISDOCKER')

                        driver = None

                        if is_docker:
                            print("Detectado docker")
                            options = Options()
                            options.add_experimental_option('excludeSwitches', ['enable-logging'])
                            options.add_argument("--remote-debugging-port=9225")
                            driver = webdriver.Remote(
                                command_executor='http://selenium:4444',
                                options=options
                            )
                        else:
                            print("Docker no detectado")
                            service = Service(executable_path=r"msedgedriver.exe")
                            options = Options()
                            options.add_experimental_option('excludeSwitches', ['enable-logging'])
                            driver = webdriver.Edge(service=service, options=options)

                        # name_company = descarga[1]
                        # admin = descarga[3]
                        # number_company = descarga[5]
                        
                        print("Comenzando descarga de compañia ", descarga[7],"...")
                        setLogDescarga(mycursor, mydb, "iniciando proceso, intentando iniciar sesión", descarga[0])
                        #se asigna la url donde están las publicaciones de la compañía
                        # if(admin == True):
                        #     url_posts = 'https://www.linkedin.com/company/'+ name_company +'/posts/?feedView=all&viewAsMember=true'
                        # else:
                        url_posts = descarga[8]         
                        
                        driver.get('https://www.linkedin.com/')
                        sleep(3)
                        # print(driver.page_source)

                        #se inicia sesión
                        print("Iniciando sesión")
                        print("correo electronico:{}".format(account))
                        
                        print("Buscando session_key")
                        input_user = WebDriverWait(driver, 30).until(
                            EC.presence_of_element_located((By.XPATH, '//main//input[@id="session_key"]'))
                        )

                        input_user.send_keys(user)

                        print("Buscando session_password")
                        input_password = driver.find_element(By.XPATH , '//main//input[@id="session_password"]')
                        input_password.send_keys(password)

                        print("Buscando form button")
                        boton_login = driver.find_element(By.XPATH, '//div[@class="sign-in-form-container"]/form/button')
                        
                        boton_login.click()
                    

                        sleep(10)

                        print("url actual: "+driver.current_url)
                        if('https://www.linkedin.com/checkpoint/' in driver.current_url or 'https://www.linkedin.com/authwall?' in driver.current_url or 'https://www.linkedin.com/uas/login-submit' in driver.current_url):
                            setLogDescarga(mycursor, mydb, "validación encontrada, cambiando de cuenta...", descarga[0]);
                            raise CaptchaException(driver.current_url,"Captcha Encontrado")
                        
                        else:
                            print("Logeado con éxito, iniciando extracción")
                            setLogDescarga(mycursor, mydb, "logeado con exito", descarga[0]);
                            #se comienza la extracción
                            # runExtraction(driver,name_company, number_company, admin, url_posts, mycursor, mydb )

                            setLogDescarga(mycursor, mydb, "comenzando descarga", descarga[0]);

                            # descarga[0] = > id_descarga
                            runExtraction(driver, url_posts, descarga[0],{"fecha_desde": descarga[1], "fecha_hasta": descarga[2]}, mycursor, mydb )
                            print("Extracción terminada con éxito.")
                            # ejecutando commit
                            commitQuery(mydb)
                            setLogDescarga(mycursor, mydb, "descarga completada, ejecutando commit", descarga[0]);
                            # Actualiza la fecha de la ultima extraccion
                            updateExtraction(mycursor, mydb, descarga[6], descarga[1], descarga[2])

                            driver.close()
                            driver.quit()
                            
                            # random.shuffle(accounts) #se desordena lista de cuentas
                            print("llega aca 1")
                            # sale del ciclo for
                            # print("sale del ciclo while")

                            setLogDescarga(mycursor, mydb, "commit finalizado", descarga[0]);

                            # cambiando estado descarga
                            print("cambiando estado descarga")
                            setLogDescarga(mycursor, mydb, "cambiando estado descarga, finalizada", descarga[0]);
                            endDescarga(mycursor, mydb, descarga[0])
                            flag = False
                            break
                    except TimeoutException:
                        if driver is not None:
                            driver.close()
                            driver.quit()
                            driver = None
                        print("tiempo de espera superado, cambiando de cuenta.")
                        setLogDescarga(mycursor, mydb, "tiempo de espera superado, no se ha logrado iniciar sesión.", descarga[0]);
                        print("sleep 500...")
                        sleep(10)
                        continue
                    except KeyboardInterrupt:
                        if driver is not None:
                            driver.close()
                            driver.quit()
                            driver = None
                        print("\nProceso Interrumpido. \nCerrando app")
                        setLogDescarga(mycursor, mydb, "se ha interrumpido el proceso", descarga[0]);
                        rollbackQuery(mydb)
                        exit()
                    except CaptchaException as e:
                        if driver is not None:
                            driver.close()
                            driver.quit()
                            driver = None
                        print(e)
                        print("cambiando de cuenta.")
                        print("sleep 500...")
                        sleep(10)
                        continue
                    except Exception as e:
                        if driver is not None:
                            driver.close()
                            driver.quit()
                            driver = None
                        print("error: ")
                        print(e)
                        print("traza: ")
                        traceback.print_exc()
                        # deleteInfoCompany(mycursor,mydb,name_company,admin)
                        rollbackQuery(mydb)
                        print("Ha ocurrido un error, cambiando de cuenta.")
                        setLogDescarga(mycursor, mydb, "ha ocurrido un error durante la extraccion, cambiando de cuenta: {}".format(e), descarga[0]);
                        print("sleep 500...")
                        sleep(10)
                        continue
                
        if(i_extraction<len(descargas)):
            if(len(descargas) - i_extraction ==0):
                print("Extracciones Completadas!")
                exit()
            try:
                wait(random.randrange(3600, 7100)) #se espera 1 a 2 horas app (varía en minutos) para comenzar la siguiente extracción
            except KeyboardInterrupt:
                print("\nProceso Interrumpido. \nCerrando app...")
                exit()

if __name__ == '__main__':
    print("Iniciando...")
    while(True):
        main()
        wait(random.randrange(86400, 86500))
    

