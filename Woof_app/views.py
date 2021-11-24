from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests

# Create your views here.

from Woof_app.models import Dog

def index(request):
    response = json.dumps([{}])
    return HttpResponse(response, content_type='text/json')

def get_leaderboard(request):
    if request.method == 'GET':
        try:
            leaderboard = Dog.objects.all().order_by('-count')
            response = json.dumps([{'name': rank.name, 'count': rank.count} for rank in leaderboard])
        except:
            response = json.dumps([{ 'Error': 'No dog Woof!'}])
    return HttpResponse(response, content_type='text/json')

def get_dog(request):
    if request.method == 'GET':
        dog_id = request.GET.get('name')
        try:
            dog = Dog.objects.get(name=dog_id)
            response = json.dumps({'name': dog_id, 'count': dog.count})
        except:
            response = json.dumps({'Error': 'Dog not found'})
    return HttpResponse(response, content_type='text/json')

@csrf_exempt
def add_dog(request):
    if request.method == 'POST':
        payload = json.loads(request.body)
        name = payload['name']
        count = payload['count']
        dog = Dog(name=name, count=count)
        # try:
        dog.save(count=count)
        response = json.dumps([{ 'Success': 'Dog added successfully!'}])
        # except:
            # response = json.dumps([{ 'Error': 'Dog could not be added!'}])
    return HttpResponse(response, content_type='text/json')

def get_fomo_dog(request):
    address = request.GET.get('address')
    etherscan_api_url = 'https://api.etherscan.io/api'
    fomo_dog_contract = '0x90cfCE78f5ED32f9490fd265D16c77a8b5320Bd4'
    param = {
        'module':'account',
        'action':'tokennfttx',
        'address':address,
        'tag':'latest',
        'apikey':'M2RCAZX6IAHNQNPR7Z24KE66624JDNRKKQ',
        'contractaddress': fomo_dog_contract
    }
    response = requests.get(etherscan_api_url, param)
    response = json.loads(response.text)
    if response['status']:
        fomo_dog_tx = []
        for result in response['result']:
            if result['to']==address.lower(): fomo_dog_tx.append({'token_id': result['tokenID']})
            if result['from']==address.lower(): fomo_dog_tx.remove({'token_id': result['tokenID']})
        return HttpResponse(json.dumps(fomo_dog_tx), content_type='text/json')
    return HttpResponse(json.dumps([{'Error': 'Etherscan API error'}]))
