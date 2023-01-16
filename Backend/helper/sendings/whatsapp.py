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
            response_message.body('Hi There,\nThis is an automated message, Send *help* to know about commands\nThankyou for contacting us')
            responsed = 1
        elif data.lower() == 'help':
            response_message.body('Send *date(dd.mm.yyyy)*: All the records booked on the specific date from your number will be sent\nSend *courier_number(nnnnnnnnnn)*: Details about specific record will be sent')
            responsed = 1
        elif len(data.split('.')) == 3:
            try:
                date = datetime.strptime(data, '%d.%m.%Y').date()
                records = RecordModel.objects.filter(booked_date=date, phone_no=from_number)
                serializers = RecordSerializer(records, many=True)
                response_message.body(f"*Totally {len(records)} records booked on {date}*")
                for i in serializers.data:
                    response_message.body(f"Courier Number : {i['courier_number']} To : {i['to_company']}, {i['to_destination']}")
                responsed = 1
            except Exception as e:
                response_message.body('Invalid date.\nCorrect format is *dd.mm.yyyy*')
                responsed = 1
        elif len(data) in (9, 10) and data.isdigit():
            try:
                response_message.body("*Booked Courier Details")
                record = RecordModel.objects.get(phone_no=from_number, courier_number=int(data))
                serializer = RecordSerializer(record)
                response_message.body(f":\n\nCourier Number : {serializer.data['courier_number']}\nCourier Type : {serializer.data['courier_type']}\nCourier Company : {serializer.data['courier_company']}\nFrom Company : {serializer.data['from_company']}\nTo Company : {serializer.data['to_company']}\nCourier Weight : {serializer.data['courier_weight']}\nCourier Rate : {serializer.data['courier_rate']}\nPhone Number : {serializer.data['phone_no']}\nBooked Date : {serializer.data['booked_date']}\nBooked Time : {serializer.data['booked_time']}\n{'-'*65}")
            except RecordModel.DoesNotExist:
                response_message.body(f"You didn't book any courier with this courier number\n{'-'*65}")
            record = drs_scrapper(int(data))
            if 'title' in record:
                response_message.body("\n*DRS Tracking Details*")
                if len(data) == 10:
                    response_message.body(f":\n\nMFAX/PKG : {record['detail'][-1]['MFAX/PKG.']}\nType : {record['detail'][-1]['Type']}\nBranch : {record['detail'][-1]['Branch']}\nDate : {record['detail'][-1]['Date']}\nTime : {record['detail'][-1]['Time']}")
                elif len(data) == 9:
                    response_message.body(f":\n\nType : {record['detail'][-1]['Type']}\nUpload By : {record['detail'][-1]['Upload By']}\nDate : {record['detail'][-1]['Date']}\nTime : {record['detail'][-1]['Time']}\nOrigin --> Dest.City : {record['detail'][-1]['Origin --> Dest.City']}\nWeight : {record['detail'][-1]['Weight']}\nOut Station : {record['detail'][-1]['Out Station']}\nDescription : {record['detail'][-1]['Description']}")
                response_message.body(f".\n\nClick this link for more details:\n{os.environ['BACKEND_URL']}drs/{data}/")
                responsed = 1
            else:
                response_message.body("\n*DRS Not Found*")
                responsed = 1
        if not responsed:
            response_message.body('Sorry!,\nThis is not a valid message!!\nType *help* to know valid commands')

        return str(response)
