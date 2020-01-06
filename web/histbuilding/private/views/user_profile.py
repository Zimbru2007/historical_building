from .__init__ import *
from django.contrib.auth.hashers import make_password
import datetime



@method_decorator([login_required], name='dispatch')
class UserProfile(View):
    def get(self, request):
        user = User.objects.get(username=request.user)
        return render(request, 'userProfile.html', {"user":user})