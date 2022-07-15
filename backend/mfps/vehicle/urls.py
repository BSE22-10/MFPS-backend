from django.urls import path
from . import views

urlpatterns = [
    path('',views.create_list_vehicle, name='create-list-vehicle'),
    path('<int:pk>/update',views.update_exiting_vehicle, name='update-exiting-vehicle'),

]