from .__init__ import *



@method_decorator([login_required], name='dispatch')
class ListElements(View):
    def get(self, request):
        element = db.element.find()
        return render(request, 'listElements.html', {'element': element})


class ManageListElements(APIView):
    def get(self, request):
        try:
            ellist=[]
            doc = db.elements.find()
            for e in doc:
                #print(to_json(e))
                fontename=[]
                if 'fonteidlist' in e:
                    for fid in e['fonteidlist']:
                        tsource = db.sources.find_one({'_id': ObjectId(fid)},{'SourceType':1})
                        tsourcetype = db.source_types.find_one({'_id': ObjectId(tsource['SourceType'])},{'elements':1})
                        aaa={}
                        for x in tsourcetype["elements"]:
                            if "required" in x:
                                if x["required"]=="on":
                                    aaa[x["name"]] = 1
                        tsource = db.sources.find_one({'_id': ObjectId(fid)},aaa)
                        #print(tsource)
                        fontename.append(tsource)
                    e['fontename']=fontename
                    #print(fontename)
                if 'palazzoid' in e:
                    #print(e['palazzoid'])
                    tbuilding=db.building.find_one({'_id': ObjectId(e['palazzoid'])},{'name':1, 'locationid':1})
                    tlocation=db.location.find_one({'_id': ObjectId(tbuilding['locationid'])},{'name':1})
                    e['buildingname']=tbuilding['name']
                    e['locationname']=tlocation['name']
                    #print(tbuilding['name'])
                    #print(tlocation['name'])
                if 'element' in e:
                    if 'element_id' in e['element']:
                        telementtype=db.element_types.find_one({'_id': ObjectId(e['element']['element_id'])},{'name':1})
                        e['element']['elementname']=telementtype['name']
                ellist.append(e)
            print(to_json(doc))
            print(to_json(ellist))
            return Response({'elements':to_json(ellist)})
        except Exception as e:
            print (e)
            print (e.message)
            return Response(status=status.HTTP_400_BAD_REQUEST)
