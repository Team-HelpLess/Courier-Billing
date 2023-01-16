from django.db import models


class RecordModel(models.Model):
    courier_number = models.IntegerField(
        "Courier Number", primary_key=True, unique=True
    )
    courier_type = models.CharField("Courier Type", max_length=6, default="cash")
    courier_company = models.CharField(
        "Courier Company", max_length=6, default="anjani"
    )
    from_company = models.CharField("From Company", max_length=50)
    to_company = models.CharField("To Company", max_length=50)
    to_destination = models.CharField("To Destination", max_length=20)
    courier_weight = models.FloatField("Courier Weight", default=100)
    courier_rate = models.PositiveSmallIntegerField("Courier Rate", default=40)
    phone_no = models.BigIntegerField("Phone Number", blank=True, null=True)
    booked_date = models.DateField("Booked Date", auto_now=True)
    booked_time = models.TimeField("Booked Time", auto_now=True)
