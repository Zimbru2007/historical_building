from .__init__ import *



@method_decorator([login_required], name='dispatch')
class Configuration(View):
    def get(self, request):
        source_types = db.source_types.find()
        element_types = db.element_types.find()
        return render(request, 'configuration.html', {'source_types': source_types,'element_types': element_types})



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
            if doc['_id'] == None or doc['_id'] == '':
                del doc['_id']
                doc_id = db.source_types.insert_one(doc).inserted_id
                return Response({'message':'Tipo fonte salvato corretamente', 'source': {'oid': str(doc_id), 'name': doc['name']}})
            else:
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
            doc = db.source_types.find_one({'_id': ObjectId(oid)})
            return Response({'source': to_json(doc)})
        except Exception as e:
            print (e)
            print (e.message)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class DefineFormElement(APIView):
    def post(self, request):
        try:
            print(request.data)
            doc = {'_id': '', 'name': '', 'elements': []}
            for k, v in request.data.items():
                if k == 'elname':
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
            if doc['_id'] == None or doc['_id'] == '':
                del doc['_id']
                doc_id = db.element_types.insert_one(doc).inserted_id
                return Response({'message':'Tipo elemento descrittivo salvato corretamente', 'element': {'oid': str(doc_id), 'name': doc['name']}})
            else:
                doc['_id'] = ObjectId(doc['_id'])
                result = db.element_types.replace_one({'_id': doc['_id']}, doc)
                if result.modified_count:
                    doc_id = str(doc['_id'])
                    return Response({'message':'Tipo elemento descrittivo modificato corretamente', 'element': {'oid': doc_id, 'name': doc['name']}})
                else:
                    raise Exception('no matching oid')
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            oid = request.query_params['oid']
            doc = db.element_types.find_one({'_id': ObjectId(oid)})
            return Response({'element': to_json(doc)})
        except Exception as e:
            print (e)
            print (e.message)
            return Response(status=status.HTTP_400_BAD_REQUEST)

