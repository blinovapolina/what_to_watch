from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from decouple import config
import requests
from .models import Selected, Movie


def add_movie_to_db(movie_id):
    api_key = config("KINOPOISK_API_KEY")
    if not api_key:
        raise Exception("KINOPOISK_API_KEY не настроен")

    headers = {
        "X-API-KEY": api_key
    }

    url = f"https://api.kinopoisk.dev/v1.4/movie/{movie_id}"

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Kinopoisk API вернул ошибку {response.status_code}")

    movie_data = response.json()

    if not movie_data.get('id'):
        raise Exception("Некорректные данные фильма из API")

    movie = Movie.objects.create(
        id=movie_data['id'],
        title=movie_data.get('name', 'No title'),
        genre=movie_data.get('genres')[0]['name'] if movie_data.get('genres') else '',
        description=movie_data.get('description', ''),
        image=movie_data.get('poster', {}).get('previewUrl', ''),
        year=movie_data.get('year', None)
    )
    return movie


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_selected(request):
    movie_id = request.data.get('movie_id')
    if not movie_id:
        return Response({"error": "Movie ID required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        try:
            movie = add_movie_to_db(movie_id)
        except Exception as e:
            return Response({"error": "Movie not found and cannot be added"}, status=status.HTTP_404_NOT_FOUND)

    Selected.objects.get_or_create(user=request.user, movie=movie)
    return Response({"message": "Movie added to selected"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_selected(request):
    selecteds = Selected.objects.filter(user=request.user).select_related('movie')
    movies_data = []

    for sel in selecteds:
        movie = sel.movie
        movies_data.append({
            "id": movie.id,
            "title": movie.title,
            "genre": movie.genre,
            "description": movie.description,
            "image": movie.image,
            "year": movie.year,
        })

    return Response(movies_data, status=status.HTTP_200_OK)


