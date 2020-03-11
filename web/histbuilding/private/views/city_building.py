from .__init__ import *


@method_decorator([login_required], name='dispatch')
class CityBuilding(View):
    def get(self, request):
        
        return render(request, 'city_building.html')



class ManageCityBuilding(APIView):
    def post(self, request):
        try:
            doc = {'name': None, 'type': [], 'geo': None, 'function': None}
            doc['name'] = request.data.get('name', '')
            doc['type'] = request.data.get('type', None)
            doc['function'] = request.data.get('function', None)
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

            if 'oid' in request.data:
                if request.data['oid'] != '':
                    doc['_id'] = ObjectId(request.data['oid'])
                    result = db.city_building.replace_one({'_id': doc['_id']}, doc)
                    if result.modified_count:
                        doc_id = str(doc['_id'])
                    else:
                        raise Exception('no matching oid')
                else:
                    doc_id = db.city_building.insert_one(doc).inserted_id
            else:
                doc_id = db.city_building.insert_one(doc).inserted_id
            
            
            return Response({'message':'Luogo salvato corretamente', 'doc': {'oid': str(doc_id), 'name': doc['name']}})
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
                    docs = db.city_building.find({'geo': {'$geoWithin': {'$geometry': {'type': "Polygon",'coordinates': coordinates} } }} )
                else:
                    docs = []
                return Response({'location': to_json(location), 'docs': to_json(docs)})
            if 'oid' in request.query_params:
                oid = request.query_params['oid']
                doc = db.city_building.find_one({'_id': ObjectId(oid)})
                return Response({'doc': to_json(doc)})

            return Response({})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
