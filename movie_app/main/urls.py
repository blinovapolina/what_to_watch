from django.urls import path
from main import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'main'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/search/', views.search_movie, name='search_movie'),
    path('api/random-movie/', views.random_movie, name='random_movie'),
    path('api/image/', views.get_movie_image, name='get_movie_image'),
    path('api/login/', views.login, name='login'), 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
