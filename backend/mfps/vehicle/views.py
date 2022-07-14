from django.shortcuts import render
from .models import Vehicle
from rest_framework import generics
from .serializers import VehicleSerializer


class CreateVehicle(generics.ListCreateAPIView):
    queryset=Vehicle.objects.all()
    serializer_class=VehicleSerializer

create_list_vehicle = CreateVehicle.as_view()

class DeleteVehicle(generics.DestroyAPIView):
    queryset=Vehicle.objects.all()
    serializer_class=VehicleSerializer

delete_vehicle = DeleteVehicle.as_view()
