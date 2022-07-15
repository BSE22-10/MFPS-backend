from rest_framework import serializers
from .models import Payment

class FloorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Payment
        fields = [
            'pk',

        ]