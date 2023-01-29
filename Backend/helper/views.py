from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.response import Response
from records.models import RecordModel
from .excel.excel import Excel
from .sendings.whatsapp import WhatsApp
from .sendings.mail import Mail

class MailView(viewsets.ViewSet):
    def send_mail(self, request, type="monthly"):
        if type == "monthly":
            try:
                Excel(
                    RecordModel=RecordModel,
                    credit_record=request.data["credit_record"],
                    cash_record=request.data["cash_record"],
                )
            except:
                Excel(
                    RecordModel=RecordModel,
                )
            return Response({"reponse": "done"})
        elif type == "tctd":
            Mail.tctd_mail()
            return Response({"reponse": "done"})

class WhatsAppView(viewsets.ViewSet):
    def recieved_message(self, request):
        response = WhatsApp.recieved_message_handler(from_number=request.data['From'][12:], data=request.data['Body'])
        return HttpResponse(response)