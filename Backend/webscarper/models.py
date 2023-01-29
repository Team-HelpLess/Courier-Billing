from django.db import models

class DRSRecordModel(models.Model):
    courier_number = models.IntegerField("Courier Number", primary_key=True, unique=True)
    drs_data = models.TextField("DRS Details")
    created_at = models.DateTimeField("Created At", auto_now_add=True)
