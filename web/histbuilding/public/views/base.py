from .__init__ import *


# Create your views here.

def home(request):
    return render(request,'home.html')


class Login(View):
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
                return HttpResponseRedirect(reverse('main_private'))
            else:
                return render(request, 'login.html', {'form':form})    
        else:
            return render(request, 'login.html', {'form':form})


def privacy(request):
    return render(request, 'privacy.html')


@login_required
def logout(request):
    print (request.user)
    auth.logout(request)
    
    return HttpResponseRedirect(reverse(home))