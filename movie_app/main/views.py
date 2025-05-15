import random
import requests
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
# from rest_framework.authtoken.models import Token
from decouple import config
from .serializers import MovieSerializer
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()


def index(request):
    return render(request, 'main/index.html')


# @api_view(["POST"])
# def login(request):
#     print("METHOD:", request.method)
#     print("HEADERS:", request.headers)
#     print("BODY:", request.body)
#     print("DATA:", request.data)
#     print("Получены данные:", request.data)
#     username = request.data.get("username")
#     password = request.data.get("password")

#     if not username or not password:
#         return JsonResponse({"error": "Учетные данные не были предоставлены."}, status=400)

#     if not User.objects.filter(username=username).exists():
#         return JsonResponse({"error": "Аккаунта с таким логином нет"}, status=400)

#     user = authenticate(request, username=username, password=password)
#     if user is None:
#         return JsonResponse({"error": "Неверный пароль"}, status=400)

#     token, created = Token.objects.get_or_create(user=user)
#     return JsonResponse({"token": token.key})


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


@api_view(['GET'])
def random_movie(request):
    api_key = config("KINOPOISK_API_KEY", default=None)
    if not api_key:
        return Response({"error": "KINOPOISK_API_KEY не установлена в среде"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    headers = {
        "X-API-KEY": config("KINOPOISK_API_KEY")
    }

    url = "https://api.kinopoisk.dev/v1.4/movie"
    for _ in range(10): 
        try:
            params = {
                "page": random.randint(1, 100), 
                "limit": 1, 
                "notNullFields": "poster.url",  
                "rating.kp": "6.0-10",  
            }

            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            docs = response.json().get('docs', [])
            if not docs:
                print("⚠️ API вернул пустой список фильмов, пробуем снова...")
                continue 

            movie_data = docs[0]

            movie_title = movie_data.get('name', 'Название не доступно')
            poster_available = 'Есть постер' if 'poster' in movie_data else 'Постер не найден'

            print(f"Название фильма: {movie_title}")
            print(f"Наличие постера: {poster_available}")

            movie_id = movie_data.get('id')
            if not movie_id:
                return Response({"error": "Movie ID is missing"}, status=400)

            return Response(movie_data)

        except requests.RequestException as e:
            print(f"Ошибка при запросе к Kinopoisk API: {e}")
            return Response({"error": "Ошибка при запросе к Kinopoisk API"}, status=500)


    return Response({"error": "Не удалось найти фильм с рейтингом выше 6.0"}, status=404)


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