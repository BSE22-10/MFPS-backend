from django.urls import path
from . import views

urlpatterns = [
    path('',views.create_list_vehicle,name='create-list-vehicle')
]