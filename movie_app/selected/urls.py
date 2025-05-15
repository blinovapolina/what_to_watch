from django.urls import path
from selected import views

app_name = 'selected'

urlpatterns = [
    path('selected/', views.add_to_selected, name='add_to_selected'),
    path('films/', views.get_selected, name='get_selected'),
    path('films/<int:movie_id>/', views.remove_from_selected, name='remove_from_selected'),
]
