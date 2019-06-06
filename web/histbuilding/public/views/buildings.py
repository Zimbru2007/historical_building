from .__init__ import *



class ListBuildings(View):
    def get(self, request):
        buildings = db.building.find({}, {'name': 1, 'image': 1, 'slug':1})
        return render(request, 'list_buildings.html', {'buildings': buildings, 'nbuldings': buildings.count()})

    
class Building(View):
    def get(self, request, building_slug):
        building = db.building.find_one({'_id': building_slug}, {'name':1, 'image': 1, 'review': 1})
        return render(request, 'list_buildings.html', {'building':building})



