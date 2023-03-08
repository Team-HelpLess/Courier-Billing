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

class CompanyManipulation:
    def create_company(company_name, is_it_from_company, is_it_cash, phone_no, company_destination):
        '''Create a company'''
        company_serializer = CompanySerializer(data={'company_name': company_name, 'is_it_from_company': is_it_from_company, 'is_it_cash': is_it_cash, 'phone_no': phone_no, 'company_destination': company_destination})
        if company_serializer.is_valid(raise_exception=True):
            company_serializer.save()
    
    def create_or_get_company(company_name, is_it_from_company, is_it_cash, phone_no, company_destination):
        '''Create a company if it doesn't exist else return the company'''
        try:
            company = CompanyModel.objects.get(company_name=company_name.strip().lower().replace(" ", "_"))
        except CompanyModel.DoesNotExist:
            CompanyManipulation.create_company(company_name, is_it_from_company, is_it_cash, phone_no, company_destination)
            company = CompanyModel.objects.get(company_name=company_name.strip().lower().replace(" ", "_"))
        return company

    def create_or_update_company(company_name, is_it_from_company, is_it_cash, phone_no, company_destination):
        '''Create a company if it doesn't exist else update the company'''
        try:
            company = CompanyModel.objects.get(company_name=company_name.strip().lower().replace(" ", "_"))
            company_serializer = CompanySerializer(company, data={'company_name': company_name, 'is_it_from_company': is_it_from_company, 'is_it_cash': is_it_cash, 'phone_no': phone_no, 'company_destination': company_destination})
            if company_serializer.is_valid(raise_exception=True):
                company = company_serializer.save()
        except CompanyModel.DoesNotExist:
            CompanyManipulation.create_company(company_name, is_it_from_company, is_it_cash, phone_no, company_destination)
        
        return CompanyModel.objects.get(company_name=company_name.strip().lower().replace(" ", "_"))

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
            from_company = CompanyManipulation.create_or_get_company(request.data['from_company'], True, True if request.data['courier_type'] == 'cash' else False, request.data.get('from_company_phone_no'), 'erode')
            to_company = CompanyManipulation.create_or_get_company(request.data['to_company'], False, True if request.data['courier_type'] == 'cash' else False, request.data.get('to_company_phone_no'), request.data['to_destination'])

            serializer = RecordSerializer(
                data={
                    'courier_number': request.data['courier_number'],
                    'courier_type': request.data['courier_type'],
                    'courier_company': request.data['courier_company'],
                    'from_company': from_company,
                    'to_company': to_company,
                    'to_destination': request.data['to_destination'],
                    'courier_weight': 100 if request.data.get('courier_weight') == None else request.data['courier_weight'],
                    'courier_rate': 40 if request.data.get('courier_rate') == None else request.data['courier_rate'],
                    'is_paid': False if request.data.get('is_paid') == None else request.data['is_paid'],
                }
            )
            if serializer.is_valid(raise_exception=True):
                serializer.save()

            if request.data['send_sms']:
                sms = SMS()
                record = RecordModel.objects.get(courier_number=request.data['courier_number'])

                if sms.daily_SMS(record, from_company.phone_no) and sms.daily_SMS(record, request.data['to_company_phone_no']):
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
            from_company = CompanyManipulation.create_or_get_company(request.data['from_company'], True, True if request.data['courier_type'] == 'cash' else False, request.data.get('from_company_phone_no'), 'erode')
            to_company = CompanyManipulation.create_or_get_company(request.data['to_company'], False, True if request.data['courier_type'] == 'cash' else False, request.data.get('to_company_phone_no'), request.data['to_destination'])

            record = get_object_or_404(RecordModel, courier_number=request.data['courier_number'])

            if request.data.get('n_courier_number') == None:
                serializer = RecordSerializer(record, data={
                    'courier_number': request.data['courier_number'],
                    'courier_type': request.data['courier_type'],
                    'courier_company': request.data['courier_company'],
                    'from_company': from_company,
                    'to_company': to_company,
                    'to_destination': request.data['to_destination'],
                    'courier_weight': 100 if request.data.get('courier_weight') == None else request.data['courier_weight'],
                    'courier_rate': 40 if request.data.get('courier_rate') == None else request.data['courier_rate'],
                    'is_paid': False if request.data.get('is_paid') == None else request.data['is_paid'],
                    'booked_date': record.booked_date,
                    'booked_time': record.booked_time,
                })
            else:
                serializer = RecordSerializer(record, data={
                    'courier_number': request.data['n_courier_number'],
                    'courier_type': request.data['courier_type'],
                    'courier_company': request.data['courier_company'],
                    'from_company': from_company,
                    'to_company': to_company,
                    'to_destination': request.data['to_destination'],
                    'courier_weight': 100 if request.data.get('courier_weight') == None else request.data['courier_weight'],
                    'courier_rate': 40 if request.data.get('courier_rate') == None else request.data['courier_rate'],
                    'is_paid': False if request.data.get('is_paid') == None else request.data['is_paid'],
                    'booked_date': record.booked_date,
                    'booked_time': record.booked_time,
                })
                record.delete()

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
