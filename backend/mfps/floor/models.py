from django.db import models

class Floor(models.Model):
    no_of_slots = models.IntegerField()

class Slot(models.Model):
    floor_id = models.ForeignKey(Floor, on_delete=models.CASCADE)

class Slot_status(models.Model):
    slot_id = models.ForeignKey(Slot, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
