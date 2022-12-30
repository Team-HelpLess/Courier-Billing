from rest_framework import viewsets
from rest_framework.response import Response
from records.models import RecordModel
from .excel.excel import Excel

class ExcelView(viewsets.ViewSet):
    def get_excel(self, request):
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