import os
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from time import sleep


def main():
    # capabilities = webdriver.DesiredCapabilities.CHROME.copy()
    
    #driver = webdriver.Remote(
    #    command_executor="http://selenium:4444/wd/hub",
    #    desired_capabilities=capabilities
    #)

    is_docker = os.environ.get('ISDOCKER')

    if is_docker:
        print("Detectado docker")
    else:
        print("Docker no detectado")

    options = Options()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Remote(
        command_executor='http://selenium:4444',
        options=options
    )

    driver.get("https://www.google.com")
    
    search_input_box = driver.find_element(By.NAME, "q")
    
    search_input_box.send_keys("selenium webdriver" + Keys.ENTER)
    
    sleep(3)
    
    driver.quit()
    print("prueba ok!")


if __name__ == '__main__':
    main()
