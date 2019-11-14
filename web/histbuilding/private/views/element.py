from .__init__ import *



@method_decorator([login_required], name='dispatch')
class Element(View):
    def get(self, request):
        element = db.element.find()
        return render(request, 'element.html', {'element': element})


