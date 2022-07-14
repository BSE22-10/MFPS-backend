from django.urls import path
from . import views

urlpatterns = [
    path('', views.floor_create_list, name='floor-list'),
]