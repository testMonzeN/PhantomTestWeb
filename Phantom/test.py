'''
metods API django rest framework:
def list(self, request):
    pass
    
def create(self, request):
    pass
    
def retrieve(self, request, pk=None):
    pass
    
def update(self, request, pk=None):
    pass
    
def partial_update(self, request, pk=None):
    pass
    
def destroy(self, request, pk=None):
    pass
        
'''

import requests

res = requests.get('http://127.0.0.1:8000/api/users/', data = {
    'metod': 'login',
    'name': 't',
    'password': '1324rtgh',
}).json()

print(res)