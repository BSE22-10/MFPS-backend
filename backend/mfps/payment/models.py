from django.db import models
# from vehicle.models import Vehicle

class Payment(models.Model):
    status = models.BooleanField(default=False)
    # vehicle_id = models.ForeignKey(Vehicle,on_delete=models.CASCADE) 

    @property
    def bill(self):
        return "This is the bill"


