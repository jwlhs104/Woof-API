from django.db import models

# Create your models here.
class Dog(models.Model):
    name = models.CharField(max_length=100)
    count = models.IntegerField()

    def save(self,*args,**kwargs):
        dogs = Dog.objects.filter(name=self.name)
        print(dogs)
        try:
            dogs.update(count = dogs[0].count+ self.count)
        except:
            return super(Dog,self).save()
