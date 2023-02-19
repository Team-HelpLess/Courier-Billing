from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from helper.sendings.sms import SMS
from .models import RecordModel, CompanyModel
from .serializers import RecordSerializer, CompanySerializer
import csv
import os

class PageSetPagination(PageNumberPagination):
    '''Pagination for RecordList, for now it's 30 records per page'''
    page_size = 30

class RecordView(viewsets.ViewSet):
    '''View for Records, Need to be authenticated'''
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        '''Get all records'''
        if request.user.has_perm("records.view_recordmodel"):
            paginator = PageSetPagination()
            records = RecordModel.objects.all()

            if request.query_params.get('page'):
                records = paginator.paginate_queryset(records, request)
                serializer = RecordSerializer(records, many=True, context={'request': request})
                return paginator.get_paginated_response(serializer.data)

            serializer = RecordSerializer(records, many=True, context={'request': request})
            return Response(serializer.data)

        else:
            return Response({"PermissionError": "You don't have permission"})


    def post(self, request):
        '''
        Create a new record
        If send_sms is True, it will send a SMS to the phone_no provided else it will not send a SMS
        The request should be in this format:
        {
            "from_company": "company name",
            "from_company_phone_no": "phone number",
            "to_company": "company name",
            "to_company_phone_no": "phone number",
            "to_destination": "destination",
            "courier_number": "courier number",
            "courier_type": "courier type",
            "courier_weight": "courier weight",
            "courier_rate": "courier rate",
            "send_sms": True/False
        }
        '''
        if request.user.has_perm("records.add_recordmodel"):

            try:
                from_company = CompanyModel.objects.get(company_name=request.data['from_company'])
            except CompanyModel.DoesNotExist:
                from_company_serializer = CompanySerializer(data={'company_name': request.data['from_company'], 'is_it_from_company': True, 'phone_no': request.data['from_company_phone_no']})
                if from_company_serializer.is_valid(raise_exception=True):
                    from_company = from_company_serializer.save()

            try:
                to_company = CompanyModel.objects.get(company_name=request.data['to_company'])
            except CompanyModel.DoesNotExist:
                to_company_serializer = CompanySerializer(data={'company_name': request.data['to_company'], 'is_it_from_company': False, 'phone_no': request.data['to_company_phone_no'], 'company_destination': request.data['to_destination']})
                if to_company_serializer.is_valid(raise_exception=True):
                    to_company = to_company_serializer.save()

            if not from_company.to_companies.filter(company_name=to_company.company_name).exists():
                from_company.to_companies.add(to_company)
            if not to_company.from_companies.filter(company_name=from_company.company_name).exists():
                to_company.from_companies.add(from_company)

            request.data['from_company'] = from_company.company_name
            request.data['to_company'] = to_company.company_name

            serializer = RecordSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()

            if request.data['send_sms']:
                sms = SMS()
                record = RecordModel.objects.get(courier_number=request.data['courier_number'])

                if sms.daily_SMS(record, request.data['from_company_phone_no']) and sms.daily_SMS(record, request.data['to_company_phone_no']):
                        return Response()
                else:
                    return Response({'record':"saved", 'message':"not sent", 'reason':"server error"})
                
            else:
                return Response({'record':"saved", 'message':"not sent", 'reason':"phone number not provided"})
            
        else:
            return Response({"PermissionError": "You don't have permission"})

    def update(self, request):
        '''
        Update a record
        The request should be in this format:
        {
            "from_company": "company name",
            "from_company_phone_no": "phone number",
            "to_company": "company name",
            "to_company_phone_no": "phone number",
            "to_destination": "destination",
            "courier_number": "courier number",
            "courier_type": "courier type",
            "courier_weight": "courier weight",
            "courier_rate": "courier rate",
        }
        '''
        if request.user.has_perm("records.change_recordmodel"):
            record = RecordModel.objects.get(courier_number=request.data['courier_number'])

            try:
                from_company = CompanyModel.objects.get(company_name=request.data['from_company'])
            except CompanyModel.DoesNotExist:
                from_company_serializer = CompanySerializer(data={'company_name': request.data['from_company'], 'is_it_from_company': True, 'phone_no': request.data['from_company_phone_no']})
                if from_company_serializer.is_valid(raise_exception=True):
                    from_company = from_company_serializer.save()

            try:
                to_company = CompanyModel.objects.get(company_name=request.data['to_company'])
            except CompanyModel.DoesNotExist:
                to_company_serializer = CompanySerializer(data={'company_name': request.data['to_company'], 'is_it_from_company': False, 'phone_no': request.data['to_company_phone_no'], 'company_destination': request.data['to_destination']})
                if to_company_serializer.is_valid(raise_exception=True):
                    to_company = to_company_serializer.save()

            if not from_company.to_companies.filter(company_name=to_company.company_name).exists():
                from_company.to_companies.add(to_company)
            if not to_company.from_companies.filter(company_name=from_company.company_name).exists():
                to_company.from_companies.add(from_company)

            request.data['from_company'] = from_company.company_name
            request.data['to_company'] = to_company.company_name
            request.data['booked_date'] = record.booked_date
            request.data['booked_time'] = record.booked_time
            request.data['is_paid'] = record.is_paid

            serializer = RecordSerializer(record, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response()
            
            return Response(serializer.errors, status=400)
        
        else:
            return Response({"PermissionError": "You don't have permission"})

    def delete(self, request, cn=None):
        '''Delete a record'''
        if request.user.has_perm("records.delete_recordmodel"):
            record = get_object_or_404(RecordModel, courier_number=cn)
            serializer = RecordSerializer(record)
            record.delete()
            return Response(serializer.data)
        else:
            return Response({"PermissionError": "You don't have permission"})

    def find_by_courier_no(self, request, cn=None):
        '''Find a record by courier number'''
        if request.user.has_perm("records.view_recordmodel"):
            record = get_object_or_404(RecordModel, courier_number=cn)
            serializer = RecordSerializer(record)
            return Response(serializer.data)
        else:
            return Response({"PermissionError": "You don't have permission"})

    def find_many(self, request):
        '''Find many records by filter'''
        if request.user.has_perm("records.view_recordmodel"):
            paginator = PageSetPagination()

            keys = request.data.keys()
            filters = {}

            if 'from_company' in keys:
                from_company = CompanyModel.objects.get(company_name=request.data['from_company'].strip().lower().replace(' ', '_'))
                filters['from_company'] = from_company
            if 'to_company' in keys:
                to_company = CompanyModel.objects.get(company_name=request.data['to_company'].strip().lower().replace(' ', '_'))
                filters['to_company'] = to_company
            if 'to_destination' in keys:
                filters['to_destination'] = request.data['to_destination']
            if 'courier_type' in keys:
                filters['courier_type'] = request.data['courier_type']
            if 'courier_company' in keys:
                filters['courier_company'] = request.data['courier_company']
            if 'is_paid' in keys:
                filters['is_paid'] = request.data['is_paid']

            records = RecordModel.objects.filter(**filters)
            if request.query_params.get('page'):
                records = paginator.paginate_queryset(records, request)
                serializer = RecordSerializer(records, many=True)
                return paginator.get_paginated_response(serializer.data)
            return Response(serializer.data)
        
        else:
            return Response({"PermissionError": "You don't have permission"})

    def get_company(self, request, con):
        '''Get company by name'''
        if request.user.has_perm("company.view_companymodel"):
            company = get_object_or_404(CompanyModel, company_name=con.strip().lower().replace(' ', '_'))
            serializer = CompanySerializer(company)
            return Response(serializer.data)
        else:
            return Response({"PermissionError": "You don't have permission"})

class APIRoot(APIView):
    def get(self, request):
        return Response(
            {
                " - get": reverse("api_view", request=request),
                "api/register/ - post()": reverse("auth_register", request=request),
                "api/token/obtain/ - post()": reverse("token_obtain", request=request),
                "api/token/refresh/ - post()": reverse("token_refresh", request=request),
                "api/logout/ - post()": reverse("logout", request=request),
                "api/ - get()": reverse("get", request=request),
                "api/ - post()": reverse("post", request=request),
                "api/update/ - update()" : reverse('update', request=request),
                "api/find_many/ - post()": reverse("find_many", request=request),
                "cleanup/ - post()": reverse("clean_up", request=request),
            }
        )
