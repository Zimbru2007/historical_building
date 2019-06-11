from .__init__ import *



@method_decorator([login_required], name='dispatch')
class Configuration(View):
    def get(self, request):
        source_types = db.source_types.find()
        return render(request, 'configuration.html', {'source_types': source_types})



class DefineFormSource(APIView):
    def post(self, request):
        try:
            print(request.data)
            doc = {'name': '', 'elements': []}
            for k, v in request.data.items():
                if k == 'name':
                    doc['name'] = v
                else:
                    doc['elements'].append(v)

            doc['elements'] = sorted(doc['elements'], key = lambda i: int(i['order']))
            for e in doc['elements']:
                r = db.translation.find_one({'message': e['name']})
                if r == None:
                    trans = {'message': e['name'], 'languages': {}}
                    for l in settings.LANGUAGES:
                        trans['languages'][l[0]] = e['name']
                    db.translation.insert_one(trans)
            
            r = db.translation.find_one({'message': doc['name']})
            if r == None:
                trans = {'message': doc['name'], 'languages': {}}
                for l in settings.LANGUAGES:
                    trans['languages'][l[0]] = doc['name']
                db.translation.insert_one(trans)

            print (doc)
            
            doc_id = db.source_types.insert_one(doc).inserted_id
            return Response({'message':'Tipo fonte salvato corretamente', 'source': {'oid': str(doc_id), 'name': doc['name']}})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            oid = request.query_params['oid']
            source = db.source_types.find_one({'_id': ObjectId(oid)})
            return Response({'source': source})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
