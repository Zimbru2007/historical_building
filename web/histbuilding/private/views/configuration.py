from .__init__ import *



@method_decorator([login_required], name='dispatch')
class Configuration(View):
    def get(self, request):
        
        return render(request, 'configuration.html')



class DefineFormSource(APIView):
    def post(self, request):
        print(request.data)
        return Response({'status':'ok'})