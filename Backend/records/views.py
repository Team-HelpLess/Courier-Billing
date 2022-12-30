from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from helper.sendings.sms import SMS
from .models import RecordModel
from .serializers import RecordSerializer


class RecordView(viewsets.ViewSet):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        if request.user.has_perm("record.view_recordmodel"):
            records = RecordModel.objects.all()
            serializer = RecordSerializer(records, many=True)
            return Response(serializer.data)
        else:
            return Response({"PermissionError": "You don't have permission"})

    def post(self, request):
        if request.user.has_perm("record.add_recordmodel"):
            serializer = RecordSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            if 'phone_no' in request.data.keys():
                sms = SMS()
                record = RecordModel.objects.get(courier_number=request.data['courier_number'])
                if sms.daily_SMS(record, request.data['phone_no']):
                        return Response()
                else:
                    return Response({'record':"saved", 'message':"not sent", 'reason':"server error"})
            else:
                return Response({'record':"saved", 'message':"not sent", 'reason':"phone number not provided"})
        else:
            return Response({"PermissionError": "You don't have permission"})

    def update(self, request):
        if request.user.has_perm("record.change_recordmodel"):
            record = RecordModel.objects.get(courier_number=request.data['courier_number'])
            serializer = RecordSerializer(record, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response()
            return Response(serializer.errors, status=400)
        else:
            return Response({"PermissionError": "You don't have permission"})

    def delete(self, request, cn=None):
        if request.user.has_perm("record.delete_recordmodel"):
            record = get_object_or_404(RecordModel, courier_number=cn)
            serializer = RecordSerializer(record)
            record.delete()
            return Response(serializer.data)
        else:
            return Response({"PermissionError": "You don't have permission"})

    def find_by_courier_no(self, request, cn=None):
        if request.user.has_perm("record.view_recordmodel"):
            record = get_object_or_404(RecordModel, courier_number=cn)
            serializer = RecordSerializer(record)
            return Response(serializer.data)
        else:
            return Response({"PermissionError": "You don't have permission"})

    def find_many(self, request):
        if request.user.has_perm("record.view_recordmodel"):
            records = RecordModel.objects.all()
            keys = request.data.keys()
            for key in keys:
                if key == "from_company":
                    records = records.filter(from_company=request.data[key])
                    # print(records, request.data["from_company"])
                elif key == "to_company":
                    records = records.filter(to_company=request.data[key])
                    # print(records, request.data["to_company"])
                elif key == "to_destination":
                    records = records.filter(to_destination=request.data[key])
                    # print(records, request.data["to_destination"])
                elif key == "courier_type":
                    records = records.filter(courier_type=request.data[key])
                    # print(records, request.data["courier_type"])
                elif key == "courier_company":
                    records = records.filter(courier_company=request.data[key])
                    # print(records, request.data["courier_company"])
            serializer = RecordSerializer(records, many=True)
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
                # "api/delete/ - delete()": reverse('delete', request=request),
                "api/update/ - update()" : reverse('update', request=request),
                # "api/find/ - get()": reverse('find_by_courier_no', request=request),
                "api/find_many/ - get()": reverse("find_many", request=request),
                "cleanup/ - post()": reverse("clean_up", request=request),
                "excel/ - post()": reverse("get_excel", request=request),
            }
        )
