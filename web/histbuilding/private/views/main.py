from .__init__ import *


# Create your views here.

@method_decorator([login_required], name='dispatch')
class Main(View):
    def get(self, request):
        
        return render(request, 'main.html')

    