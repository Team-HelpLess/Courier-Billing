import random
import requests

choice = int(input("Choice: "))

headers = {
    "Authorization": "Bearer "
    + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjcyNTgxMTMyLCJpYXQiOjE2NzI1NjMxMzIsImp0aSI6ImE3ZThiN2E0ZjA0OTRmODQ5NmExNzNiN2UyY2U0MTNiIiwidXNlcl9pZCI6MSwidXNlcm5hbWUiOiIxMTExIiwiZW1haWwiOiJhbWVlcjAzMDYyMDAzQGdtYWlsLmNvbSJ9.uI9eLkDM1QcGwjxNNm9CXCJ8faN0ehtGIir0qBDOPyo"
}
url = "http://127.0.0.1:8000/"

while choice:
    if choice == 1:
        for i in range(500):

            data = {
                "courier_number": random.randint(100000000, 999999999),
                "courier_type": random.choice(["cash", "credit"]),
                "courier_company": random.choice(["akash", "anjani"]),
                "from_company": random.choice(
                    ["nn", "rr", "sgm", "mcm", "ktm", "st", "ve", "gtm", "ref", "jg"]
                ),
                "to_company": random.choice(
                    ["nn", "rr", "sgm", "mcm", "ktm", "st", "ve", "gtm", "ref", "jg"]
                ),
                "to_destination": random.choice(
                    ["delhi", "chennai", "coimbatore", "madurai", "surat", "mumbai", "kolkata",
                        "pali", "kanpur", "lucknow",]
                ),
                "courier_weight": random.randint(100, 50000) * 1.1,
                "courier_rate": random.randint(40, 20000),
            }

            response = requests.post(url=url + "api/", headers=headers, data=data)
            print(i, response, response.text)

        choice = int(input("Choice: "))

    elif choice == 2:
        data = {
            "credit_record": 1,
            "cash_record": 1,
        }
        response = requests.post(url=url + "excel/", headers=headers)
        print(response, response.text)
        choice = int(input("Choice: "))

    elif choice == 3:
        for i in range(1):
            data = {
                "courier_number": random.randint(100000000, 999999999),
                "courier_company": random.choice(["akash", "anjani"]),
            }
            response = requests.post(url=url + "drs/", headers=headers, data=data)
            print(response, response.text)
        choice = int(input("Choice: "))
