from .__init__ import *

@method_decorator([login_required], name='dispatch')
class Location(View):
    def get(self, request):
        locations = db.location.find()
        return render(request, 'location.html', {'locations': locations})


class ManageLocation(APIView):
    def post(self, request):
        try:
            doc = {'name': None, 'previous_name': [], 'geo': None, 'first_date': None}
            doc['name'] = request.data.get('name', '')
            doc['previous_name'] = request.data.get('previous_name', [])
            doc['first_date'] = request.data.get('first_date', None)
            geo = request.data.get('geo', None)
            if geo:
                doc['geo'] = {'type': geo['type'], 'coordinates': []}
                coordinates = []
                if geo['type'] == 'Polygon':
                    for l in geo['coordinates']:
                        layer = []
                        for c in l:
                            layer.append([c['lat'], c['lng']])
                        coordinates.append(layer)
                else:
                    coordinates = [ geo['coordinates']['lat'], geo['coordinates']['lng'] ]
                doc['geo']['coordinates'] = coordinates
            exist = False
            if 'oid' in request.data:
                if request.data['oid'] != '':
                    doc['_id'] = ObjectId(request.data['oid'])
                    result = db.location.replace_one({'_id': doc['_id']}, doc)
                    if result.modified_count:
                        doc_id = str(doc['_id'])
                        exist = True
                    else:
                        return Response({'message':'no matching oid'})
                else:
                    doc_id = db.location.insert_one(doc).inserted_id
            else:
                doc_id = db.location.insert_one(doc).inserted_id
            
            return Response({'message':'Luogo salvato corretamente', 'doc': {'oid': str(doc_id), 'name': doc['name'],'exist':exist}})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            if 'oid' in request.query_params:
                oid = request.query_params['oid']
                doc = db.location.find_one({'_id': ObjectId(oid)})
                return Response({'doc': to_json(doc)})
            if 'query' in request.query_params:
                queryString = request.query_params.get('query')
                search = '(.*)' + queryString.strip() + '(.*)'
                search = search.replace(' ', '(.*)')
                regex = re.compile(search, re.IGNORECASE)
                docs = db.location.find({'name': {"$regex":regex,"$options": 'ix'} }).limit(10)
                return Response({'docs': to_json(docs)})
            if 'list' in request.query_params:
                docs = db.location.find()
                return Response({'docs': to_json(docs)})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
