from django.shortcuts import render
from rest_framework import generics, mixins, permissions, authentication
from .models import Floor, Slot, Slot_status
from .serializers import FloorSerializer,SlotSerailizer

#End points for the floor
class FloorListCreateApiView(generics.ListCreateAPIView):
    queryset = Floor.objects.all()
    serializer_class=FloorSerializer

floor_create_list = FloorListCreateApiView.as_view()

#Delete a floor
class DeleteFloorApiView(generics.DestroyAPIView):
    queryset = Floor.objects.all()
    serializer_class = FloorSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)

#End points for the slot
class SlotListCreateApiView(generics.ListCreateAPIView):
    queryset = Slot.objects.all()
    serializer_class=SlotSerailizer

class SlotDeleteApiView(generics.DestroyAPIView):
    queryset = Slot.objects.all()
    serializer_class=SlotSerailizer
    lookup_field= 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)

slot_create_list = SlotListCreateApiView.as_view()

