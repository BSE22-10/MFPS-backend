from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Vehicle
        fields = [
            'number_plate',
            'arrival_time',
            'departing_time',
            'payment_id'
        ]