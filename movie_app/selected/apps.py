from django.apps import AppConfig


class SelectedConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'selected'
    verbose_name = 'Избранные'