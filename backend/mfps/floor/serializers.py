from rest_framework import serializers
from .models import Floor, Slot

class FloorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Floor
        fields = [
            'pk',
            'no_of_slots'
        ]

class SlotSerailizer():

    class Meta:
        model = Slot
        fields = [
            'pk',
            'floor_id'
        ]


