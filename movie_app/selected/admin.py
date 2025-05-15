from django.contrib import admin
from .models import Movie, Selected

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'genre', 'year', 'selected_count')
    search_fields = ('title', 'genre')
    list_filter = ('genre', 'year')

    def selected_count(self, obj):
        return Selected.objects.filter(movie=obj).count()
    selected_count.short_description = 'В избранном'

@admin.register(Selected)
class SelectedAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie')
    search_fields = ('user__username', 'movie__title')
    list_filter = ('user',)
