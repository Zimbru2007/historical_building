from .__init__ import *



@method_decorator([login_required], name='dispatch')
class Sources(View):
    def get(self, request):
        try:
            error = request.session.pop('error', None)
            source_types = db.source_types.find()
            sources = source_types.clone()
            return render(request, 'sources.html', {'source_types': source_types, 'sources': sources, 'error_msg': error})
        except Exception as e:
            print ('Error---------', e)
            return HttpResponseRedirect(reverse('main_private'))

    def post(self, request):
        try:
            print (request.POST)
            data = {}
            for k in request.POST:
                if k == 'csrfmiddlewaretoken':
                    continue
                val = request.POST.get(k)
                if val:
                    data[k] = val

            db.sources.insert_one(data)
            return HttpResponseRedirect(reverse('sources'))
        except Exception as e:
            print (e)
            request.session['error'] = 'Errore nel salvataggio'
            return HttpResponseRedirect(reverse('sources'))