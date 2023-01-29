from django.urls import path
from .views import *

urlpatterns = [
    path('mail/<type>/', MailView.as_view({'post':'send_mail'}), name="send_mail"),
    path('wam/', WhatsAppView.as_view({'post':'recieved_message'}), name="recieved_message"),
]
