from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from rest_framework import status
import json
from .models import DRSRecordModel
from .serializers import DRSRecordSerializer
import os
from celery import shared_task

def akash_webscraper(cn, driver):
    try:
        driver.get("http://agconline.in/")
        user_id = driver.find_element(By.XPATH, "//*[@id='txtUserID']")
        user_id.send_keys(os.environ['AKASH_USER_ID'])
        password = driver.find_element(By.XPATH, "//*[@id='txtPassword']")
        password.send_keys(os.environ['AKASH_PASSWORD'])
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "cmdLogin")))
        button.click()
        driver.execute_script(
            f"window.open('Status_DocMulti.aspx?No={cn}&Tmp=(new Date()).getTime()', '_blank', '', false);"
        )
        tabs = driver.window_handles
        driver.switch_to.window(tabs[1])
        if WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//*[@id='lblStatus']"))).text == "Document Not Found...":
            return {"Error": "Document Not Found..."}, status.HTTP_404_NOT_FOUND
        details = {'detail': []}
        table = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='EntryTbl']")))
        details['title'] = table.find_element(By.TAG_NAME, "td").text
        rows = table.find_elements(By.TAG_NAME, "tr")
        for row in rows[4:]:
            temp = {}
            columns = row.find_elements(By.TAG_NAME, "td")
            for index, column in enumerate(columns):
                temp[rows[2].find_elements(By.TAG_NAME, "td")[
                    index].text] = column.text
            details['detail'].append(temp)
        return details
    except Exception as e:
        return {e}

def anjani_webscraper(cn, driver):
    try:
        driver.get("http://www.anjanicourier.in/")
        user_id = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='txtUserID']")))
        user_id.send_keys(os.environ['ANJANI_USER_ID'])
        password = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='txtPassword']")))
        password.send_keys(os.environ['ANJANI_PASSWORD'])
        button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='cmdLogin']")))
        button.click()
        driver.execute_script(
            f"window.open('Status_Doc.aspx?No={cn}&Tmp=(new Date()).getTime()', '_blank', '', false)")
        tabs = driver.window_handles
        driver.switch_to.window(tabs[1])
        if WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id='lblStatus']"))).text == "NOT FOUND":
            return {"Error": "Document Not Found..."}, status.HTTP_404_NOT_FOUND
        details = {'detail': []}
        details['title'] = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
            (By.XPATH, "//*[@id='EntryTbl']/tbody/tr[1]/td"))).text
        table = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='EntryTbl']")))
        rows = table.find_elements(By.TAG_NAME, "tr")
        for row in rows[4:len(rows)-5]:
            temp = {}
            columns = row.find_elements(By.TAG_NAME, "td")
            for index, column in enumerate(columns):
                temp[rows[2].find_elements(By.TAG_NAME, "td")[
                    index].text] = column.text
            details['detail'].append(temp)
        return details
    except Exception as e:
        return {e}

@shared_task()
def drs_scrapper(cn):
    if len(str(cn)) in [9, 10]:
        try: 
            record = DRSRecordModel.objects.get(courier_number=cn)
            serializer = DRSRecordSerializer(record)
            return json.loads(serializer['drs_data'])
        except DRSRecordModel.DoesNotExist:

            # Selenium Settings
            options = webdriver.ChromeOptions()
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            driver = webdriver.Remote(
                command_executor='http://selenium:4444',
                options=options
            )

            if len(str(cn)) == 9:
                result = akash_webscraper(cn, driver)
            else:
                result = anjani_webscraper(cn, driver)
            driver.quit()

            serializer = DRSRecordSerializer(courier_number=cn, drs_data=result)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            
        return result

    else:
        return f"Invalid Courier Number {cn}", status.HTTP_404_NOT_FOUND
