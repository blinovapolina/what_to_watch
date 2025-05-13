from rest_framework import serializers

class MovieSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    year = serializers.IntegerField()
    rating = serializers.FloatField()
    description = serializers.CharField()
    poster = serializers.URLField()  # Добавляем поле для постера (URL)

    def update(self, instance, validated_data):
        # Логика для обновления объекта, если необходимо
        pass

    def create(self, validated_data):
        # Логика для создания объекта, если необходимо
        pass
