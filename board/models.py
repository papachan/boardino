from django.db import models

class Board(models.Model):

    def __unicode__(self):
        return self.id

class PostIt(models.Model):
    board = models.ForeignKey(Board)
    text = models.TextField()