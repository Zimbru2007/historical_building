from .__init__ import *



@method_decorator([login_required], name='dispatch')
class Sources(View):
    def get(self, request):
        
        return render(request, 'sources.html')