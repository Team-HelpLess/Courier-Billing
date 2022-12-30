import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()


def send_wa_message(mobile_number):

    url = f"https://graph.facebook.com/v15.0/{os.getenv('PHONE_NUMBER_ID')}/messages"
    header = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('WHATSAPP_TOKEN')}",
    }
    data = {
        "messaging_product": "whatsapp",
        "to": f"{mobile_number}",
        "type": "template",
        "template": {"name": "hello_world", "language": {"code": "en_US"}},
    }

    req = requests.post(url=url, headers=header, data=json.dumps(data))

    if req.status_code == 200:
        print("Message send")
    else:
        print("Message not send:", req.text)


send_wa_message(919976462794)
