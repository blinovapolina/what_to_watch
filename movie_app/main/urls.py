from django.urls import path
from main import views

app_name = 'main'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/search/', views.search_movie, name='search_movie'),
    path('api/random-movie/', views.random_movie, name='random_movie'),
    path('api/image/', views.get_movie_image, name='get_movie_image'),
]
