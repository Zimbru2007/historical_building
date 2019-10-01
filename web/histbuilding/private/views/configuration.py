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
            print ('a00b00')
            doc = {'_id': '', 'name': '', 'elements': []}
            for k, v in request.data.items():
                if k == 'name':
                    doc['name'] = v
                elif k == '_id':
                    doc['_id'] = v 
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
            print ('a0000')
            if doc['_id'] == None or doc['_id'] == '':
                print('a1111')
                del doc['_id']
                doc_id = db.source_types.insert_one(doc).inserted_id
                return Response({'message':'Tipo fonte salvato corretamente', 'source': {'oid': str(doc_id), 'name': doc['name']}})
            else:
                print('a2222')
                doc['_id'] = ObjectId(doc['_id'])
                result = db.source_types.replace_one({'_id': doc['_id']}, doc)
                if result.modified_count:
                    doc_id = str(doc['_id'])
                    return Response({'message':'Tipo fonte modificato corretamente', 'source': {'oid': doc_id, 'name': doc['name']}})
                else:
                    raise Exception('no matching oid')
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            oid = request.query_params['oid']
            source = db.source_types.find_one({'_id': ObjectId(oid)})
            return Response({'source': to_json(source)})
        except Exception as e:
            print (e)
            print (e.message)
            return Response(status=status.HTTP_400_BAD_REQUEST)
