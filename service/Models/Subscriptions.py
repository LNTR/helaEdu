from fireo.models import Model
from fireo.fields import TextField, BooleanField


class Subscriptions(Model):

    canceled = BooleanField()
    endTimestamp = TextField()
    startTimestamp = TextField()
    userId = TextField()
    subscriptionId = TextField()
    planType = TextField()

    class Meta:
        collection_name = "subscriptions"
