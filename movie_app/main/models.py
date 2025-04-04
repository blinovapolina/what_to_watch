from django.db import models
from django.contrib.auth.models import AbstractUser

from selected.models import Movie

class User(AbstractUser):
    movies = models.ManyToManyField(Movie, blank=True, related_name="movies", verbose_name="Избранные")

    class Meta:
        db_table = 'user'
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
