from django.db import models
from django.conf import settings


class Movie(models.Model):
    title = models.CharField(max_length=100, verbose_name="Название")
    genre = models.CharField(max_length=100, verbose_name="Жанр")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    image = models.URLField(max_length=600, blank=True, null=True, verbose_name="Постер")
    year = models.PositiveIntegerField(blank=True, null=True, verbose_name="Год")

    class Meta:
        db_table = 'movie'
        verbose_name = 'Фильм'
        verbose_name_plural = 'Фильмы'

class Selected(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "movie")
