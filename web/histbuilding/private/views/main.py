from .__init__ import *
from bson.son import SON


# Create your views here.

@method_decorator([login_required], name='dispatch')
class Main(View):
    def get(self, request):
        locations = db.location.find().sort('_id',-1).limit(5)
        users = db.auth_user.find().sort('last_login',-1).limit(5)
       

        return render(request, 'main.html', {'locations': locations,'users': users})


class UploadImage(APIView):
    def post(self, request):
        fin = request.data['file']
        name= uuid.uuid4()
        extension = fin.name.split(".")[1]
        fname = str(name) + '.' + extension
        handle_uploaded_file(fin, fname)
        return Response({'filename': str(fname) })

def handle_uploaded_file(f, name):
    with open(os.path.join(settings.IMAGE_DIR, name ), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

class MainStatistics(APIView):
    def get(self, request):
        try:
            if 'buildings' in request.query_params:
                l = []
                pipeline=[{"$group": {"_id": "$locationid", "count": {"$sum": 1}}},{"$sort": SON([("count", -1), ("_id", -1)])}]
                buildings=db.building.aggregate(pipeline)
                for b in buildings:
                    loc=db.location.find({ "_id": b["_id"] },{"name":1, "_id":0} )
                    loc1=list(loc)
                    b.update(loc1[0])
                    l.append(b)  
                return Response({'docs': to_json(l)})
            elif 'elements1' in request.query_params:
                l = []
                pipeline=[{"$lookup":{"from": "building","let": { "palazzoid": "$palazzoid" } ,"pipeline": [{ "$match": { "$expr": { "$eq": ["$_id", "$$palazzoid"] }}},{"$project": { "locationid": 1,"_id":0}}] , "as": "locids"}},{"$replaceRoot": { "newRoot": { "$mergeObjects": [ { "$arrayElemAt": [ "$locids", 0 ] }, "$$ROOT" ] } }},{"$project": { "locids": 0 } },{"$group": {"_id": "$locationid", "count": {"$sum": 1}}},{"$sort": SON([("count", -1), ("_id", -1)])}]
                elements=db.elements.aggregate(pipeline)
                for b in elements:
                    loc=db.location.find({ "_id": b["_id"] },{"name":1, "_id":0} )
                    loc1=list(loc)
                    b.update(loc1[0])
                    l.append(b)   
                return Response({'docs': to_json(l)})
            elif 'elements2' in request.query_params:
                l = []
                pipeline=[{"$lookup":{"from": "element_types","let": { "eltypeid": "$element.element_id" }  ,"pipeline": [{ "$match": { "$expr": { "$eq": ["$_id", "$$eltypeid"] }}},{"$project": { "name": 1,"_id":0}}],"as": "eltypesids"}},{"$replaceRoot": { "newRoot": { "$mergeObjects": [ { "$arrayElemAt": [ "$eltypesids", 0 ] }, "$$ROOT" ] } }},{ "$project": {  "eltypesids": 0 } },{"$group": {"_id": "$name", "count": {"$sum": 1}}},{"$sort": SON([("count", -1), ("_id", -1)])} ]
                elements=db.elements.aggregate(pipeline)  
                for b in elements:
                    l.append(b)
                return Response({'docs': to_json(l)})
            elif 'sources' in request.query_params:
                l = []
                pipeline=[{"$lookup":{"from": "source_types","let": { "sourcetypeid": "$SourceType" }  ,"pipeline": [{ "$match": { "$expr": { "$eq": ["$_id", "$$sourcetypeid"] }}},{"$project": { "name": 1,"_id":0}}],"as": "sourcetypesids"}},{"$replaceRoot": { "newRoot": { "$mergeObjects": [ { "$arrayElemAt": [ "$sourcetypesids", 0 ] }, "$$ROOT" ] } }},{ "$project": {  "sourcetypesids": 0 } },{"$group": {"_id": "$name", "count": {"$sum": 1}}},{"$sort": SON([("count", -1), ("_id", -1)])} ]
                sources=db.sources.aggregate(pipeline)  
                for b in sources:
                    l.append(b)
                return Response({'docs': to_json(l)})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
