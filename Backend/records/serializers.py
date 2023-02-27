from rest_framework_simplejwt.serializers import serializers
from .models import RecordModel, CompanyModel

class RecordSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field in ['to_destination']:
            if field in data:
                data[field] = data[field].replace("_", " ").title()
        return data

    def to_internal_value(self, data):
        for field in ['to_destination']:
            if field in data:
                data[field] = data[field].strip().lower().replace(" ", "_")
        return super().to_internal_value(data)

    class Meta:
        model = RecordModel
        fields = "__all__"


class CompanySerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field in ['company_name', 'company_destination']:
            if field in data:
                data[field] = data[field].replace("_", " ").title()
        return data
    
    def to_internal_value(self, data):
        for field in ['company_name', 'company_destination']:
            if field in data:
                data[field] = data[field].strip().lower().replace(" ", "_")
        return super().to_internal_value(data)

    class Meta:
        model = CompanyModel
        fields = "__all__"
