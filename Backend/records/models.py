from django.db import models


class CompanyModel(models.Model):
    company_name = models.CharField(max_length=50, primary_key=True)
    is_it_from_company = models.BooleanField()
    phone_no = models.BigIntegerField("Phone Number", null=True)
    company_destination = models.CharField(max_length=20, default='erode')
    to_companies = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='to_companies_set')
    from_companies = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='from_companies_set')

    def __str__(self):
        return self.company_name

class RecordModel(models.Model):
    courier_number = models.IntegerField(
        "Courier Number", primary_key=True, unique=True
    )
    courier_type = models.CharField("Courier Type", max_length=6, choices=[('cash', 'cash'), ('credit', 'credit')], default="cash")
    courier_company = models.CharField("Courier Company", max_length=6, choices=[('akash', 'akash'), ('anjani', 'anjani')], default="akash")
    from_company = models.OneToOneField(CompanyModel, on_delete=models.CASCADE, related_name='from_company', null=True, blank=True)
    to_company = models.OneToOneField(CompanyModel, on_delete=models.CASCADE, related_name='to_company', null=True, blank=True)
    to_destination = models.CharField("To Destination", max_length=20)
    courier_weight = models.FloatField("Courier Weight", default=100)
    courier_rate = models.PositiveSmallIntegerField("Courier Rate", default=40)
    phone_no = models.BigIntegerField("Phone Number", null=True)
    booked_date = models.DateField("Booked Date", auto_now=True)
    booked_time = models.TimeField("Booked Time", auto_now=True)
    is_paid = models.BooleanField("Is Paid", default=False)

    def __str__(self):
        return str(self.courier_number)
