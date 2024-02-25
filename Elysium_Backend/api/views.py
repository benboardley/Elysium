from django.shortcuts import render
from django.http import JsonResponse
#from corsheaders import cors_headers

#@cors_headers(allow_headers='*', allow_methods='*', allow_credentials='true', expose_headers='Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma')
def hello(request):

    return JsonResponse({'message': 'Hello from Elysium!'})
