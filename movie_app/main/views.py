import time
import random
import requests
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from decouple import config
from .serializers import MovieSerializer
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
import hashlib


MAX_CACHE_SIZE = 200
CACHE_TIMEOUT = 1 * 60 * 60


User = get_user_model()


def index(request):
    return render(request, 'main/index.html')


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    required_fields = ["username", "password", "email", "name", "surname"]

    for field in required_fields:
        if field not in data:
            return Response({"error": f"Поле '{field}' обязательно"}, status=400)

    if User.objects.filter(username=data["username"]).exists():
        return Response({"error": "Пользователь с таким логином уже существует"}, status=400)

    user = User.objects.create(
        username=data["username"],
        email=data["email"],
        first_name=data["name"],   
        last_name=data["surname"],
        password=make_password(data["password"])
    )
    
    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Пользователь создан",
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "username": user.username,
            "email": user.email,
            "name": user.first_name,  
            "surname": user.last_name, 
        }
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "name": user.first_name,   
        "surname": user.last_name, 
    })


@api_view(['GET'])
def search_movie(request):
    query = request.GET.get('query')
    if not query:
        return Response({'error': 'query parameter is required'}, status=400)

    headers = {
        "X-API-KEY": config("KINOPOISK_API_KEY")
    }
    url = "https://api.kinopoisk.dev/v1.4/movie/search"

    try:
        print(f"Making request to Kinopoisk API with query: {query}")
        api_response = requests.get(url, headers=headers, params={'query': query})
        print(f"API response status: {api_response.status_code}")
        data = api_response.json()
        print(f"API response data: {data}")

        if data.get('docs'):
            movies = []
            for film in data['docs']:
                movie_data = {
                    'title': film.get('name', 'No title'),
                    'year': film.get('year', 'No year'),
                    'rating': film.get('rating', 'No rating'),
                    'description': film.get('description', 'No description'),
                    'poster': film.get('poster', {}).get('url', 'No poster URL')
                }
                serializer = MovieSerializer(movie_data)
                movies.append(serializer.data)

            return Response(movies)

        return Response({'error': 'No films found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


def cleanup_cache(cached_movies_meta):
    to_delete = []
    for movie_id, timestamp in cached_movies_meta.items():
        if not cache.get(f"movie:{movie_id}"):
            to_delete.append(movie_id)
    for movie_id in to_delete:
        del cached_movies_meta[movie_id]
    return cached_movies_meta


@api_view(['GET'])
def random_movie(request):
    cached_movies_meta = cache.get("cached_movies_meta") or {}
    exclude_ids = request.query_params.getlist("exclude")
    exclude_ids = exclude_ids[-200:] 

    cached_movies_meta = cleanup_cache(cached_movies_meta)

    available_ids = [mid for mid in cached_movies_meta if mid not in exclude_ids]

    if len(cached_movies_meta) < 50 or not available_ids:
        headers = {"X-API-KEY": config("KINOPOISK_API_KEY")}
        url = "https://api.kinopoisk.dev/v1.4/movie"
        try:
            if not cached_movies_meta or not available_ids:
                for mid in cached_movies_meta.keys():
                    cache.delete(f"movie:{mid}")
                cached_movies_meta.clear()

            for _ in range(5):
                params = {
                    "page": random.randint(1, 100),
                    "limit": 10,
                    "notNullFields": "poster.url",
                    "rating.kp": "6.0-10",
                }
                response = requests.get(url, headers=headers, params=params)
                response.raise_for_status()
                docs = response.json().get('docs', [])

                for movie_data in docs:
                    movie_id = str(movie_data.get('id'))
                    if not movie_id or movie_id in cached_movies_meta:
                        continue

                    if len(cached_movies_meta) >= MAX_CACHE_SIZE:
                        # Удаляем самый старый фильм
                        oldest_id = min(cached_movies_meta, key=cached_movies_meta.get)
                        cache.delete(f"movie:{oldest_id}")
                        del cached_movies_meta[oldest_id]

                    cache.set(f"movie:{movie_id}", movie_data, CACHE_TIMEOUT)
                    cached_movies_meta[movie_id] = time.time()

                cache.set("cached_movies_meta", cached_movies_meta, None)

                available_ids = [mid for mid in cached_movies_meta if mid not in exclude_ids]
                if available_ids:
                    break

        except requests.RequestException:
            pass

    if available_ids:
        movie_id = random.choice(available_ids)
        movie = cache.get(f"movie:{movie_id}")
        if movie:
            return Response(movie)

    return Response({"error": "Фильмы не найдены"}, status=404)


@api_view(['GET'])
def get_movie_image(request):
    movie_id = request.GET.get("movieId")
    image_type = request.GET.get("type", "cover")

    if not movie_id:
        return Response({"error": "movieId is required"}, status=400)

    headers = {
        "X-API-KEY": config("KINOPOISK_API_KEY")
    }
    url = "https://api.kinopoisk.dev/v1.4/image"

    try:
        response = requests.get(url, headers=headers, params={"movieId": movie_id, "type": image_type})
        response.raise_for_status()
        return Response(response.json())
    except requests.RequestException as e:
        return Response({"error": str(e)}, status=500)