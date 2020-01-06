from .__init__ import *



@method_decorator([login_required], name='dispatch')
class Element(View):
    def get(self, request):
        element = db.element.find()
        element_types = db.element_types.find()
        return render(request, 'element.html', {'element': element,'element_types': element_types})

class ManageElements(APIView):
    def post(self, request):
        try:
            print (request.data)
            doc = {'_id': '', 'fonteidlist': [],'palazzoid': '', 'elements': []}
            for k, v in request.data.items():
                if k == 'fonteidlist':
                    doc['fonteidlist']=v
                elif k == 'palazzoid':
                    doc['palazzoid'] = ObjectId(v)
                elif k == '_id':
                    doc['_id'] = v
                else:
                    doc['elements'].append(v)
            if doc['_id'] == None or doc['_id'] == '':
                del doc['_id']
                for elem in doc['elements']:
                    doc_temp = { 'fonteidlist': '','palazzoid': '', 'element': ''}
                    doc_temp['palazzoid']=doc['palazzoid']
                    doc_temp['fonteidlist']=doc['fonteidlist']
                    doc_temp['element']=elem
                    doc_temp['element']['element_id']=ObjectId(elem['element_id'])
                    doc_id = db.elements.insert_one(doc_temp).inserted_id
                return Response({'message':'Tipo fonte salvato corretamente'})
            else:
                firstelem=True
                for elem in doc['elements']:
                    if firstelem:
                        doc_temp = {'_id': '', 'fonteidlist': '','palazzoid': '', 'element': ''}
                        doc_temp['palazzoid']=doc['palazzoid']
                        doc_temp['fonteidlist']=doc['fonteidlist']
                        doc_temp['element']=elem
                        doc_temp['element']['element_id']=ObjectId(elem['element_id'])
                        doc_temp['_id'] = ObjectId(doc['_id'])
                        result = db.elements.replace_one({'_id': doc_temp['_id']}, doc_temp)
                        firstelem=False
                        if result.modified_count:
                            doc_id = str(doc_temp['_id'])
                    else:
                        doc_temp = { 'fonteidlist': '','palazzoid': '', 'element': ''}
                        doc_temp['palazzoid']=doc['palazzoid']
                        doc_temp['fonteidlist']=doc['fonteidlist']
                        doc_temp['element']=elem
                        doc_temp['element']['element_id']=ObjectId(elem['element_id'])
                        doc_id = db.elements.insert_one(doc_temp).inserted_id
                return Response({'message':'Tipo fonte salvato corretamente'})
        except Exception as e:
            print (e)
            request.session['error'] = 'Errore nel salvataggio'
            return Response(status=status.HTTP_400_BAD_REQUEST)

