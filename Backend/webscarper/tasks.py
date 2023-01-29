from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from rest_framework import status
import json
from .models import DRSRecordModel
from .serializers import DRSRecordSerializer
from django.utils import timezone
import datetime
import os
from celery import shared_task

def akash_webscraper(cn, driver):
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
        return {"Error": "Document Not Found..."}
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

def anjani_webscraper(cn, driver):
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
        return {"Error": "Document Not Found..."}
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

@shared_task()
def drs_scrapper(cn):
    if len(str(cn)) in [9, 10]:
        record = DRSRecordModel.objects.all().filter(courier_number=cn)

        if len(record) == 0 or (timezone.now() - timezone.localtime(record[0].created_at)).total_seconds()/3600 > 1:

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

            if len(record) == 0:
                serializer = DRSRecordSerializer(data={"courier_number":cn, "drs_data":str(result)})
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
            else:
                serializer = DRSRecordSerializer(record[0], data={"courier_number":cn, "drs_data":str(result), "created_at":datetime.datetime.now()})
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
            
            return result
        serializer = DRSRecordSerializer(record[0])
        return json.loads(serializer.data['drs_data'].replace("\'", "\""))
    else:
        return f"Invalid Courier Number {cn}"
