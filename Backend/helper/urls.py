from django.urls import path
from .views import *

urlpatterns = [
    path('excel/', ExcelView.as_view({'post':'get_excel'}), name="get_excel"),
    path('wam/', WhatsAppView.as_view({'post':'recieved_message'}), name="recieved_message"),
]
