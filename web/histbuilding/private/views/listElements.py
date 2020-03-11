from .__init__ import *



@method_decorator([login_required], name='dispatch')
class ListElements(View):
    def get(self, request):
        element = db.element.find()
        return render(request, 'listElements.html', {'element': element})


class ManageListElements(APIView):
    def get(self, request):
        try:
            if 'elementid' in request.query_params:
                oid = request.query_params['elementid']
                doc = db.elements.find_one({'_id': ObjectId(oid)})
                fontename=[]
                if 'palazzoid' in doc:
                    tbuilding=db.building.find_one({'_id': ObjectId(doc['palazzoid'])},{'name':1, 'locationid':1})
                    tlocation=db.location.find_one({'_id': ObjectId(tbuilding['locationid'])},{'name':1})
                    doc['buildingname']=tbuilding['name']
                    doc['locationname']=tlocation['name']
                    doc['locationid']=tlocation['_id']
                return Response({'element':to_json(doc)})
            else:
                ellist=[]
                doc = db.elements.find()
                for e in doc:
                    el ={}
                    fontename=[]
                    if '_id' in e:
                        el['_id']=e['_id']
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
                            fontename.append(tsource)
                        el['fontename']=fontename
                        
                    if 'palazzoid' in e:
                        tbuilding=db.building.find_one({'_id': ObjectId(e['palazzoid'])},{'name':1, 'locationid':1})
                        tlocation=db.location.find_one({'_id': ObjectId(tbuilding['locationid'])},{'name':1})
                        el['buildingname']=tbuilding['name']
                        el['locationname']=tlocation['name']
                    if 'element' in e:
                        if 'element_id' in e['element']:
                            telementtype=db.element_types.find_one({'_id': ObjectId(e['element']['element_id'])},{'name':1,'elements':1})
                            el['elementname']=telementtype['name']
                            aaa={}
                            bbb={}
                            for x in telementtype["elements"]:
                                if "required" in x:
                                    if x["required"]=="on":
                                        aaa["element."+x["name"]] = 1
                            if not aaa:
                                for x in telementtype["elements"]:
                                     if x["order"] in ("1", "2"):
                                        aaa["element."+x["name"]] = 1
                            ttelement = db.elements.find_one({'_id': ObjectId(e['_id'])},aaa)
                            if 'element' in ttelement:
                                el['element']=ttelement['element']
                            
                    ellist.append(el)
                return Response({'elements':to_json(ellist)})
        except Exception as e:
            print (e.message)
            return Response(status=status.HTTP_400_BAD_REQUEST)
