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

    
class ListSources(APIView):
    def post(self, request):
        try:
            data = {}
            isedit=False
            for k in request.data:
                if k == 'csrfmiddlewaretoken':
                    continue
                else: 
                    if k=='SourceType':
                        val = ObjectId(request.data.get(k))
                    else:
                        if k=="oid":
                            isedit=True            
                        else:
                            val = request.data.get(k)
                if val:
                    data[k] = val
            if isedit:
                curroid=request.data.get('oid')
                if  curroid!= '':
                    data['_id'] = ObjectId(curroid)
                    result = db.sources.replace_one({'_id': data['_id']}, data)  
                    if result.modified_count:
                        doc_id = str(data['_id'])
                    else:
                        raise Exception('no matching oid')
                else:
                    doc_id = db.sources.insert_one(data).inserted_id
            else:
                doc_id = db.sources.insert_one(data).inserted_id
            return Response({'message':'Fonte salvato corretamente', 'doc': {'oid': str(doc_id), 'name': 'name'}})
        except Exception as e:
            print (e)
            request.session['error'] = 'Errore nel salvataggio'
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            if 'sourcetype' in request.query_params:
                oid = request.query_params['sourcetype']
                doc = db.source_types.find_one({'_id': ObjectId(oid)},{'elements':1})
                aaa={}
                for x in doc["elements"]:
                    if "required" in x:
                        if x["required"]=="on":
                            aaa[x["name"]] = 1
                docs = db.sources.find({'SourceType': ObjectId(oid)},aaa)
                return Response({'docs': to_json(docs),'doc': aaa})
            elif 'oid' in request.query_params:
                oid = request.query_params['oid']
                doc = db.sources.find_one({'_id': ObjectId(oid)})
                return Response({'doc': to_json(doc)})
            elif 'oid_required' in request.query_params:
                oid = request.query_params['oid_required']
                doc_temp = db.sources.find_one({'_id': ObjectId(oid)},{'SourceType':1})
                doc_temp2 = db.source_types.find_one({'_id': doc_temp['SourceType']},{'elements':1})
                aaa={}
                for x in doc_temp2["elements"]:
                    if "required" in x:
                        if x["required"]=="on":
                            aaa[x["name"]] = 1
                doc = db.sources.find_one({'_id': ObjectId(oid)},aaa)
                return Response({'doc': to_json(doc)})
            elif 'query' in request.query_params:
                queryString = request.query_params.get('query')
                search = '(.*)' + queryString.strip() + '(.*)'
                search = search.replace(' ', '(.*)')
                regex = re.compile(search, re.IGNORECASE)
                docs_temp = db.source_types.find({},{'elements':1})
                aaa={}
                bbb=[]
                ccc={}
                b = {"$regex":regex,"$options": 'ix'}
                for x in docs_temp:
                    for y in x["elements"]:
                        if "required" in y:
                            if y["required"]=="on":                                            
                                aaa[y["name"]] = b
                                bbb.append(aaa.copy())
                                aaa={}
                                ccc[y["name"]] = 1                    
                docs = db.sources.find({"$or": bbb },ccc).limit(10)
                return Response({'docs': to_json(docs)})
            elif 'suggestquery' in request.query_params:
                docs_temp = db.source_types.find({},{'elements':1})
                aaa=[]
                ccc={}
                for x in docs_temp:
                    for y in x["elements"]:
                        if "required" in y:
                            if y["required"]=="on":
                                ccc[y["name"]] = 1
                    docs2=db.sources.find({"SourceType":x["_id"]},ccc)
                    for t in docs2:
                        aaa.append(t)
                return Response({'docs': to_json(aaa)})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    