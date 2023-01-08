from django.urls import path
from .views import *

urlpatterns = [
    path('drs/<cn>/', WebScrapperView.as_view({'get':'find_drs'}), name="find_drs"),
]
