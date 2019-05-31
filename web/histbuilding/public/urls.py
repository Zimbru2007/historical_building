from django.urls import path

from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('login', Login.as_view(), name='login'),
    path('logout', logout, name='logout'),
    path('privacy', privacy, name='privacy'),
]