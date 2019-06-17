from .__init__ import *



class ListBuildings(View):
    def get(self, request):
        buildings = db.building.aggregate([{"$lookup":{"from": "location", "localField": "locationid", "foreignField": "_id","as": "locationInfo"}}])
        #buildings = db.building.find({}, {'name': 1, 'image': 1, 'slug':1})
        return render(request, 'list_buildings.html', {'buildings': buildings})

    
class Building(View):
    def get(self, request, building_slug):
        #building = db.building.find_one({'slug': building_slug})
        buildings = db.building.aggregate([{"$match": {'slug': building_slug} }, {"$lookup":{"from": "location", "localField": "locationid", "foreignField": "_id","as": "locationInfo"}}])
        for b in buildings:
            building = b
            break
        print (building)
        return render(request, 'building.html', {'building':building})



