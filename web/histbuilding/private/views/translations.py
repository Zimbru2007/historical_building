from .__init__ import *

class EditTranslation(APIView):

    def get(self, request):
        try:
            if 'query' in request.query_params:
                queryString = request.query_params.get('query')
                search = '(.*)' + queryString.strip() + '(.*)'
                search = search.replace(' ', '(.*)')
                regex = re.compile(search, re.IGNORECASE)
                docs = db.translation.find({'message': {"$regex":regex,"$options": 'ix'} })
                return Response({'docs': to_json(docs)})
            if 'oid' in request.query_params:
                oid = request.query_params.get('oid')
                doc = db.translation.find_one({'_id': ObjectId(oid)})
                return Response({'doc': to_json(doc)})
            return Response({})
        except Exception as e:
            print (e)
            return Response(status=status.HTTP_400_BAD_REQUEST)



    def post(self, request):
        try:
            trans = request.data
            if trans['_id'] == None or trans['_id'] == '':
                del trans['_id']
                tempresult=db.translation.count_documents({"message" : trans['message']})
                if not tempresult:
                    db.translation.insert_one(trans)
                else:
                    raise Exception('Another message already exist')
            else:
                trans['_id'] = ObjectId(trans['_id'])
                result = db.translation.replace_one({'_id': trans['_id']}, trans)
                if result.modified_count:
                    doc_id = str(trans['_id'])
                else:
                    raise Exception('no matching oid')
            return Response({'message':'Traduzione salvata correttamente'})
        except Exception as e:
            print ('Error edit translations', str(e))
            return Response({'message':str(e)},status= status.HTTP_400_BAD_REQUEST)




class UpdateTranslation(APIView):

    def post(self, request, format=None):
        try:

            management.call_command('makemessages')
            default_locale_path = settings.LOCALE_PATHS[0]

            for locale in settings.LANGUAGES:
                langCode = locale[0].split('-')
                dirLangCode = langCode[0] 
                if len(langCode) > 1:
                    dirLangCode += '_' + langCode[1].upper()
                localeFile = os.path.join(default_locale_path, dirLangCode, 'LC_MESSAGES', 'django.po')
                po = polib.pofile(localeFile, check_for_duplicates=True)
                print ('opened ', localeFile)

                msg_po = []

                for entry in po:
                    
                    msg = db.translation.find_one({'message':entry.msgid})
                    if msg == None:
                        newMsg = {'message': entry.msgid, 'languages': {}}
                        for l in settings.LANGUAGES:
                            newMsg['languages'][l[0]] = entry.msgid
                        msgId = db.translation.insert_one(newMsg).inserted_id
                        msg_po.append(msgId)
                        entry.msgstr = newMsg['languages'][langCode[0]]
                    else:
                        msg_po.append(msg['_id'])
                        entry.msgstr = msg['languages'][langCode[0]]
                    if entry.obsolete:
                        entry.obsolete = False
                    
                    
                for entry in po.fuzzy_entries():
                    entry.flags.remove('fuzzy')

                msgFromDb = db.translation.find({'_id': {'$nin': msg_po }})
                print ('process new translations')
                for m in msgFromDb:
                    entry = polib.POEntry(msgid=m['message'], msgstr=m['languages'][langCode[0]] )
                    print ('append new translation ', m['message'], m['languages'][langCode[0]])
                    po.append(entry)
                po.save()


            
            print ('compilemessages')
            management.call_command('compilemessages')
                
            print ('reload server')
            import uwsgi
            uwsgi.reload()
            return Response({'message': 'Traduzioni aggiornate'}, status= status.HTTP_200_OK)
        except Exception as e:
            print ('Error updatetrans', e)
            return Response(status= status.HTTP_400_BAD_REQUEST)
