from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .serializers import *


class MyTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24 * 2
            response.set_cookie(
                "refresh",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = MyTokenObtainPairSerializer


class MyTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24 * 2
            response.set_cookie(
                "refresh",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = MyTokenRefreshSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"Logout": "Successfullly"})


class CleanUp(viewsets.ViewSet):
    def clean_up(self, request):
        BlacklistedToken.objects.filter(token__expires_at__lt=timezone.now()).delete()
        OutstandingToken.objects.filter(expires_at__lt=timezone.now()).delete()
        return Response({"reponse": "done"})
