from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
from records.models import RecordModel
from records.serializers import RecordSerializer
from webscarper.tasks import drs_scrapper
from datetime import datetime
import os

class WhatsApp:
    def send_record(ph_no:int) -> None:
        client = Client(os.environ['TWILIO_ACCOUNT_SID'], os.environ['TWILIO_AUTH_TOKEN'])

        client.messages.create(
                            from_='whatsapp:+18655072605',
                            body='Your appointment is coming up on July 21 at 3PM',
                            to=f'whatsapp:+{ph_no}'
                        )

    def recieved_message_handler(from_number:int, data:str) -> str:
        response = MessagingResponse()
        response_message = response.message()
        responsed = 0
        if data.lower() in ('hello', 'hi'):
            response_message.body('Hi There,\nThis is an automated message, Send **help** to know about commands\nThankyou for contacting us')
            responsed = 1
        elif data.lower() is 'help':
            response_message.body('Send **date(dd.mm.yyyy)**: All the records booked on the specific date from your number will be sent\nSend **courier_number(nnnnnnnnnn)**: Details about specific record will be sent')
            responsed = 1
        elif len(data.split('.')) == 3:
            try:
                date = datetime.strptime(data, '%d.%m.%Y').date()
                records = RecordModel.objects.filter(booked_date=date, phone_no=from_number)
                serializers = RecordSerializer(records, many=True)
                response_message.body(serializers.data)
                responsed = 1
            except Exception:
                response_message.body('Invalid date.\nCorrect format is **dd.mm.yyyy**')
                responsed = 1
        elif len(data) in (9, 10):
            try:
                record = RecordModel.objects.get(phone_no=from_number, courier_number=int(data))
                serializer = RecordSerializer(record)
                response_message.body(f"{serializer.data}\n\n{'-'*50}\n\n")
            except RecordModel.DoesNotExist:
                response_message.body(f"You didn't book any courier with this courier number\n\n{'-'*50}\n\n")
            record = drs_scrapper(int(data))
            if len(record) == 2:
                response_message.body("DRS Not!!")
            elif len(record) == 1:
                response_message.body(f"DRS Dtails:\n{record}")
        elif not responsed:
            response_message.body('Sorry!,\nThis is not a valid message!!\nType **help** to know valid commands')

        return str(response)
