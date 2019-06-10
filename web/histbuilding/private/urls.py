from django.urls import path

from .views import *


urlpatterns = [
    path('', Main.as_view(), name='main_private'),
    path('fonti/', Sources.as_view(), name='sources'),
    path('palazzi/', Building.as_view(), name='private_building'),
    path('palazzi/manageBuilding/', ManageBuilding.as_view(), name='manageBuilding'),
    path('palazzi/sintesi/', BuildingReview.as_view(), name='buildingReview'),
    path('uploadImage/', UploadImage.as_view(), name='uploadImage'),
    path('edifici_comunali/', CityBuilding.as_view(), name='city_building'),
    path('luoghi/', Location.as_view(), name="location"),
    path('configurazione/', Configuration.as_view(), name='configuration'),
    path('configurazione/defineFormSource/', DefineFormSource.as_view(), name='defineFormSource'),
    path('configurazione/editTranslation/', EditTranslation.as_view(), name='editTranslation'),
    path('configurazione/updateTranslation/', UpdateTranslation.as_view(), name='updateTranslation'),
    path('luoghi/manageLocation/', ManageLocation.as_view(), name='manageLocation'),
    path('edifici_comunali/manageCityBuilding/', ManageCityBuilding.as_view(), name='manageCityBuilding'),
    
]