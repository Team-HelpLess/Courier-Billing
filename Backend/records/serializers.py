from rest_framework_simplejwt.serializers import serializers
from .models import RecordModel

class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordModel
        fields = "__all__"