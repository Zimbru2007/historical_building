from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login', views.login.as_view(), name='login'),
    path('logout', views.login.as_view(), name='logout'),
    path('privacy', views.login.as_view(), name='privacy'),
]