# Generated by Django 4.2.13 on 2024-05-19 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Email')),
                ('password', models.CharField(max_length=128, verbose_name='Пароль')),
                ('date_joined', models.DateTimeField(auto_now_add=True, verbose_name='Дата регистрации')),
                ('last_login', models.DateTimeField(auto_now=True, null=True, verbose_name='Дата последнего входа')),
                ('is_superuser', models.BooleanField(default=False, verbose_name='Администратор')),
                ('is_staff', models.BooleanField(default=False, verbose_name='Сотрудник')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активный')),
                ('is_professor', models.BooleanField(default=False, verbose_name='Преподаватель')),
                ('is_student', models.BooleanField(default=False, verbose_name='Студент')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': '"Пользователь"',
                'verbose_name_plural': '"Пользователь"',
                'ordering': ['is_active', 'is_superuser', 'is_staff', 'is_professor', 'is_student'],
            },
        ),
    ]