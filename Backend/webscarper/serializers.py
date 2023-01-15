from rest_framework_simplejwt.serializers import serializers
from .models import DRSRecordModel

class DRSRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DRSRecordModel
        fields = "__all__"