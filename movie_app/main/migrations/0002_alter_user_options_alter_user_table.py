# Generated by Django 5.1.7 on 2025-04-04 19:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'Пользователь', 'verbose_name_plural': 'Пользователи'},
        ),
        migrations.AlterModelTable(
            name='user',
            table='user',
        ),
    ]
