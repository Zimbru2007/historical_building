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
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('tinymce/', include('tinymce.urls')),  
    re_path(r'^accounts/changePwd/$',auth_views.PasswordChangeView.as_view(template_name='user/changePwd.html'),name='changePwd'),
    re_path(r'^accounts/changePwdDone/$',auth_views.PasswordChangeDoneView.as_view(template_name='user/changePwdDone.html'),name='password_change_done'),
    re_path(r'^accounts/password_reset/$',auth_views.PasswordResetView.as_view(template_name='user/password_reset.html'),name='password_reset'),
    re_path(r'^accounts/password_reset/done/$',auth_views.PasswordResetDoneView.as_view(template_name='user/password_reset_done.html'),name='password_reset_done'),
    path('accounts/reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(template_name='user/password_reset_confirm.html'),name='password_reset_confirm'),
    re_path(r'^accounts/reset/done/$',auth_views.PasswordResetCompleteView.as_view(template_name='user/password_reset_complete.html'),name='password_reset_complete'),
]


urlpatterns += i18n_patterns(
    path('', include('public.urls')),
    path('private/', include('private.urls')),
    path('i18n/', include('django.conf.urls.i18n')),
    path('jsi18n/', JavaScriptCatalog.as_view(domain="django"), name='javascript-catalog'),
    prefix_default_language=False
)