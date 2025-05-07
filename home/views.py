from django.shortcuts import render

from django.views import View

class IndexView(View):

    def get(self, request):
        return render(request, 'home/index.html')


class FeaturesView(View):

    def get(self, request):
        return render(request, 'home/features.html')


class PricingView(View):
    def get(self, request):
        return render(request, 'home/pricing.html')


class ContactsView(View):
    def get(self, request):
        return render(request, 'home/contacts.html')



