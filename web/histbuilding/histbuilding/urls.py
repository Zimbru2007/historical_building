"""histbuilding URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path, re_path
from django.contrib import admin
from django.conf.urls.i18n import i18n_patterns
from django.views.i18n import JavaScriptCatalog
from django.utils.translation import gettext_lazy as _

from django.contrib.sitemaps.views import sitemap



from django.utils import timezone
from django.views.decorators.http import last_modified


urlpatterns = [
    path('tinymce/', include('tinymce.urls')),    
]


urlpatterns += i18n_patterns(
    path('', include('public.urls')),
    path('private/', include('private.urls')),
    path('i18n/', include('django.conf.urls.i18n')),
    path('jsi18n/', JavaScriptCatalog.as_view(domain="django"), name='javascript-catalog'),
    prefix_default_language=False
)