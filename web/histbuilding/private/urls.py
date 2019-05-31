from django.urls import path

from .views import *


urlpatterns = [
    path('', Main.as_view(), name='main_private'),
    path('fonti/', Sources.as_view(), name='sources'),
    path('palazzi/', Building.as_view(), name='building'),
    path('configurazione/', Configuration.as_view(), name='configuration'),
    path('configurazione/defineFormSource/', DefineFormSource.as_view(), name='defineFormSource')
]