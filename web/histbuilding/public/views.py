
from django.shortcuts import render, redirect
from .forms import *
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.urls import reverse

import json

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.views import View
from django.contrib.auth.decorators import login_required

# Create your views here.

def home(request):
    return render(request,'home.html')


class login(View):
    def get(self, request):
        form = LoginForm()
        return render(request, 'login.html', {'form':form})

    def post(self, request):
        form = LoginForm(request.POST)
        if form.is_valid():
            username = request.POST['username']
            password = request.POST['password']

            user = auth.authenticate(username=username, password=password)
            if user is not None and user.is_active:
                auth.login(request, user)
                return HttpResponseRedirect(reverse(home))
            else:
                return render(request, 'login.html', {'form':form})    
        else:
            return render(request, 'login.html', {'form':form})


def privacy(request):
    return render(request, 'privacy.html')


@login_required
def logout(request):
    
    for sesskey in list(request.session.keys()):
        del request.session[sesskey]

    auth.logout(request)
      
    return HttpResponseRedirect(reverse(home))