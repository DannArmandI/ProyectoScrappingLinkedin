#!/usr/bin/env python
#_*_ coding: utf8 -*-
import imp
import os
import time
import sys
import random
from time import sleep
from tkinter import Button
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
import string
from datetime import datetime
from dateutil.relativedelta import relativedelta
from sentiment_analysis_spanish import sentiment_analysis
import mysql.connector
import pyperclip as pc
from paises import getPaises
# from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys

PAUSE_TIME = random.uniform(5.2, 10.7)



#En caso de haber un error en la mitad de la extracción, borra la data que se ingresó hasta el momento.
def deleteInfoCompany(mycursor, mydb, name_company, admin):
    try:
        #--ELIMINAR COMENTARIOS DE UNA COMPAÑIA--
        query = "DELETE co FROM companies AS c JOIN posts AS p ON c.id_company = p.idCompany RIGHT JOIN comments AS co ON co.idPost = p.id_post WHERE c.name_company = '"+name_company+ "'"
        mycursor.execute(query)
        mydb.commit()
    except:
        print("no se borraron coments")
        ...
    #--ELIMINAR REACCIONES DE UNA COMPAÑIA--
    try:
        query = "DELETE r FROM companies AS c JOIN posts AS p ON c.id_company = p.idCompany RIGHT JOIN reactions AS r ON r.idPost = p.id_post WHERE c.name_company = '"+name_company+ "'"
        mycursor.execute(query)
        mydb.commit()
    except:
        ...
    #--ELIMINAR USUARIOS DE UNA COMPAÑIA--
    try:
        query = "DELETE u FROM users AS u WHERE name_company = '"+name_company+ "'"
        mycursor.execute(query)
        mydb.commit()
    except:
        ...
    #--ELIMINAR POSTS DE UNA COMPAÑIA--
    try:
        query = "DELETE p FROM companies AS c JOIN posts AS p ON c.id_company = p.idCompany WHERE c.name_company = '"+name_company+ "'"
        mycursor.execute(query)
        mydb.commit()
    except:
        ...
    #--ELIMINAR UNA COMPAÑIA--
    try:
        query = "DELETE c FROM companies AS c WHERE c.name_company = '"+name_company+ "'"
        mycursor.execute(query)
        mydb.commit()
    except:
        ...
    if(admin==1):
        try:
            query = "DELETE f FROM followers AS f WHERE f.name_company = '"+name_company+ "'"
            mycursor.execute(query)
            mydb.commit()
        except:
            ...


#se actualiza la fecha de la extracción
def updateExtraction(mycursor, mydb, id_company, fecha_desde, fecha_hasta):
    #se obtiene la fecha de la extracción actual
    now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')
    date = datetime.strptime(now, '%Y/%m/%d %H:%M:%S')

    dateStr = str(date)
    #Se actualiza extracción
    query = "UPDATE descarga SET Fecha_Act='{}' WHERE id_Company='{}' and Fecha_Des='{}' and Fecha_Has='{}';".format(dateStr, id_company, fecha_desde, fecha_hasta)
    mycursor.execute(query)
    mydb.commit()


def setLogDescarga(mycursor, mydb, mensaje, id_descarga):

    query = "INSERT INTO log_descarga(log_descarga.Fecha_Cre, log_descarga.Fecha_Act, log_descarga.Mensaje, log_descarga.id_descarga) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '{}', {});".format(mensaje, id_descarga)
    mycursor.execute(query)
    mydb.commit()

def endDescarga(mycursor, mydb, id_descarga):
    query = "UPDATE descarga set descarga.Estado=0 WHERE descarga.id_descarga='{}';".format(id_descarga)
    mycursor.execute(query)
    mydb.commit()


#se espera los segundos ingresados
def wait(seconds):
    print("wait siguiente extraccion")
    for remaining in range(seconds, 0, -1):
        sys.stdout.write("\r")
        sys.stdout.write("{:2d} Esperando para la siguiente extracción...".format(remaining))
        sys.stdout.flush()
        time.sleep(1)

    sys.stdout.write("\rComplete!                                           \n")

#conección a la base de datos
def connectMySql():
    is_docker = os.environ.get('ISDOCKER')
    if is_docker:
            print("conectando...........")
            mydb = mysql.connector.connect(
                host="db",
                port="3306",
                user="worker",
                password="elpandaescuchaqueen",
                database="demoLinkedinScrapper3"
            )
    else:
        print("conectando...........")
        mydb = mysql.connector.connect(
            # host="119.8.154.153",
            host = "localhost",
            # port="5901",
            # user="worker",
            user = "root",
            # password="elpandaescuchaqueen",
            password = "",
            database="demoLinkedinScrapper3"
        )
    mydb.autocommit = False
    mycursor = mydb.cursor()
    return (mycursor, mydb)

#función principal donde se realiza la extracción
def runExtraction(driver, url_posts, id_descarga, fechas, mycursor, mydb):
# def runExtraction(driver, number_company, admin, url_posts, mycursor, mydb):
        
        # espera hasta que la pagina cargue
        pageLoad(driver)
        

        print("llega aca")

        #se redirige a los posts de la pagina analizada
        driver.get(url_posts)
        sqlFollower= ("UPDATE descarga SET Running=1 "
        "WHERE id_Descarga=%(id_descarga)s")
        follower_values = {
            'id_descarga': id_descarga,
        }
        mycursor.execute(sqlFollower, follower_values)

        #inserta empresa a db
        
        #se obtiene la fecha de la extracción actual
        now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')
        date = datetime.strptime(now, '%Y/%m/%d %H:%M:%S')
        print(driver.current_url)
        #se obtiene el número de followers de la compañiac
        # elemento_followers = driver.find_element(By.XPATH,"//div[@class='org-top-card-summary-info-list t-14 t-black--light']")
        
        # sleep(5)
        # elemento_followers = WebDriverWait(driver).until(EC.visibility_of_element_located(By.XPATH("//div[@class='org-top-card-summary-info-list t-14 t-black--light']"))).text
        
        
        elemento_followers = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH,"//div[@class='org-top-card-summary-info-list t-14 t-black--light']//div[@class='inline-block']//div[last()]"))
        )
        
        
        # elemento_followers = driver.find_element(By.XPATH,'//*[@id="ember33"]/div[2]/div[1]/div[1]/div[2]/div/div/div[2]/div[2]')
        
        # separa el n° de seguidores de la cadena seguidores
        followersStr = (elemento_followers.text).split()
        followersStr = (followersStr[0])
        followersStr = followersStr.replace('.','')
        followers = int(followersStr)
        print("followers: {}".format(followers))

        #se obtiene nombre de la compañia
        # name_company_elemento = driver.find_element(By.XPATH,'//section[contains(@class, "org-top-card")]//h1')
        name_company_elemento = driver.find_element(By.XPATH,"//section[@class='org-top-card artdeco-card']//h1")
        name_company = str(name_company_elemento.get_attribute("title")).rstrip()

        print("nombre compañia: {}".format(name_company))

        #se verifica si ya está en la bd la compañia ingresada
        if (existsCompany(mycursor, id_descarga)):
            print("Existe compaia en base de datos")
            descriptionLastestPost = getDescriptionLatestPost(mycursor, name_company) #se obtiene la descripción del post publicado por la compañia
            descriptionLastestPost = ""
            id_company = getIdCompany(mycursor,id_descarga) #se obtiene el id de la compañia

            updateCompany(mydb,mycursor, id_company, id_descarga, followers)
        else:
            descriptionLastestPost = ''
            print("compañia no encontrada en base de datos")
            try:
                print("guardando compañia en base de datos")
                insertCompany(mydb,mycursor,name_company, followers, date)
                id_company = mycursor.lastrowid
                print("id company {}".format(id_company))
            except:
                print("no se pudo guardar la base de datos")

        

        #se extrae información de los seguidores de la compañía, si es que se extrae desde una cuenta con permisos necesarios
        # if(admin == True):
        #     try:
        #         getFollowers(driver, number_company, id_company, mycursor, mydb)
        #     except:
        #         print("Esta cuenta no es admin")
        
        

        # driver.get(url_posts)
        sortPostByDates(driver)
        scrollByDates(driver, fechas)

        #se obtienen los elementos clickeables para ver cada reaccion de los posts
        print("obteniendo lista reacciones post")
        elementos_reaccion = driver.find_elements(By.XPATH, '//div[contains(@class, "occludable-update ember-view")]/div[contains(@data-urn, "urn:li:activity")]/div[1]//ul/li/button[contains(@aria-label, "reac")]')
        
        #se obtienen elementos de fechas y posts(descripción e información de comentarios)
        print("obteniendo lista cajas posts")
        elementos_descripcion_comentarios = driver.find_elements(By.XPATH, '//div[contains(@class, "occludable-update ember-view")]')


        print("obteniendo lista fechas posts")
        # elementos_fechas = driver.find_elements(By.XPATH, '//div[contains(@data-urn, "urn:li:activity")][1]/div/div[1]/a/div[contains(@class,"actor__meta")]//span[contains(@class,"visually-hidden")]')
        elementos_fechas = driver.find_elements(By.XPATH, '//div[@class="occludable-update ember-view"]/div[contains(@data-urn,"")]//div[@class="feed-shared-actor__meta relative"]//span[contains(@class,"feed-shared-actor__sub-description t-12")]//span[@class="visually-hidden"]')

        #se presionan botones necesarios para ver todos los comentarios
        verComentarios(driver)
        

        count_posts = 1

        # Caja donde se insertará el url de los posts
        crearTextBox(driver)

        # Creación de objeto ActionChain
        action = ActionChains(driver)

        


        for descripcion_comentario, fecha_post, buton_reaccion in zip(elementos_descripcion_comentarios, elementos_fechas, elementos_reaccion):
            
            urlPost = ""
            
            if(fechaInRange(getDate(fecha_post.text), fechas)==False):
                print("post no esta en el rango")
                continue;
            else:
                print("post en rango ")
            
            
            #try:
            # try:

            times = 0
            while times < 2:
                print("Capturando enlaces de los post")
                PAUSE_TIME = random.uniform(3, 3.4)
                sleep(PAUSE_TIME)
                # capturar elemento boton (...) post
                btn_opt_control = WebDriverWait(driver,30).until(
                    EC.element_to_be_clickable((descripcion_comentario.find_element(By.XPATH,'.//div[@class="feed-shared-control-menu feed-shared-update-v2__control-menu absolute text-align-right"]//div[contains(@class,"artdeco-dropdown artdeco-dropdown--placement-bottom")]//button[@class="feed-shared-control-menu__trigger artdeco-button artdeco-button--tertiary artdeco-button--muted artdeco-button--1 artdeco-button--circle artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view"]')))
                )
                # btn_opt_control.click()
                # se mueve donde esta el boton (...) para capturar copiar enlace y luego le hace click
                # action.move_to_element(btn_opt_control).click().perform()

                action.move_to_element(btn_opt_control).perform()
                PAUSE_TIME = random.uniform(2, 2.7)
                sleep(PAUSE_TIME)
                action.click(on_element= btn_opt_control).perform()

                
                 # print("escrolleando al post")
                # driver.execute_script('arguments[0].scrollIntoView({block:"center", behavior: "smooth"})', btn_opt_control)
                # sleep(10)

                # btn_opt_control.click()
                PAUSE_TIME = random.uniform(5, 5.8)
                sleep(PAUSE_TIME)

                print("presionando boton obtener enlace")


                # presionar boton copiar url

                try:
                    btn_copy_clipboard_url = WebDriverWait(driver, 30).until(
                        EC.element_to_be_clickable((descripcion_comentario.find_element(By.XPATH,'.//div[contains(@class,"feed-shared-control-menu__content")]//li[2]')))
                    ).click()
                    break
                except:
                    print("no se pudo presionar copiar enlace publicacion")
                    times+=1

            

            # Cerrando modal copiado de portapapeles
            btn_close_modal_clipboard = WebDriverWait(driver,30).until(
                EC.element_to_be_clickable((By.XPATH,'//button[contains(@class,"artdeco-toast-item__dismiss") and contains(@aria-label,"Descartar")]'))
            ).click()

            
            pegarClipboard(driver)
            urlPost  = getClipboard(driver)

            print("url post copiado a portapapeles")
            print("url post {}".format(urlPost))
            # print("enlace post:{}".format(pc.paste()))
            # urlPost = pc.paste()


            # except:
            # print("no fue posible capturar enlace post")
            # pass

            print("Capturando la descrpcion de post")

            # descripcion = descripcion_comentario.find_element(By.XPATH, './div[contains(@data-urn, "urn:li:activity")]/div/div[3]')
            # print("Descripcion comentarios:"+descripcion.text)

            # corregido
            # almacena la descripcion del post, incluso si fue compartido de otro post
            # descripcion = descripcion_comentario.find_element(By.XPATH, '//div[contains(@data-urn, "urn:li:activity")]//div//div[@class="feed-shared-update-v2__description-wrapper"] | //div[@class="feed-shared-mini-update-v2 feed-shared-update-v2__update-content-wrapper artdeco-card"]//div[contains(@class,"feed-shared-inline-show-more-text")]')
            # print("Descripcion comentarios:"+descripcion.text)
            descripcion_post = descripcion_comentario.find_element(By.XPATH, './/div[contains(@data-urn, "urn:li:activity")]//div[contains(@class,"feed-shared-update-v2__description")]//div[contains(@class,"feed-shared-text")]')
            print("Descripcion post:"+descripcion_post.text)


            print("obteniendo caja de inf de cada comentario")
            # corregido
            elementos_nombres_cargos= descripcion_comentario.find_elements(By.XPATH, './/div[contains(@data-urn,"urn:li:activity")]//div[contains(@class,"comments-container")]//div[contains(@class,"comments-comments-list")]//article[contains(@class,"comments-comment-item")]')
            
            

            # elementos_urls_users_comentarios = descripcion_comentario.find_elements(By.XPATH, './div[contains(@data-urn, "urn:li:activity")]//div[contains(@class, "comments-container")]/div[contains(@class, "comments-comments-list")]//*[self::article[contains(@class, "comments-comment-item")]]/div/a[2]')
            print("Obteniendo urls de usuarios")
            # corregido
            elementos_urls_users_comentarios = descripcion_comentario.find_elements(By.XPATH, './/div[contains(@data-urn, "urn:li:activity")]//div[contains(@class,"comments-container")]//div[contains(@class,"comments-comments-list")]//article[contains(@class,"comments-comment-item")]/div[contains(@class,"comments-post-meta")]//div[@class="comments-post-meta__profile-info-wrapper display-flex"]//a')
            

          


            #para de recorrer los posts si se encuentra que el post actual es igual al último ingresado en la extracción pasada.
            if(descriptionLastestPost == descripcion_post.text):
                print("break por descripcion = descripción")
                break
            if (count_posts == 2):
                updateLatestPost(mycursor,mydb, name_company)#se actualiza el último post anterior
                latest_post = 1 #post actual será el último post
            else:
                latest_post = 0

            

            #se inserta post en base de datos
            try:
                print("Guardando post compañia {} en base de datos".format(name_company))
                insertPostCompany(mycursor, fecha_post, id_company, name_company, descripcion_post, urlPost, latest_post, id_descarga)
                id_post = mycursor.lastrowid

            except:
                print("No se pudo guardar post")
            #elementos que contienen la info de los comentarios del post actual
            print("obteniendo elementos comentarios")
            elementos_comentarios = descripcion_comentario.find_elements(By.XPATH, './/div[contains(@class,"comments-container")]//div[contains(@class,"comments-comments-list")]//article[contains(@class,"comments-comment-item")]')

            i=1

            # for el in elementos_comentarios:
            #     print("elemento comentario:"+el.text)

            #se recorren los comentarios del post actual


            # print("elementos comentarios {}".format(elementos_comentarios))

            # print("elementos nombres cargo {}".format(elementos_nombres_cargos))



            for comentario, nombre_cargo in zip(elementos_comentarios, elementos_nombres_cargos):
                print("pause time")
                PAUSE_TIME = random.uniform(5.2, 10.7)
                sleep(PAUSE_TIME)
                print("entra en ciclo for comentarios")

                nombre_comentario = nombre_cargo.find_element(By.XPATH, './div//a/h3/span/span[1]')
                nombre_comentario = nombre_comentario.text
                print("nombre comentario:"+nombre_comentario)
                fecha_comentario = nombre_cargo.find_element(By.XPATH, './/time')
                fecha_comentario = fecha_comentario.text
                print("fecha comentario:"+fecha_comentario)
                url_user_comentario = nombre_cargo.find_element(By.XPATH, './/div[contains(@class,"comments-post-meta")]//a[contains(@id,"ember") and contains (@class,"ember-view")]')
                url_user_comentario = str(url_user_comentario.get_attribute("href")).rstrip(' ')
                print("url user comentario:"+url_user_comentario)

                if('/tetris' in url_user_comentario):
                    print("cadena include /tetris")
                    url_user_comentario = url_user_comentario.replace("/tetris","")

                try:
                    cargo_comentario = nombre_cargo.find_element(By.XPATH, './/h3/span[position() = last()]')
                    cargo_comentario = (cargo_comentario).text
                    print("Cargo comentario:"+cargo_comentario)
                except NoSuchElementException:
                    cargo_comentario = ''

                # Captura el mensaje de cada comentario de los usuarios
                partes_comentario = comentario.find_element(By.XPATH, './/span[@class="comments-comment-item__main-content feed-shared-main-content--comment t-14 t-black t-normal"]//span[@dir="ltr"]')
                
                contenido=''

                #se recorren las distintas partes que conforman un comentario
                # for parte_comentario in partes_comentario:
                #     print("parte comentario: {}".format(parte_comentario.text))
                #     contenido = contenido + parte_comentario.text}
                contenido += partes_comentario.text
                print("contenido: "+contenido)
                #se inserta comentario a db
          
                
                try:
                    print("guardando usuario comentario post")
                    getUserInfo(url_user_comentario,nombre_comentario, cargo_comentario, driver, mycursor, mydb, id_company)
                    
                except:
                    print("error al guardar usuario")


                try:
                    id_user = getIdUser(url_user_comentario, mycursor)
                except:
                    print("error al obtener id usuario")

                try:
                    print("Guardando comentario de post")
                    insertCommentsCompany(mycursor, id_post, fecha_comentario, contenido, id_user)
                    id_comment = mycursor.lastrowid
                except:
                    print("error al guardar comentario usuario")
           
                #se extrae info del autor del comentario
                
                
                
                
                i=i+1

            print("fuera ciclo for comentarios")
            #Se abre ventanas de reacciones
            
            driver.execute_script('arguments[0].click();', buton_reaccion)
            
            scrollVentanaReacciones(driver)
            elemento_nombres = WebDriverWait(driver, 50).until(
                EC.presence_of_all_elements_located((By.XPATH, '//div[@id="artdeco-modal-outlet"]//li[contains(@class,"artdeco-list__item")]//span[@dir="ltr"]'))
            )
            elemento_nombres = driver.find_elements(By.XPATH, '//div[@id="artdeco-modal-outlet"]//li[contains(@class,"artdeco-list__item")]//span[@dir="ltr"]')
            elemento_urls = driver.find_elements(By.XPATH, '//div[@id="artdeco-modal-outlet"]//li[contains(@class,"artdeco-list__item")]/a')
            elemento_cargos = driver.find_elements(By.XPATH, '//div[@id="artdeco-modal-outlet"]//li[contains(@class,"artdeco-list__item")]//div[contains(@class,"artdeco-entity-lockup__caption")]')
            
            # print("URL :"+elemento_urls[1].text)
            # print("CARGO :"+elemento_cargos[1].text)
            # print("NOMBRE :"+elemento_nombres[1].text)
            elemento_tipos_reacciones = driver.find_elements(By.XPATH, '//img[contains(@class,"reactions-icon social-details-reactors-tab-body")]')

            # print("TIPO : "+elemento_tipos_reacciones[1].text)

            # elemento_nombres = []
            # elemento_urls  = []
            # elemento_cargos = []
            # elemento_tipos_reacciones = []
            #se recorren los usuarios de la ventana reacciones
            iteracion = 0;
            for nombre, cargo, url_user , tipo_reaccion in zip(elemento_nombres, elemento_cargos, elemento_urls , elemento_tipos_reacciones):
                print("iteracion reactions user: {}".format(iteracion))
                iteracion+=1;
                url_user=str(url_user.get_attribute("href")).rstrip(' ')
                #print("URL : "+url_user)
                nombre=(str(nombre.text)).rstrip(' ')
                #print("NOMBRE : "+nombre)
                cargo=(str(cargo.text)).rstrip(' ')
                #print("CARGO : "+cargo)
                getUserInfo(url_user,nombre, cargo, driver, mycursor, mydb, id_company)
                tipo_reaccion=str(tipo_reaccion.get_attribute("alt")).rstrip(' ')
                tipo_reaccion=tipo_reaccion.capitalize()
                #se agrega la reacción a la base de datos

                try:
                    id_user = getIdUser(url_user, mycursor)
                except:
                    print("error al obtener id usuario")

                try:
                    print("guardadndo reacciones post")
                    insertReactionsCompany(mycursor, id_post, tipo_reaccion, id_user)
                    id_reaction = mycursor.lastrowid
                except:
                    print("no se ha podido guardar reaccion")
                
            #se cierra ventana de reacciones
            boton_cerrar = driver.find_element(By.XPATH, '//div[@id="artdeco-modal-outlet"]//button[contains(@class, "artdeco-modal")]')
            boton_cerrar.click()

            #se verifica si es el post número 40, para terminar la extracción
            # if count_posts == 1:
            #     break
            # count_posts=count_posts+1
            if(fechaDesdeScroll(getDate(fecha_post.text), fechas)==True):
                break

            PAUSE_TIME = random.uniform(5.2, 10.7)
            sleep(PAUSE_TIME)
        
    #except:
    #    print("ERROR")

#se scrollea hasta el final o hasta cargar 42 posts
def scrollByDates(driver, fechas):
    

    print("Scrolleando posts...")

    #Num posts
    posts = driver.find_elements(By.XPATH, '//div[contains(@data-urn, "urn:li:activity")]')
    
    #SCROLL
    # SCROLL_PAUSE_TIME = random.uniform(3.0, 4.5)

    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")
    flag = False;
    while True:
        # Scroll down to bottom
        driver.execute_script( "window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});")
        # document.body.scrollHeight
        # "window.scrollTo({top: 100,left: 100,behavior: 'smooth'});"
        PAUSE_TIME = random.uniform(8, 10.7)
        sleep(PAUSE_TIME)


        posts = driver.find_elements(By.XPATH, '//div[contains(@data-urn, "urn:li:activity")]//div[@class="feed-shared-update-v2__description-wrapper"]')
        # Wait to load page
        new_height = driver.execute_script("return document.body.scrollHeight")
        
        # elementos_fechas = driver.find_elements(By.XPATH, '//div[contains(@data-urn, "urn:li:activity")][1]/div/div[1]/a/div[contains(@class,"actor__meta")]//span[contains(@class,"visually-hidden")]')
        elementos_fechas = driver.find_elements(By.XPATH, '//div[@class="occludable-update ember-view"]/div[contains(@data-urn,"")]//div[@class="feed-shared-actor__meta relative"]//span[contains(@class,"feed-shared-actor__sub-description t-12")]//span[@class="visually-hidden"]')

        print("post capturados {}".format(len(elementos_fechas)))
        index = 0
        for  fecha_post, post in zip(elementos_fechas, posts):
            # print("post: {}".format(post.text))
            if(fechaDesdeScroll(getDate(fecha_post.text), fechas)==True):
                print("fecha post menor al rango de fecha_desde")
                print("Posts en rango fecha encontrados: {}".format(str(index)))
                flag = True
                break;
            else:
                index+=1
                continue;
            
        # if len(posts) >= 42:
        #     break
        if flag == True:
            break
        if new_height == last_height:
            break
        last_height = new_height
    print("Fin Scrolleo")

#se scrollea hasta el final la ventana de reacciones
def scrollVentanaReacciones(driver):
    #SCROLL

    # SCROLL_PAUSE_TIME = random.uniform(3.0, 4.5)
    PIXELS = 2000000

    last_height = driver.find_elements(By.XPATH, '//div[@class="artdeco-modal__content social-details-reactors-modal__content ember-view"]//ul/li')

    while True:
        # Scroll down to bottom
        driver.execute_script("document.getElementsByClassName('artdeco-modal__content social-details-reactors-modal__content ember-view')[0].scroll(0, "+str(PIXELS)+")")

        # Wait to load page
        PAUSE_TIME = random.uniform(5.2, 10.7)
        sleep(PAUSE_TIME)
        
        #new_height = driver.execute_script("return document.getElementsByClassName('artdeco-modal__content social-details-reactors-modal__content ember-view')")
        new_height = driver.find_elements(By.XPATH, '//div[@class="artdeco-modal__content social-details-reactors-modal__content ember-view"]//ul/li')
        if new_height == last_height:
            break
        last_height = new_height
        PIXELS = PIXELS+20000

def cargarComentariosPost(driver):
    """se presiona el botón ver más comentarios de cada post, hasta que no hayan más comentarios para ver"""
    #Pausa
    # PAUSE_TIME = random.uniform(3.0, 4.5)

    #Comentarios iniciales
    last_height = driver.execute_script("return document.getElementsByClassName('comments-comments-list comments-comments-list--expanded ember-view')")

    while True:
        try:
            # Press button
            print("presionando boton 'Mostrar mas comentarios' posts")
            boton_mas_comentarios = driver.find_element(By.XPATH, '//div[contains(@class, "comments-container")]/div[contains(@class, "comments-comments-list")]//div[contains(@class, "comments-comments-list")][1]/button/span')
            driver.execute_script('arguments[0].click();',boton_mas_comentarios)
            # Wait to load page
            PAUSE_TIME = random.uniform(5.2, 10.7)
            sleep(PAUSE_TIME)
            new_height = driver.execute_script("document.getElementsByClassName('comments-comments-list comments-comments-list--expanded ember-view')")

            if new_height == last_height:
                break
            #last_height = new_height
        except NoSuchElementException:
            break


def cargarComentariosRespuestas(driver):
    """se presionan los botones para ver respuestas anteriores a un comentario"""
    # Press button

    # PAUSE_TIME = random.uniform(3.0, 4.5)
    print("presionando 'Cargar respuestas anterior' de comentarios")
    botones_ver_respuestas = driver.find_elements(By.XPATH, '//div[contains(@data-urn, "urn:li:activity")]//div[contains(@class, "comments-container")]/div[contains(@class, "comments-comments-list")]//*[self::article[contains(@class, "comments-comment-item")]]//button[contains(@class, "show-prev-replies")]')
    for boton in botones_ver_respuestas:
        driver.execute_script('arguments[0].click();',boton)
    PAUSE_TIME = random.uniform(5.2, 10.7)
    sleep(PAUSE_TIME)

def getDate(timeString):
    """se transforma de formato cadena a formato date"""
    
    now = datetime.now() 
    time = timeString.split(' ')
    
    if(len(time) == 2 or len(time) == 1):
        
        if( time[1][:3] == 'seg' or time[1][:3] == 'min' or time[1][:3] == 'hor' or time[0]== 'Ahora'):
            date = now.strftime('%Y-%m-%d')
            return date
    
        number = int(time[0])
        unit = time[1][0]
        
        if(unit == 'd'):
            date = now - relativedelta(days = number)
            date = date.strftime('%Y-%m-%d')
        
        if(unit == 's'):
            date = now - relativedelta(weeks = number)
            date = date.strftime('%Y-%m-%d')
        
        if(unit == 'm'):
            date = now - relativedelta(months = number)
            date = date.strftime('%Y-%m-%d')
        
        if(unit == 'a'):
            date = now - relativedelta(years = number)
            date = date.strftime('%Y-%m-%d')
    
    else:
        
        if( time[2][:3] == 'seg' or time[2][:3] == 'min' or time[2][:3] == 'hor'):
            date = now.strftime('%Y-%m-%d')
            return date
    
        number = int(time[1])
        unit = time[2][0]
        
        if(unit == 'd'):
            date = now - relativedelta(days = number)
            date = date.strftime('%Y-%m-%d')
        
        if(unit == 's'):
            date = now - relativedelta(weeks = number)
            date = date.strftime('%Y-%m-%d')
        
        if(unit == 'm'):
            date = now - relativedelta(months = number)
            date = date.strftime('%Y-%m-%d')
        
        if(unit == 'a'):
            date = now - relativedelta(years = number)
            date = date.strftime('%Y-%m-%d')
    
    date = datetime.strptime(date, '%Y-%m-%d')
    return date


def fechaInRange(fecha_post, rango_fecha):


    # print(fecha_post)
    # print(rango_fecha)

    fecha_desde = rango_fecha['fecha_desde']
    fecha_hasta = rango_fecha['fecha_hasta']

    # fecha_desde = datetime.strptime(fecha_desde, '%y-%m-%d %H:%M:%S')
    # fecha_desde = datetime.strptime(fecha_hasta, '%y-%m-%d %H:%M:%S')
    # print("type:")
    # print(type(fecha_desde))
    # print(type(fecha_hasta))
    # print(type(fecha_post))

    if(type(fecha_post)==(type(""))):
        fecha_post = datetime.strptime(fecha_post, '%Y-%m-%d')

    print(type(fecha_post))

    print("fecha desde {} ".format(fecha_desde))
    print("fecha hasta {} ".format(fecha_hasta))
    print("fecha post {} ".format(fecha_post))
    if(fecha_post>= fecha_desde and fecha_post<= fecha_hasta):
        return True;
    return False;


def fechaDesdeScroll(fecha_post, rango_fecha):


    # print(fecha_post)
    # print(rango_fecha)

    fecha_desde = rango_fecha['fecha_desde']
    fecha_hasta = rango_fecha['fecha_hasta']

    # fecha_desde = datetime.strptime(fecha_desde, '%y-%m-%d %H:%M:%S')
    # fecha_desde = datetime.strptime(fecha_hasta, '%y-%m-%d %H:%M:%S')
    # print("type:")
    # print(type(fecha_desde))
    # print(type(fecha_hasta))
    # print(type(fecha_post))

    if(type(fecha_post)==(type(""))):
        fecha_post = datetime.strptime(fecha_post, '%Y-%m-%d')

    print(type(fecha_post))

    print("fecha desde {} ".format(fecha_desde))
    print("fecha hasta {} ".format(fecha_hasta))
    print("fecha post {} ".format(fecha_post))
    if(fecha_post< fecha_desde):
        return True;
    return False;    

def dateStrToISODate(dateString):
    """se transforma de str a formato date"""
    dateStr = dateString.split(' ')
    monthNames = {
        "enero": "01",
        "febrero": "02",
        "marzo": "03",
        "abril": "04",
        "mayo": "05",
        "junio": "06",
        "julio": "07",
        "agosto": "08",
        "septiembre": "09",
        "octubre": "10",
        "noviembre": "11",
        "diciembre": "12",
    }

    date = datetime.strptime((dateStr[2]+'-'+monthNames[dateStr[0]]+'-'+'01'), '%Y-%m-%d')
    return date

def verComentarios(driver):
    """Se hacen clicks necesarios para poder ver los comentarios de cada post"""
    elementos_botones_ver_comentarios = driver.find_elements(By.XPATH,'//ul/li[2]/button[contains(@aria-label, "comentario")]/span')
    print("Presionando boton para ver comentario posts")
    for elemento in elementos_botones_ver_comentarios:
        driver.execute_script('arguments[0].click();', elemento)
    PAUSE_TIME = random.uniform(2, 2.7)
    sleep(PAUSE_TIME)
    cargarComentariosPost(driver)
    cargarComentariosRespuestas(driver)

def getFollowers(driver, company_number, id_company, mycursor, mydb):
    """se extraen los followers de la empresa"""

    url_followers = 'https://www.linkedin.com/company/'+company_number+'/admin/analytics/followers/'
    
    driver.get(url_followers)

    boton_ver_followers = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//table/tbody/tr/td/button'))
        )
    driver.execute_script('arguments[0].click();', boton_ver_followers)
    scrollVentanaFollowers(driver)

    #obtener lista de nombres
    elementos_nombres = driver.find_elements(By.XPATH, '//tbody/tr/td[contains(@class, "org-view-page-followers-modal")][1]/a/div[contains(@class, "align-items-center")]/div[contains(@class, "content")]/div[1]')
    #obtener lista de cargos
    elementos_cargos = driver.find_elements(By.XPATH, '//tbody/tr/td[contains(@class, "org-view-page-followers-modal")][1]/a/div[contains(@class, "align-items-center")]/div[contains(@class, "content")]/div[position() = last()]')
    #obtener lista de fechas que se unieron
    elementos_fechas_seguimiento = driver.find_elements(By.XPATH, '//tbody/tr/td[contains(@class, "org-view-page-followers-modal")][2]/span/span[1]')
    #obtener lista de urls de usuarios
    elementos_urls_users = driver.find_elements(By.XPATH, '//tbody/tr/td[contains(@class, "org-view-page-followers-modal")][1]/a')

    for nombre, cargo, fecha, url_user in zip(elementos_nombres, elementos_cargos, elementos_fechas_seguimiento, elementos_urls_users):
        

        nombre = nombre.text
        cargo = cargo.text
        fecha = fecha.text
        url_user = str(url_user.get_attribute("href")).rstrip(' ')

        
        try:
            print("guardando followers")
            insertFollowersCompany(mycursor, id_company, nombre, cargo, fecha, url_user)
            id_follower = mycursor.lastrowid
        except:
            print("No se ha podido guardar los followers")
        getUserInfo(url_user,nombre, cargo, driver,mycursor, mydb, id_company)
        

def scrollVentanaFollowers(driver):
    """se scrollea ventana de followers hasta el final"""

    #SCROLL
    # SCROLL_PAUSE_TIME = random.uniform(2.0, 3.5)
    PIXELS = 2000000
    # Get scroll height

    last_height = driver.find_elements(By.XPATH, '//table[contains(@class, "table")]/tbody/tr/td[1]')

    while True:
        # Scroll down to bottom
        driver.execute_script("document.getElementsByClassName('artdeco-modal__content org-view-page-followers-modal__content artdeco-modal__content--no-padding ember-view')[0].scroll(0,"+ str(PIXELS) +")")
        
        # Wait to load page
        PAUSE_TIME = random.uniform(5.2, 10.7)
        sleep(PAUSE_TIME)

        #new_height = driver.execute_script("return document.getElementsByClassName('artdeco-modal__content social-details-reactors-modal__content ember-view')")
        new_height = driver.find_elements(By.XPATH, '//table[contains(@class, "table")]/tbody/tr/td[1]')

        if new_height == last_height:
            break
        last_height = new_height   
        PIXELS =PIXELS+200000

def sentimentAnalysis(comment): 
    """se analisa el sentimiento de un comentario comentario y se retorna neutro, positivo o negativo"""
    sentiment = sentiment_analysis.SentimentAnalysisSpanish()
    sentiment_number = float(format(sentiment.sentiment(comment), "9.6f"))

    print("comentario sentimiento:{}".format(comment))
    print("numero sentimiento:{}".format(sentiment_number))

    res='neutro'
    if(sentiment_number>= 0.6):
        res="positivo"
        return res
    if(sentiment_number<= 0.4):
        res="negativo"
        return res
    return res

def getUserInfo(url_user,name, job, driver,mycursor, mydb, id_company):
    """se extrae informacion de los usuarios de la empresa"""
    # PAUSE_TIME = random.uniform(0.3,1)
    print("pause time")
    PAUSE_TIME = random.uniform(5.2, 10.7)
    sleep(PAUSE_TIME)
    
    query = "SELECT * FROM users WHERE url_user='"+url_user+"'"
    mycursor.execute(query)
    myresult = mycursor.fetchall()

    if ( len(myresult) == 0 ):
        driver.execute_script("window.open('"+url_user+"', '_blank')")
        driver.switch_to.window(driver.window_handles[1])
        
        # pageLoad(driver)
        
        print("url actual:"+driver.current_url)

        number_followers = getFollowersUser(driver)

        locationUser = getLocationUser(driver)

        PAUSE_TIME = random.uniform(3, 3.9)
        sleep(PAUSE_TIME)
        try:
            print("Buscando boton mostrar mas experiencia")
            # dependiendo de la cuenta varia la estructura
            try:
                btn_show_more_experience = WebDriverWait(driver,5).until(
                    EC.presence_of_element_located((By.XPATH, '//main[@id="main"]//section[@id="experience-section"]//button[contains(@class,"pv-profile-section__see-more-inline")]'))
                ).click()
            except:
                try:
                    btn_show_more_experience = WebDriverWait(driver,5).until(
                    EC.presence_of_element_located((By.XPATH, '//section[contains(@class,"artdeco-card")]//div[@id="experience"]/ancestor::section//span[@class="pvs-navigation__text"]'))
                    ).click()
                except:
                    raise Exception
        except:
            print("Boton mostrar experiencia no encontrado")
            pass     
        
        # try:
        #     print("Buscando boton ver todos los puestos")
        #     btn_show_more_job = WebDriverWait(driver,5).until(
        #         EC.element_to_be_clickable((By.XPATH,'//div[@class="pvs-list__footer-wrapper"]//div[@class="pv2"]/a'))
        #     ).click()
        # except:
        #     print("no se encontró boton ver todos los puestos")
        
        print("url actual usuario {}".format(driver.current_url))


        # obtiene la informacion de la experiencia del usuario
        # diccionario
        experiences = getExperienceUserCase2(driver)


        print("imprimiendo dict experience: {}".format(experiences))

      
        # if(string_experience ==''):
        #     string_experience = getExperienceUserCase2(driver)

        try:
            #botón ver más formación 
            print("Buscando boton mostrar mas titulaciones")
            try:
                btn_show_more_education = WebDriverWait(driver,5).until(
                    EC.presence_of_element_located((By.XPATH, '//main[@id="main"]//section[@id="education-section"]//button[contains(@class,"pv-profile-section__see-more-inline")]'))
                ).click()
            except:
                try:
                    btn_show_more_education = WebDriverWait(driver,5).until(
                    EC.presence_of_element_located((By.XPATH, '//section[contains(@class,"artdeco-card")]//div[@id="education"]/ancestor::section//a[contains(@class,"optional-action-target-wrapper")]//span[@class="pvs-navigation__text"]'))
                    ).click()
                except:
                    raise Exception
        except:
            print("Boton mostrar mas titulaciones no encontrado")
            pass


        # obtiene la informacion educacional del usuario
        # diccionario 
        educations = getEducationUser(driver)


        print("imprimiendo dict education {}".format(educations))

         # obtiene la informacion de numero de seguidores

        # if string_education=="":
        #     string_education = getEducaciontUserCase2(driver)

        try:
            #locacion
            location = driver.find_element(By.XPATH, '//main//div[contains(@class, "flex-1")]/ul[2]/li[1]') #locacion
            location = location.text
        except:
            try:
                #locacion empresa
                location = driver.find_element(By.XPATH, '//section/div/div/div[1]/div/div[1]/div[2]/div/div/div[2]/div[contains(@class, "org-top-card-summary")][1]')
                location = location.text
            except:
                location = 'Ubicación no disponible'


        try:
            print("guardando usuario en base de datos")
            insertUser(mycursor, id_company, name, job, locationUser['pais'], locationUser['locacion'], number_followers, url_user)
            # insertEducationUser( getIdUser(url_user, mycursor), string_education)
            id_user = mycursor.lastrowid 
        except:
            print("no se ha podido guardar usuario en base de datos")

        try:
            insertEducationUser(id_user, educations, mycursor)
        except:
            print("no se ha podido guardar informacion de formacion profesional")

        try:
            insertExperienceUser( id_user, experiences, mycursor)
        except:
            print("no se ha podido guardar informacion de experience laboral")

        PAUSE_TIME = random.uniform(5.2, 10.7)
        sleep(PAUSE_TIME)

        driver.close()
        driver.switch_to.window(driver.window_handles[0])

        # return id_user


def getDescriptionLatestPost(mycursor, name_company):
    """se obtiene la descripción del último post almacenado en la base de datos"""
    query = "SELECT posts.description FROM companies as c INNER JOIN posts ON c.id_company = posts.idCompany WHERE posts.latest = 1 AND c.name_company='"+name_company+"';"
    mycursor.execute(query)
    myresult = mycursor.fetchall()

    # if(len(myresult)==0):
    #     print("entra aca")
    #     return ""

    if(len(myresult)==0):
        return ""

    return((myresult[0])[0]) #description post

def getIdCompany(mycursor, id_descarga):
    """Se obtiene id de una compañia según el nombre (username)"""
    query = "SELECT companies.id_company FROM companies JOIN descarga ON companies.id_company=descarga.id_Company WHERE descarga.id_descarga = {}".format(id_descarga)
    mycursor.execute(query)
    myresult = mycursor.fetchall()
    return((myresult[0])[0])

def existsCompany(mycursor, id_descarga):
    """si existe la compañia del nombre ingresado(username) 
    retorna true, en caso contrario false"""
    query = "SELECT * FROM companies join descarga on descarga.id_company=companies.id_company WHERE descarga.id_descarga='{}';".format(id_descarga)
    mycursor.execute(query)
    myresult = mycursor.fetchall()
    
    if ( len(myresult) == 0 ):
        return False
    return True

def updateLatestPost(mycursor,mydb,name_company):
    """actualiza el capo latest de un post en la base de datos"""
    query = "UPDATE posts SET latest=0 WHERE latest=1 and name_company='"+name_company+"'"
    mycursor.execute(query)
    # mydb.commit()

def sortPostByDates(driver):
    
    """se presionan los botones necesarios para ordenar las publicaciones por fecha de publicación"""
    
    
    print("metodo ordenacion fechas")
    PAUSE_TIME = random.uniform(1, 1.5)
    sleep(PAUSE_TIME)
    
    print("presionar boton close chat")
    # Debido a que los ember id van cambiando y tienen la misma clase
    # es necesario seleccionar el elemento por su posición
    button_close_chat = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, "//aside[@id='msg-overlay']//header[@class='msg-overlay-bubble-header']//button[@class='msg-overlay-bubble-header__control msg-overlay-bubble-header__control--new-convo-btn artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view'][2]"))
    )
    button_close_chat.click()
    print("cerrando chat")
    
    print("Presionar boton recientes")
    
    
    times = 0 
    while times<2:

        try:
            button_sort_by = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.XPATH,'//div[@class="org-grid__content-height-enforcer"]//div[@class="sort-dropdown mt2 ml1"]//button[@class="artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view display-flex t-normal t-12 t-black--light" and @data-control-name="feed_sort_dropdown_trigger"]'))
            )
            button_sort_by.click()
            print("boton desplegable presionado")
            button_sort_by_recent = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.XPATH,'//div[@class="org-grid__content-height-enforcer"]//div[@class="sort-dropdown mt2 ml1"]//button[@class="artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view display-flex t-normal t-12 t-black--light" and @data-control-name="feed_sort_dropdown_trigger"]/following-sibling::div//ul/li[2]//div'))
            )
            
            button_sort_by_recent.click()
            print("post ordenados por recientes")
            break
        except TimeoutException:
            print("no se logro presionar boton")
            times+=1
 




def getFollowersUser(driver):
    """Captura informacion del numero de seguidores del usuario"""
    # pageLoad(driver)
    number_followers = 0;
 
    try:
        number_followers = driver.find_element(By.XPATH, '//div[@class="pv-deferred-area ember-view"]//div[@class="pv-deferred-area__content"]//section[@class="pv-profile-section pv-recent-activity-section-v2 artdeco-card p5 mt4 ember-view"]//span[@class="align-self-center t-14 t-black--light"]')
        
        
        number_followers = number_followers.text.split()
        number_followers = number_followers[0].replace('.','')
        number_followers = int(number_followers)

    except NoSuchElementException:
        try:
            print("entra en este bloque try , obtener n° seguidores")
            # devuelve una cadena con el n° de seguidores  
            # ej: 1.590 seguidores
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH,'//section[contains(@class,"artdeco-card")]//div[@class="pvs-header__container"]//p[@class="pvs-header__subtitle text-body-small"]//span[@aria-hidden="true"]'))
            )
            number_followers = driver.find_element(By.XPATH,'//section[contains(@class,"artdeco-card")]//div[@class="pvs-header__container"]//p[@class="pvs-header__subtitle text-body-small"]//span[@aria-hidden="true"]')

            # print("numero de seguidores: {}".format(number_followers.text))

            number_followers = number_followers.text.split()
            number_followers = number_followers[0].replace('.','')
            number_followers = int(number_followers)

        except NoSuchElementException:
            print("numero de seguidores no encotrados")
            number_followers = 0
        except ValueError:
            raise Exception
        except TimeoutException:
            print("tiempo de espera superado ")
            number_followers = 0
    except ValueError:
        print("error al parsear numero")
        number_followers = 0
    print("numero de seguidores:{}".format(number_followers))      
    return number_followers



def getLocationUser(driver):
    pais = ""
    locacion = ""

    try:
        ubication = WebDriverWait(driver,15).until(
            EC.presence_of_element_located((By.XPATH, '//main[@id="main"]//div[@class="mt2 relative"]//div[@class="pb2 pv-text-details__left-panel"]//span[@class="text-body-small inline t-black--light break-words"]'))
        )
        # ubication = driver.find_element(By.XPATH,'//main[@id="main"]//div[@class="mt2 relative"]//div[@class="pb2 pv-text-details__left-panel"]//span[@class="text-body-small inline t-black--light break-words"]').text
        # cambiar si hay errores

        listUbication = ubication.text.split(",")

        # formato cadena con 3 "," => ubicacion, region, pais
        if(len(listUbication)==3):
            print("caso 1")
            print("location {}".format(listUbication[0]))
            print("pais: {}".format(listUbication[2]))
            pais = listUbication[2]
            locacion = listUbication[0]
            
        # formato => pais o ubicacion    
        else:
            print("caso 2")
            if(isPais(listUbication[0])== True):
                print("pais: {}".format(listUbication[0]))
                pais = listUbication[0]
            else:
                print("location: {}".format(listUbication[0]))
                locacion = listUbication[0]

    except TimeoutException:
        ubication = WebDriverWait(driver,15).until(
            EC.presence_of_element_located(('//main[@id="main"]//div[@class="org-top-card-summary-info-list t-14 t-black--light"]//div[@class="inline-block"]//div[1]'))
        )

        listUbication = ubication.text.split(",")

        # formato cadena con 3 "," => ubicacion, region, pais
        if(len(listUbication)==3):
            print("caso 1")
            print("location {}".format(listUbication[0]))
            print("pais: {}".format(listUbication[2]))
            pais = listUbication[2]
            locacion = listUbication[0]
            
        # formato => pais o ubicacion    
        else:
            print("caso 2")
            if(isPais(listUbication[0])== True):
                print("pais: {}".format(listUbication[0]))
                pais = listUbication[0]
            else:
                print("location: {}".format(listUbication[0]))
                locacion = listUbication[0]

    except NoSuchElementException:
        print("no se encontro ubicación")


    return {"pais": pais, "locacion": locacion}





def getEducationUser(driver):
    """Captura informacion de la formación profesional del usuario caso 1"""

    # pageLoad(driver)
    # sleep(10) descomentar si hay errores
    url_user = (driver.current_url).replace('details/experience/','')
    print("url actual user:"+driver.current_url)
    print("obtener informacion formacion profesional caso 1")
    #lista de establecimientos de formación académica
    # education = driver.find_elements(By.XPATH,'//section[@id="education-section"]//ul[contains(@class,"pv-profile-section__section-info")]//div[@class="pv-entity__degree-info"]//h3')
    
    string_education = ""
    dict_education = {}

    # si tiene mas informacion educacional al presionar el boton
    # se lleva a otra direccion url con distinta estructura
    if (not "/details/education/" in driver.current_url):
        

        # metodo find_elements no lanza exception nosuchexception
        try:
            educations = WebDriverWait(driver, 15).until(
                EC.presence_of_all_elements_located((By.XPATH, '//section[@id="education-section"]//div[@class="pv-entity__degree-info"]'))
            )
        except:
            print("tiempo superado buscando elements educations")

        educations = driver.find_elements(By.XPATH,'//section[@id="education-section"]//div[@class="pv-entity__degree-info"]')
        
        if(len(educations)==0):
            print("entra aquiiiiiiiii")
            educations = driver.find_elements(By.XPATH,'//div[@id="education"]/ancestor::section[contains(@class,"artdeco-card")]//div[@class="display-flex flex-column full-width align-self-center"]')
            
            for i,education in enumerate(educations):
                
                try:
                    education_institution = education.find_element(By.XPATH,'.//div[@class="display-flex align-items-center"]//span[contains(@class,"t-bold")]//span[@aria-hidden="true"]') 
                    string_education+= education_institution.text+'|'


                    aux_institution = education.find_element(By.XPATH,'.//div[@class="display-flex align-items-center"]//span[contains(@class,"t-bold")]//span[@aria-hidden="true"]').text 
                    
                    if(dict_education.get(aux_institution,"no existe")=="no existe"):
                        dict_education[aux_institution] = []

                except NoSuchElementException:
                    print("no se encontro institucion")

                try:   
                    education_degree = education.find_element(By.XPATH,'.//span[@class="t-14 t-normal"]//span[@aria-hidden="true"]')
                    string_education+= education_degree.text

                    aux_degree = education.find_element(By.XPATH,'.//span[@class="t-14 t-normal"]//span[@aria-hidden="true"]').text

                    dict_education[aux_institution].append(aux_degree);

                except:
                    print("no se encontro titulo educacion ")


                if(i<(len(educations)-1)):
                    string_education+=";"

        else:
            print("else")
            for i,education in enumerate(educations):

                print(i,education)
                education_institution = education.find_element(By.XPATH,'.//h3[@class="pv-entity__school-name t-16 t-black t-bold"]') 

                string_education+= education_institution.text+"|"

                education_degrees = education.find_elements(By.XPATH,'.//p[contains(@class,"pv-entity__secondary-title")]//span[@class="pv-entity__comma-item"]')

                aux_institution = education.find_element(By.XPATH,'.//h3[@class="pv-entity__school-name t-16 t-black t-bold"]').text

                if(dict_education.get(aux_institution,"no existe")=="no existe"):
                    dict_education[aux_institution] = []

                for j,education_degree in enumerate(education_degrees):

                    string_education += education_degree.text

                    aux_degree = education_degree.text
                    dict_education[aux_institution].append(aux_degree)

                    if(j<(len(education_degrees)-1)):
                        string_education+=','


                if(i<(len(educations)-1)):
                    string_education+=";"

    
        print("educacion:"+string_education)
        driver.get(url_user)
        return dict_education  

    else:
        return getEducaciontUserCase2(driver)
    
    

def getEducaciontUserCase2(driver):
    """Captura informacion de la formación profesional del usuario caso 2"""
    # pageLoad(driver)
    
    url_user = (driver.current_url).replace('details/experience/','')
    print("obtener informacion formacion profesional caso 2")
    string_education = ""
    dict_education = {}
    # url_user = driver.current_url
    # driver.get(driver.current_url+'/details/education')
    # pageLoad(driver)
    

    try:
        close_modal = WebDriverWait(driver,10).until(
            EC.element_to_be_clickable((By.XPATH,'//div[@role="dialog"]//button'))
        ).click()
    except:
        print("modal no encontrado")

    # sleep(10) descomentar si hay errores
    educations = WebDriverWait(driver, 15).until(
                EC.presence_of_all_elements_located((By.XPATH, '//div[@class="display-flex flex-row justify-space-between"]'))
    )
    educations = driver.find_elements(By.XPATH,'//div[@class="display-flex flex-row justify-space-between"]')


    for i,education in enumerate(educations):
        
        education_institution = education.find_element(By.XPATH,'.//div[@class="display-flex align-items-center"]/span[contains(@class,"t-bold mr1")]/span[@aria-hidden="true"]')
        aux_institution = education_institution.text

        if(dict_education.get(aux_institution,"no existe")=="no existe"):
            dict_education[aux_institution] = []

        string_education += education_institution.text + '|'
        try:
            education_degree = education.find_element(By.XPATH,'.//span[@class="t-14 t-normal"]//span[@aria-hidden="true"]')
            string_education += education_degree.text


            aux_degree = education_degree.text
            dict_education[aux_institution].append(aux_degree)
        except:
            pass
        
        if(i<(len(educations)-1)):
            string_education += ';'

    print("formacion profesional capturada")
    driver.get(url_user)
    
    print("Formacion profesional: {}".format(string_education))
    return dict_education
    



def getExperienceUser(driver):
    """Captura información de la experiencia del usuario"""
    # pageLoad(driver)
    # sleep(10) descomentar si hay errores
    
    string_experience = ''
    dict_experience = {}
    url_user = (driver.current_url).replace('details/experience/','')
    if 'details/experience/' in driver.current_url:
    
        print("obteniendo experiencia caso 2")
        copiaUrl=driver.current_url
        urlExperience = 'details/experience'
        copiaUrl = copiaUrl.replace(urlExperience,'')
        
        # sleep(10)
        # try:
        #     close_modal = WebDriverWait(driver,10).until(
        #         EC.element_to_be_clickable((By.XPATH,'//div[@role="dialog"]//button'))
        #     ).click()
        # except:
        #     print("modal no encontrado")

        try:
            elements_li = WebDriverWait(driver, 15).until(
                EC.presence_of_all_elements_located((By.XPATH, '//*[contains(@class,"pvs-list__paged-list-item artdeco-lis")]'))
            )
            elements_li = driver.find_elements(By.XPATH,'//*[contains(@class,"pvs-list__paged-list-item artdeco-lis")]')
            for index,element_li in enumerate(elements_li):
                string_experience+='▶'
                # ARREGLAR EXPERIENCE_LOCATIONS Y EXPERIENCE_DESCRIPTIONS
                experiences_cargo = element_li.find_elements(By.XPATH,'.//span[contains(@class,"t-bold")]//span[@aria-hidden="true"]')
                if(len(experiences_cargo)>1):
                    for j,experience_cargo in enumerate(experiences_cargo):
                        string_experience += ' ● '
                        string_experience += experiences_cargo[j+1].text.title()
                        if(j==(len(experiences_cargo))-2):
                            string_experience += '【'
                            string_experience+=(experiences_cargo[0].text).upper()
                            string_experience += '】◀'
                            break
                    break
                Aux=experiences_cargo[0].text.title()
                Aux=Aux.title()
                string_experience += Aux + '【'
                experience_Empresa = element_li.find_element(By.XPATH,'.//span[@class="t-14 t-normal"]//span[1]')
                experience_Empresa = experience_Empresa.text
                #experience_Empresa = experience_Empresa.title()
                string_experience += experience_Empresa.upper()+'】◀  '
                print("OMEEGAAAAAAAAAAA LUL")
                # string_experience+='————'
            print("OMEGA LULLLLLLLLLLLLLLL",len(elements_li))
            print("experiencia:{}".format(string_experience))
            driver.get(copiaUrl)
            return string_experience
        except Exception as e:
            print("Error encontrado :"+e)
            return ""

    else:
        print("obteniendo experiencia caso 1")
        try:
            #lista experiencias
            print("perfil usuario experiences 1")
            
            experiences = driver.find_elements(By.XPATH,'//section[@id="experience-section"]//section[@class="pv-profile-section__card-item-v2 pv-profile-section pv-position-entity ember-view"]')


            if (len(experiences)==0):
                
                experiences = driver.find_elements(By.XPATH,'//section//div[@id="experience"]/ancestor::section//ul[contains(@class,"pvs-list")]//li[@class="artdeco-list__item pvs-list__item--line-separated pvs-list__item--one-column"]')


                for index,experience in enumerate(experiences):
                    
                    # lugar donde trabajo
                    experience_locations = experience.find_elements(By.XPATH,'.//div[contains(@class,"pvs-entity")]//div[@class="display-flex flex-row justify-space-between"]//a[@data-field]//div[@class="display-flex align-items-center"]//span[contains(@class,"t-bold mr1")]//span[@aria-hidden="true"] | .//div[@class="display-flex flex-row justify-space-between"]//div[@class="display-flex flex-column full-width"]//span[contains(@class,"t-bold")]')


                    #  tipo de trabajo
                    experience_descriptions = experience.find_elements(By.XPATH, './/div[contains(@class,"pvs-entity")]//div[@class="display-flex flex-row justify-space-between"]//div[@class="display-flex align-items-center"]/ancestor::a[not (contains(@data-field,"experience_company_logo"))]//div[@class="display-flex align-items-center"]//span[@aria-hidden="true"] | .//div[contains(@class,"pvs-entity")]//div[@class="display-flex align-items-center"]/ancestor::div[@class="display-flex flex-column full-width"]//span[contains(@class,"t-bold mr1")]//span[@aria-hidden="true"]')



                    for i,experiece_location in experience_locations:
                        string_experience += experiece_location.text + '|'
                        
                        for j,experience_description in experience_descriptions:
                            string_experience += experience_description.text

                            if(j<(len(experience_descriptions)-1)):
                                string_experience += ','

                        if (i<(len(experience_locations)-1)):
                            string_experience += ';'
                    
                    if(index(len(experiences)-1)):
                        string_experience += '/'

            else:
                try:
                    # si encuentra el elemento div con la clase company details
                    # quiere decir que tiene un listado de experiencia dentro de un mismmo lugar de trabajo
                    company_details = driver.find_element(By.XPATH,'//section[@class="pv-profile-section__card-item-v2 pv-profile-section pv-position-entity ember-view"]//a[contains(@class,"ember-view")]//div[@class="pv-entity__company-details"]')

                    # si no sale por la excepcion quiere decir que hay una lista de exp del mismo trabajo
                    
                    print("tiene lista de experiencias")

                    for index,experience in enumerate(experiences):
                        

                        # lugar donde trabajo
                        experience_locations = experience.find_elements(By.XPATH,'.//a[contains(@class,"ember-view")]//div[@class="pv-entity__company-details"]//div[@class="pv-entity__company-summary-info"]//h3/span[2] | .//a//p[@class="pv-entity__secondary-title t-14 t-black t-normal"]')



                        #  tipo de trabajo
                        experience_descriptions = experience.find_elements(By.XPATH, './/div[contains(@class,"pv-entity__role-details-container")]//h3[@class="t-14 t-black t-bold"]//span[2] | .//a//div[contains(@class,"pv-entity__summary-info pv-entity__summary-info--background-section")]//h3[@class="t-16 t-black t-bold"]')
                        

                        for i,experience_location in enumerate(experience_locations):

                            string_experience += experience_location.text + '|'
                            
                            for j, experience_description in enumerate(experience_descriptions):
                                string_experience += experience_description.text

                                if(j<(len(experience_descriptions)-1)):
                                    string_experience += ","
                            
                            if(i<(len(experience_locations)-1)):
                                string_experience +="/"

                        if(index<(len(experiences)-1)):
                            string_experience +=";"
                except:
                    try:
                        print("perfil usuario experiences 2")
                        for index,experience in enumerate(experiences):

                            experience_location = experience.find_element(By.XPATH,'.//p[@class="pv-entity__secondary-title t-14 t-black t-normal"]')

                            experience_description = experience.find_element(By.XPATH, './/h3[@class="t-16 t-black t-bold"]')


                            string_experience += experience_location.text+'|'
                            string_experience += experience_description.text
                            
                            if(index<len(experiences)-1):
                                string_experience+=';'
                    except:
                        print("error 1")
                print("experiencia:"+string_experience)
                return string_experience
        except:
            print("no se encontró experiencia")
            return {}
    



def getExperienceUserCase2(driver):
    """Captura información de la experiencia del usuario"""
 
    print("obteniendo experiencia caso 2")
    string_experience = ''
    copiaUrl=driver.current_url
    urlExperience = 'details/experience'
    copiaUrl = copiaUrl.replace(urlExperience,'')
    
    if(not urlExperience in copiaUrl):
        driver.get(driver.current_url+'details/experience')

    dict_experience = {}
    try:
        close_modal = WebDriverWait(driver,10).until(
            EC.element_to_be_clickable((By.XPATH,'//div[@role="dialog"]//button'))
        ).click()
    except:
        print("modal no encontrado")
    
    # try:
    experiences_li = WebDriverWait(driver, 15).until(
        EC.presence_of_all_elements_located((By.XPATH, '//*[contains(@class,"pvs-list__paged-list-item artdeco-lis")]'))
    )
    experiences_li = driver.find_elements(By.XPATH,'//*[contains(@class,"pvs-list__paged-list-item artdeco-lis")]')

    # contiene las experiencias que no tienen una sublista
    elements_li = driver.find_elements(By.XPATH, './/div[@class="display-flex flex-column full-width align-self-center"]//div[@class="display-flex align-items-center"]//span[contains(@class,"t-bold") and not(contains(@class,"hoverable-link-text"))]//span[@aria-hidden="true"]//ancestor::div[@class="display-flex flex-column full-width align-self-center"]')

    # contiene una lista de su experiencia laboral dentro de la misma empresa
    sub_elements_li = driver.find_elements(By.XPATH, './/div[@class="display-flex flex-column full-width align-self-center"]/div/a[@class="optional-action-target-wrapper display-flex flex-column full-width"]//div[@class="display-flex align-items-center"]/ancestor::ul[@class="pvs-list "]/ancestor::div[@class="scaffold-finite-scroll__content"]/ancestor::div[@class="display-flex flex-column full-width align-self-center"]/div/a[@class="optional-action-target-wrapper display-flex flex-column full-width"]//ancestor::div[@class="display-flex flex-column full-width align-self-center"]')


    # los list elements no arrojan excepcion solo tiene largo 0 si no se encuentran
    for element_li in elements_li:

        try:
            try:
                nombre_empresa = element_li.find_element(By.XPATH, './/div[@class="display-flex flex-column full-width"]/span[@class="t-14 t-normal"]/span[@aria-hidden="true"]')
            except NoSuchElementException:
                nombre_empresa = element_li.find_element(By.XPATH, './/div[contains(@class,"display-flex flex-column full-width")]/span[@class="t-14 t-normal"]/span[@aria-hidden="true"]')

            cargo_empresa = element_li.find_element(By.XPATH, './/span[contains(@class,"t-bold") and not(contains(@class,"hoverable-link-text"))]//span[@aria-hidden="true"]')

            aux_empresa = nombre_empresa.text
            aux_cargo = cargo_empresa.text
            if(dict_experience.get(aux_empresa,"no existe")=="no existe"):
                dict_experience[aux_empresa] = []

            dict_experience[aux_empresa].append(aux_cargo)
        except:
            print("except experience elements li")
    
    for sub_element_li in sub_elements_li:

        try:
            nombre_empresa = sub_element_li.find_element(By.XPATH, './div/a[@class="optional-action-target-wrapper display-flex flex-column full-width"]//span[contains(@class,"t-bold")]/span[1]')

            cargos_empresa = sub_element_li.find_elements(By.XPATH, './/ancestor::div[@class="display-flex flex-column full-width align-self-center"]//div[@class="pvs-list__outer-container"]//div[@class="scaffold-finite-scroll__content"]/ul/li')

            aux_empresa = nombre_empresa.text
            if(dict_experience.get(aux_empresa,"no existe")=="no existe"):
                dict_experience[aux_empresa] = []

            for li_cargo_empresa in cargos_empresa:
                
                cargo_empresa = li_cargo_empresa.find_element(By.XPATH, './div[contains(@class,"pvs-entity")]/div[@class="display-flex flex-column full-width align-self-center"]/div[@class="display-flex flex-row justify-space-between"]/a[@class="optional-action-target-wrapper display-flex flex-column full-width"]/div[@class="display-flex align-items-center"]/span[contains(@class,"t-bold")]/span[@aria-hidden="true"]')

                aux_cargo = cargo_empresa.text
                dict_experience[aux_empresa].append(aux_cargo)

        except:
            print("except experience sub elements li")

    driver.get(copiaUrl)
    return dict_experience

    # except:
        # print("no se ha podido capturar experience case 2")


def insertCompany(mydb,mycursor,name_company, followers, date):
    sqlCompany = ("INSERT INTO companies "
        "(name_company, followers, date) "
        "VALUES (%(name_company)s, %(followers)s, %(date)s)")
    company_values = {
        'name_company': name_company,
        'followers': followers,
        'date': date,
    }
    mycursor.execute(sqlCompany, company_values)
    # mydb.commit()

# actualiza el numero de followers 
def updateCompany(mydb,mycursor, id_company, id_descarga, followers):
    sqlCompany = ("UPDATE companies  "
        "INNER JOIN descarga ON descarga.id_Company = companies.id_company  "
        "SET companies.followers='{}'"
        "WHERE descarga.id_descarga='{}' AND companies.id_company='{}';".format(followers, id_descarga, id_company))
    # company_values = {
    #     'name_company': name_company,
    #     'followers': followers,
    #     'date': date,
    # }
    mycursor.execute(sqlCompany)


def insertPostCompany(mycursor, fecha_post, id_company, name_company, descripcion_post, urlPost, latest_post, id_descarga):
    sqlPost = ("INSERT INTO posts "
                        "(idCompany, name_company, description, url_post, published_date, latest, id_descarga) "
                        "VALUES (%(idCompany)s, %(name_company)s, %(description)s, %(url_post)s, %(published_date)s, %(latest)s, %(id_descarga)s)")       
    print("fecha post: "+fecha_post.text)
    post_values = {
        'idCompany': id_company,
        'name_company': name_company,
        'description': descripcion_post.text,
        'url_post': urlPost,
        'published_date' : getDate(fecha_post.text),
        'latest' : latest_post,
        'id_descarga': id_descarga
    }
    # print("guardando post en base de datos")
    mycursor.execute(sqlPost, post_values)
    # mydb.commit()


def insertCommentsCompany(mycursor, id_post, fecha_comentario, contenido, id_user):
    sqlComment = ("INSERT INTO comments "
                        "(idPost, published_date, comment,sentiment,id_user) "
                        "VALUES (%(idPost)s, %(published_date)s, %(comment)s, %(sentiment)s,%(id_user)s)")
    comment_values = {
        'idPost': id_post,
        'published_date' : getDate(fecha_comentario),
        'comment' : contenido,
        'sentiment' : sentimentAnalysis(contenido),
        'id_user' : id_user
    }
    mycursor.execute(sqlComment, comment_values)
    # mydb.commit()

def insertReactionsCompany(mycursor, id_post, tipo_reaccion, id_user):
    sqlReaction = ("INSERT INTO reactions "
                        "(idPost, reaction, id_user) "
                        "VALUES (%(idPost)s, %(reaction)s, %(id_user)s)")
    reaction_values = {
        'idPost': id_post,
        'reaction' : tipo_reaccion,
        'id_user' : id_user
    }
    mycursor.execute(sqlReaction, reaction_values)
    # mydb.commit()
    


def insertFollowersCompany(mycursor, id_company, nombre, cargo, fecha, url_user):
    sqlFollower= ("INSERT INTO followers "
            "(idCompany, name, job, date_follow, url_user) "
            "VALUES (%(idCompany)s, %(name)s, %(job)s, %(date_follow)s, %(url_user)s)")
    follower_values = {
        'idCompany': id_company,
        'name': nombre,
        'job': cargo,
        'date_follow': dateStrToISODate(fecha),
        'url_user': url_user
    }
    mycursor.execute(sqlFollower, follower_values)
    # mydb.commit()


def insertUser(mycursor, id_company, name, job, pais, locacion, number_followers, url_user):
    try:
        sqlUser = ("INSERT INTO users "
                    "(idCompany, name, country, location, job, number_followers,url_user) "
                    "VALUES (%(idCompany)s, %(name)s, %(country)s, %(location)s, %(job)s, %(number_followers)s, %(url_user)s)")
        user_values = {
            'idCompany': id_company,
            'name': name,
            'job': job,
            'country': pais,
            'location': locacion,
            'number_followers' : number_followers,
            'url_user' : url_user
        }
        mycursor.execute(sqlUser, user_values)
        # mydb.commit()
        
    except:
        sqlUser = ("INSERT INTO users "
                    "(idCompany, name, job, number_followers,url_user) "
                    "VALUES (%(idCompany)s, %(name)s, %(job)s, %(number_followers)s, %(url_user)s)")
        user_values = {
            'idCompany': id_company,
            'name': name,
            'job': job,
            'number_followers' : number_followers,
            'url_user' : url_user
        }
        mycursor.execute(sqlUser, user_values)
        # mydb.commit()

def getIdUser( url_user, mycursor):
 
    try:
        query = "SELECT id_user from users where url_user='"+url_user+"';"
        mycursor.execute(query)
        myresult = mycursor.fetchall()

        return (myresult[0])[0]
    except:
        print("usuario no encontrado")
        return ""

def insertEducationUser(id_user, dict_educations, mycursor):
    
    for key in dict_educations:
        string_degrees = dict_educations[key]
        insertEducationInstitution( id_user, key, mycursor)

        # id de tabla education institution
        id_institution_user = mycursor.lastrowid
        insertEducationDegree( id_institution_user, string_degrees, mycursor)


def insertEducationInstitution( id_user, string_institution, mycursor):
    string_institution = string_institution.replace("'","")

    sql = "Insert into education_institution(id_user, institution) values ('{}','{}');".format(id_user, string_institution)
    mycursor.execute(sql)
    

def insertEducationDegree( id_institution, list_degrees, mycursor):

    for degree in list_degrees:
        degree = degree.replace("'","")
        sqlUser = "Insert into education_degree(id_institution_user, degree) values('{}', '{}')".format(id_institution, degree)
        mycursor.execute(sqlUser)
   
    


def insertExperienceUser( id_user, dict_experiences, mycursor):
    for key in dict_experiences:
        string_experiences = dict_experiences[key]
        insertExperineceLocation( id_user, key, mycursor)
        id_experience_location = mycursor.lastrowid

        insertExperienceWork( id_experience_location, string_experiences, mycursor)

def insertExperineceLocation( id_user, location, mycursor):
    location = location.replace("'","")
    # try:
    sql = "Insert into experience_location(id_user, company) values ('{}','{}');".format(id_user, location)
    mycursor.execute(sql)
    # except:
    #     print("no se ha podido guardar ubicacion experiencia laboral")


def insertExperienceWork( id_experience_location, list_jobs, mycursor):
    # try:
    for job in list_jobs:
        job = job.replace("'","")
        sql = "Insert into experience_work(id_experience_location, job) values ('{}','{}');".format(id_experience_location, job)
        mycursor.execute(sql)
    # except:
        # print("no se ha podido guarda cargo experiencia laboral")
# def getIdEducationInstitutionUser(id_user, string_institution, mycursor):

#     try:
#         query = "SELECT id_institution FROM education_institution where id_user='{}' and institution='{}';".format(id_user, string_institution)
#         mycursor.execute(query)
#         myresult = mycursor.fetchall()
#         return myresult
#     except:
#         print("id no encontrado")
#         return ""



def isPais(cadena):

    paises = getPaises()

    for pais in paises:
        if pais.lower() in cadena.lower():
            return True;
    return False;



def commitQuery(mydb):
    print("ejecutando commit...")
    mydb.commit()

def rollbackQuery(mydb):
    print("ejecutando rollback...")
    mydb.rollback()

def pageLoad(driver):
    while True:
        print("cargando sitio...")
        if driver.execute_script("return document.readyState")=='complete':
            print("pagina cargada")
            break
        PAUSE_TIME = random.uniform(1, 1.5)
        sleep(PAUSE_TIME)
    

def getDescargas(mycursor, mydb):
    """obtiene las descargas activas"""

    # devuelve id_descarga, fecha_desde, fecha_hasta, fecha_Creacion, fecha_actualizacion, id_company, name_company,  url_company
    query = "SELECT descarga.*, companies.name_company, companies.url_Company FROM descarga JOIN companies ON companies.id_company=descarga.id_Company WHERE descarga.Estado=1 AND companies.Estado=1;"
    mycursor.execute(query)
    myresult = mycursor.fetchall()
    return myresult

def getAccounts(mycursor, mydb):
    """se obtiene array con las cuentas"""
    query = "SELECT * FROM accounts where accounts.Estado=1;"
    mycursor.execute(query)
    myresult = mycursor.fetchall()
    return myresult

def getAccountsCompany(mycursor, mydb, id_descarga):
    """Obtiene las cuentas de linkedin vinculadas al cliente"""
    query = "SELECT accounts.* FROM accounts JOIN clientes ON accounts.cliente=clientes.id_cliente JOIN companies ON clientes.id_cliente=companies.cliente JOIN descarga ON companies.id_company=descarga.id_Company WHERE descarga.id_descarga={} AND accounts.Estado=1;".format(id_descarga)
    mycursor.execute(query)
    myresult = mycursor.fetchall()
    return myresult

# url posts


def crearTextBox(driver):
    jsscript = """let inputtext = document.createElement("textarea");
inputtext.textContent = `I'm created`;
inputtext.id = 'custom_id';
let elem = document.getElementById('global-nav')
elem.prepend(inputtext);"""
    driver.execute_script(jsscript)


def pegarClipboard(driver):
    text_area = driver.find_element(By.ID, "custom_id")
    text_area.clear()
    text_area.send_keys(Keys.CONTROL, 'v')


def getClipboard(driver):
    text_area = driver.find_element(By.ID, "custom_id")
    return text_area.get_attribute("value")




class CaptchaException(Exception):
    """[Excepción que es lanzada cuando se detecta un enlace con captcha]

    """
    def __init__(self, url, mensaje=None):
        if(mensaje is None):
            menssaje = "Captcha Exception: {}".format(url)
        super(CaptchaException, self).__init__(mensaje)
















