from statistics import mode
from django.db import models
from payment.models import Payment

class Vehicle(models.Model):
    number_plate = models.CharField(max_length=8)
    arrival_time = models.DateField()
    departing_time = models.DateField()
    payment_id = models.ForeignKey(Payment, on_delete=models.CASCADE)



    


