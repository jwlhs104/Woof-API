from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

from Woof.models import Dog

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
