from django.urls import path

from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', logout, name='logout'),
    path('privacy/', privacy, name='privacy'),
    path('palazzi/', ListBuildings.as_view(), name='list_buildings'),
    path('palazzi/<str:building_slug>/', Building.as_view(), name='building')
]