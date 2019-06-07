from .__init__ import *


# Create your views here.

@method_decorator([login_required], name='dispatch')
class Main(View):
    def get(self, request):
        
        return render(request, 'main.html')


class UploadImage(APIView):
    def post(self, request):
        print (request.data)
        fin = request.data['file']
        name= uuid.uuid4()
        extension = fin.name.split(".")[1]
        fname = str(name) + '.' + extension
        handle_uploaded_file(fin, fname)
        return Response({'filename': str(fname) })

def handle_uploaded_file(f, name):
    with open(os.path.join(settings.IMAGE_DIR, name ), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    