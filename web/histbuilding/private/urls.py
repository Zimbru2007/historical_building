from django.urls import path

from .views import *


urlpatterns = [
    path('', Main.as_view(), name='main_private'),
    path('fonti/', Sources.as_view(), name='sources'),
    path('fonti/listSources/', ListSources.as_view(), name='listSources'),
    path('utenti/', UserCreation.as_view(), name='user_creation'),
    path('profile/', UserProfile.as_view(), name='userProfile'),
    path('elementi/', Element.as_view(), name='element'),
    path('elementi/manageElements/', ManageElements.as_view(), name='manageElements'),
    path('elenco_elementi/', ListElements.as_view(), name='listElements'),
    path('elenco_elementi/manageListElements/', ManageListElements.as_view(), name='manageListElements'),
    path('palazzi/', Building.as_view(), name='private_building'),
    path('palazzi/manageBuilding/', ManageBuilding.as_view(), name='manageBuilding'),
    path('palazzi/sintesi/', BuildingReview.as_view(), name='buildingReview'),
    path('uploadImage/', UploadImage.as_view(), name='uploadImage'),
    path('mainStatistics/', MainStatistics.as_view(), name='mainStatistics'),
    path('edifici_comunali/', CityBuilding.as_view(), name='city_building'),
    path('luoghi/', Location.as_view(), name="location"),
    path('configurazione/', Configuration.as_view(), name='configuration'),
    path('configurazione/defineFormSource/', DefineFormSource.as_view(), name='defineFormSource'),
    path('configurazione/defineFormElement/', DefineFormElement.as_view(), name='defineFormElement'),
    path('configurazione/editTranslation/', EditTranslation.as_view(), name='editTranslation'),
    path('configurazione/updateTranslation/', UpdateTranslation.as_view(), name='updateTranslation'),
    path('luoghi/manageLocation/', ManageLocation.as_view(), name='manageLocation'),
    path('edifici_comunali/manageCityBuilding/', ManageCityBuilding.as_view(), name='manageCityBuilding'),
    
]