from django import template
from django.utils.safestring import SafeString
import json

register = template.Library()


@register.filter(name='oid')
def oid(obj):
    return str(obj['_id'])

@register.filter("escapedict")
def escapedict(data):
    '''
    if not isinstance(data, dict):
        return data
    '''
    print (data)
    jsonData = {}
    
    for key in data:
        jsonData[key] = data[key]
        '''
        print (key, data[key])
        if isinstance(data[key], int) and not isinstance(data[key], bool):
            data[key] = int(SafeString(data[key]))
        else:
            data[key] = SafeString(data[key])
        '''
    
    
    return json.dumps(data)