from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.urls import reverse

import json
import re
import os
import uuid

from bson.objectid import ObjectId

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.views import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import authentication, permissions, status

from histbuilding.mongodb import *

from .main import *
from .configuration import *
from .building import *
from .sources import *
from .location import *
from .city_building import *