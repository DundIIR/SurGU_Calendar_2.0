# Generated by Django 4.2.13 on 2024-05-19 06:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_audience_department_discipline_divisionrelations_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number_group', models.CharField(max_length=100, unique=True, verbose_name='Номер')),
                ('speciality', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.speciality', verbose_name='Специальность')),
            ],
            options={
                'verbose_name': '"Учебная группа"',
                'verbose_name_plural': '"Учебная группа"',
                'ordering': ['speciality', 'number_group'],
            },
        ),
        migrations.CreateModel(
            name='Subgroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_subgroup', models.CharField(blank=True, max_length=100, null=True, verbose_name='Буква')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.group', verbose_name='Группа')),
                ('relations', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.divisionrelations', verbose_name='Отношение с отделом')),
            ],
            options={
                'verbose_name': '"Учебная подгруппа"',
                'verbose_name_plural': '"Учебная подгруппа"',
                'ordering': ['group', 'name_subgroup'],
            },
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_schedule', models.DateField(verbose_name='Дата начала')),
                ('end_schedule', models.DateField(verbose_name='Дата конца')),
                ('file', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.file', verbose_name='Файл')),
                ('subgroup', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.subgroup', verbose_name='Группа/Подгруппа')),
            ],
            options={
                'verbose_name': '"Расписание"',
                'verbose_name_plural': '"Расписание"',
                'ordering': ['start_schedule', 'subgroup'],
            },
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('audience', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.audience', verbose_name='Аудитория')),
                ('campus', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.campus', verbose_name='Корпус')),
                ('day', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.week', verbose_name='День недели')),
                ('discipline', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.discipline', verbose_name='Дисциплина')),
                ('professor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.professor', verbose_name='Преподаватель')),
                ('repetition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.repetition', verbose_name='Регулярность')),
                ('schedule', models.ManyToManyField(to='main.schedule', verbose_name='Номер расписания')),
                ('time', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.time', verbose_name='Время')),
                ('type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.type', verbose_name='Тип')),
            ],
            options={
                'verbose_name': '"Занятие"',
                'verbose_name_plural': '"Занятие"',
                'ordering': ['discipline', 'day', 'time'],
            },
        ),
        migrations.AddField(
            model_name='student',
            name='subgroup',
            field=models.ManyToManyField(to='main.subgroup', verbose_name='Группа/Подгруппа'),
        ),
    ]