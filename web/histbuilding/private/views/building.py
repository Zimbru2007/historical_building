from .__init__ import *



@method_decorator([login_required], name='dispatch')
class Building(View):
    def get(self, request):
        return render(request, 'manage_building.html')


class ManageBuilding(APIView):
    def post(self, request):
        try:
            print(request.data)
            doc = {'name': None, 'old_names': [], 'geo': None, 'recognized': None}
            doc['name'] = request.data.get('name', '')
            doc['old_names'] = request.data.get('old_names', [])
            doc['recognized'] = request.data.get('recognized', None)
            geo = request.data.get('geo', None)
            print (geo)
            if geo:
                doc['geo'] = {'type': geo['type'], 'coordinates': []}
                coordinates = []
                print(doc['geo'])
                if geo['type'] == 'Polygon':
                    print (geo['coordinates'])
                    for l in geo['coordinates']:
                        print ('layer')
                        layer = []
                        for c in l:
                            print(c)
                            layer.append([c['lat'], c['lng']])
                        coordinates.append(layer)
                else:
                    coordinates = [ geo['coordinates']['lat'], geo['coordinates']['lng'] ]
                doc['geo']['coordinates'] = coordinates

            doc['slug'] = doc['name'].replace(' ','_')
            if 'oid' in request.data:
                if request.data['oid'] != '':
                    doc['_id'] = ObjectId(request.data['oid'])
                    result = db.building.replace_one({'_id': doc['_id']}, doc)
                    if result.modified_count:
                        doc_id = str(doc['_id'])
                    else:
                        raise Exception('no matching oid')
                else:
                    doc_id = db.building.insert_one(doc).inserted_id
                    print ('insert', doc_id)
            else:
                doc_id = db.building.insert_one(doc).inserted_id
                print ('insert', doc_id)
            #print (doc)
            
            return Response({'message':'Palazzo salvato corretamente', 'doc': {'oid': str(doc_id), 'name': doc['name']}})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            if 'locationid' in request.query_params:
                oid = request.query_params['locationid']
                location = db.location.find_one({'_id': ObjectId(oid)})
                if location['geo']["type"] == "Polygon":
                    coordinates = location["geo"]['coordinates']
                    coordinates[0].append(location["geo"]['coordinates'][0][0])
                    docs = db.building.find({'geo': {'$geoWithin': {'$geometry': {'type': "Polygon",'coordinates': coordinates} } }} )
                else:
                    docs = []
                return Response({'location': to_json(location), 'docs': to_json(docs)})
            if 'oid' in request.query_params:
                oid = request.query_params['oid']
                doc = db.building.find_one({'_id': ObjectId(oid)})
                return Response({'doc': to_json(doc)})

            return Response({})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
