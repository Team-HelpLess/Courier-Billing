from django.urls import path
from .views import *

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name="auth_register"),
    path('api/token/obtain/', MyTokenObtainPairView.as_view(), name="token_obtain"),
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name="token_refresh"),
    path('api/logout/', LogoutView.as_view(), name="logout"),

    path('cleanup/', CleanUp.as_view({'post': 'clean_up'}), name="clean_up"),
]
