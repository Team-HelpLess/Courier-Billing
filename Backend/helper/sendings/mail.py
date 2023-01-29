from django.core.mail import EmailMessage
from django.conf import settings


class Mail:
    def montly_mail(credit_record: int = 1, cash_record: int = 1):
        mail = EmailMessage(
            "Montly Mail",
            "Excel file with all records with last momth",
            settings.EMAIL_HOST_USER,
            ["ameer03062003@gmail.com"],
        )
        if cash_record:
            mail.attach_file(r"./helper/excel/CashRecord.xlsx")
        if credit_record:
            mail.attach_file(r"./helper/excel/CreditRecord.xlsx")
        mail.send()

    def tctd_mail():
        mail = EmailMessage(
            "tctd file",
            "copy it to your local",
            settings.EMAIL_HOST_USER,
            ["ameer03062003@gmail.com"],
        )
        mail.attach_file(r"./records/csv_data/tctd.csv")
        mail.send()
