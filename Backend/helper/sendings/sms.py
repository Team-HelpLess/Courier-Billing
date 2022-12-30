from twilio.rest import Client
from dotenv import load_dotenv
import os
import time

load_dotenv()

# Message using fast2SMS
# class SMS:
#     def daily_SMS(self):

#         url = "https://www.fast2sms.com/dev/bulkV2"

#         header = {
#             "authorization": os.getenv("Fast2SMS_API_KEY"),
#         }

#         body = {
#             "route" : "v3",
#             "sender_id" : "FTWSMS",
#             "message" : "test",
#             "language" : "english",
#             "flash" : 0,
#             "numbers" : "9080170553"
#         }

#         response = requests.post(url=url, headers=header, data=body)
#         print(response, response.text)


class SMS:
    def daily_SMS(self, record, to_number: str):
        client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
        message = client.messages.create(
            body=f"{'Akash Courier Service:' if record.courier_company == 'akash' else 'Anjani Courier Service:'}\nYour Courier Booked on {record.booked_date} at {record.booked_time}\n\nDetails:\nCourier Number: {record.courier_number}\nFrom: {record.from_company} - Erode\nTo: {record.to_company} - {record.to_destination}\nWeight: {record.courier_weight}\nRate: {record.courier_rate}",
            messaging_service_sid=os.getenv("TWILIO_MESSAGING_SERVICE_SID"),
            from_="+18655072605",
            to=to_number,
        )
        if (message.error_message == None) and (message.status == "queued"):
            return 1
        else:
            return 0


if __name__ == "__main__":
    obj = SMS()
    obj.daily_SMS("test", "+919080170553")
