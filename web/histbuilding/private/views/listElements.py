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
            oid = request.query_params['oid']
            doc = db.elements.find()
            for e in doc:
                fontename=[]
                for fid in e['fonteidlist']:
                    tsource = db.sources.find_one({'_id': ObjectId(fid)},{'SourceType':1})
                    tsourcetype = db.source_types.find_one({'_id': ObjectId(tsource['SourceType'])},{'elements':1})
                    aaa={}
                    for x in tsourcetype["elements"]:
                        if "required" in x:
                            if x["required"]=="on":
                                aaa[x["name"]] = 1
                    tsource = db.sources.find({'SourceType': ObjectId(fid)},aaa)
                    fontename.append(tsource)
                print(fontename)
            return Response({'source': to_json(doc)})
        except Exception as e:
            print (e)
            print (e.message)
            return Response(status=status.HTTP_400_BAD_REQUEST)
