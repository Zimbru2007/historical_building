from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.views import View
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from ..forms import *
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.urls import reverse
from histbuilding.mongodb import *

import json


from .base import *
from .buildings import *