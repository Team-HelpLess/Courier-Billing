from rest_framework import viewsets
from rest_framework.response import Response
from .tasks import drs_scrapper

class WebScrapperView(viewsets.ViewSet):
    def find_drs(self, request, cn):
        response = drs_scrapper(cn)
        return Response(response[0], status=response[1] if len(response) == 2 else response)