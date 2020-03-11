from .__init__ import *
from django.contrib.auth.hashers import make_password
import datetime



@method_decorator([login_required], name='dispatch')
class UserCreation(View):
    def get(self, request):
        form = UserCreationForm()
        return render(request, 'user_creation.html', {'form':form})
    def post(self, request):
        try:
            form = UserCreationForm(request.POST)
            
            if form.is_valid():
                mid=db.auth_user.find({}, {'id': 1, '_id':0}).sort('id',-1).limit(1)
                mid1=list(mid)
               
                data = {'id': mid1[0]['id']+1, 'password': None,'last_login': None, 'is_superuser': False, 'username': None, 'first_name': None, 'last_name': None, 'email': None, 'is_staff': False, 'is_active': True, 'date_joined': None}
                data['password'] = make_password(request.POST.get('password1', ''), salt=None, hasher='pbkdf2_sha256')
                data['username'] = request.POST.get('username', '')
                data['first_name'] = request.POST.get('first_name', '')
                data['last_name'] = request.POST.get('last_name', '')
                data['email'] = request.POST.get('email', '')
                data['date_joined'] = datetime.datetime.now()
                temp=db.auth_user.find({'$or':[{'username':data['username']},{'email':data['email']}]})
                temp1=list(temp)
        
                if not temp1:
                    db.auth_user.insert_one(data)
                    return HttpResponseRedirect(reverse('main_private'))
                else:
                    
                    return render(request, 'user_creation.html', {'form': form })
            else:
                return render(request, 'user_creation.html', {'form': form })
        except Exception as e:
            print (e)
            request.session['error'] = e
            return HttpResponseRedirect(reverse('main_private'))
    