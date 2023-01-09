
from django.urls import path
from .views import *
  
urlpatterns = [
    path('api/', RecordView.as_view({'get':'get'}), name="get"),
    path('api/', RecordView.as_view({'post':'post'}), name="post"),
    path('api/update/', RecordView.as_view({'put':'update'}), name="update"),
    path('api/delete/<cn>/', RecordView.as_view({'delete':'delete'}), name="delete"),
    path('api/find/<cn>/', RecordView.as_view({'get':'find_by_courier_no'}), name="find_by_courier_no"),
    path('api/find_many/', RecordView.as_view({'post':'find_many'}), name="find_many"),

    path('', APIRoot.as_view(), name='api_view')
]
