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

class UserAgreementView(View):
    def get(self, request):
        return render(request, 'papers/user-agreement.html')

class PersonalDataProcessingView(View):
    def get(self, request):
        return render(request, 'papers/personal-data-processing.html')

class TeemsAndConditionsView(View):
    def get(self, request):
        return render(request, 'papers/terms-and-conditions.html')
    
'''
class PaperView(View):
    def UserAgreement(self, request):
        def get(self, request):
            return render(request, 'papers/user-agreement.html')
    
    def PersonalDataProcessing(self, request):
        def get(self, request):
            return render(request, 'papers/personal-data-processing.html')
    
    def TeemsAndConditions(self, request):
        def get(self, request):
            return render(request, 'papers/terms-and-conditions.html')
'''
