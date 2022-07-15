from statistics import mode
from django.db import models
from payment.models import Payment

class Vehicle(models.Model):
    number_plate = models.CharField(max_length=8)
    arrival_time = models.DateTimeField()
    departing_time = models.DateTimeField(null=True)
    payment_id = models.ForeignKey(Payment, on_delete=models.CASCADE,null=True)



    


