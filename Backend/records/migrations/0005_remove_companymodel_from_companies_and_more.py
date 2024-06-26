# Generated by Django 4.1.4 on 2023-02-27 10:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("records", "0004_companymodel_is_it_cash"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="companymodel",
            name="from_companies",
        ),
        migrations.RemoveField(
            model_name="companymodel",
            name="to_companies",
        ),
        migrations.RemoveField(
            model_name="recordmodel",
            name="phone_no",
        ),
        migrations.AlterField(
            model_name="companymodel",
            name="is_it_cash",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="companymodel",
            name="is_it_from_company",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="companymodel",
            name="phone_no",
            field=models.BigIntegerField(
                blank=True, null=True, verbose_name="Phone Number"
            ),
        ),
        migrations.AlterField(
            model_name="recordmodel",
            name="from_company",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="from_company",
                to="records.companymodel",
            ),
        ),
        migrations.AlterField(
            model_name="recordmodel",
            name="to_company",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="to_company",
                to="records.companymodel",
            ),
        ),
    ]
