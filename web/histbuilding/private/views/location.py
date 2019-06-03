from .__init__ import *

@method_decorator([login_required], name='dispatch')
class Location(View):
    def get(self, request):
        locations = db.location.find()
        return render(request, 'location.html', {'locations': locations})


class ManageLocation(APIView):
    def post(self, request):
        try:
            print(request.data)
            doc = {'name': None, 'previous_name': [], 'geo': None, 'first_date': None}
            doc['name'] = request.data.get('name', '')
            print (doc['name'])
            doc['previous_name'] = request.data.get('previous_name', [])
            print(doc['previous_name'])
            doc['first_date'] = request.data.get('first_date', None)
            print (doc['first_date'])
            geo = request.data.get('geo', None)
            print (geo)
            if geo:
                doc['geo'] = {'type': geo['type'], 'coordinates': []}
                coordinates = []
                print(doc['geo'])
                print (geo['coordinates'])
                for l in geo['coordinates']:
                    print ('layer')
                    layer = []
                    for c in l:
                        print(c)
                        layer.append([c['lat'], c['lng']])
                    coordinates.append(layer)
                doc['geo']['coordinates'] = coordinates

            if 'oid' in request.data:
                if request.data['oid'] != '':
                    doc['_id'] = ObjectId(request.data['oid'])
                    result = db.location.replace_one({'_id': doc['_id']}, doc)
                    if result.modified_count:
                        doc_id = str(doc['_id'])
                    else:
                        raise Exception('no matching oid')
                else:
                    doc_id = db.location.insert_one(doc).inserted_id
                    print ('insert', doc_id)
            else:
                doc_id = db.location.insert_one(doc).inserted_id
                print ('insert', doc_id)
            #print (doc)
            
            return Response({'message':'Luogo salvato corretamente', 'doc': {'oid': str(doc_id), 'name': doc['name']}})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            oid = request.query_params['oid']
            doc = db.location.find_one({'_id': ObjectId(oid)})
            return Response({'doc': to_json(doc)})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
