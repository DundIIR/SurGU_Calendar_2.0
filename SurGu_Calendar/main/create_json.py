from datetime import datetime, timedelta

list_days_of_week = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
time_zone = 'Asia/Yekaterinburg:'


def create_json(instance):
    json = dict()
    schedules = instance.schedule.all()
    for schedule in schedules:
        id_week_of_day = schedule.start_schedule.weekday()
        id_week_of_day_lesson = list_days_of_week.index(str(instance.day))
        if id_week_of_day_lesson >= id_week_of_day:
            plus_days = id_week_of_day_lesson - id_week_of_day
            flag = True
        else:
            plus_days = id_week_of_day_lesson - id_week_of_day + 7
            flag = False

        if str(instance.repetition) in ['Числитель', 'Каждую неделю'] and flag:
            date_start_lesson = schedule.start_schedule + timedelta(days=plus_days)
        elif str(instance.repetition) in ['Знаменатель', 'Каждую неделю'] and not flag:
            date_start_lesson = schedule.start_schedule + timedelta(days=plus_days)
        else:
            date_start_lesson = schedule.start_schedule + timedelta(days=plus_days + 7)

        repetition = ''
        if str(instance.repetition) in ['Числитель', 'Знаменатель']:
            repetition = ';INTERVAL=2'

        json['datetime_start_lesson'] = (time_zone + str(date_start_lesson.strftime('%Y%m%d')) +
                                         'T' + str(instance.time.time_start.strftime('%H%M%S')))
        json['datetime_end_lesson'] = (time_zone + str(date_start_lesson.strftime('%Y%m%d')) +
                                       'T' + str(instance.time.time_end.strftime('%H%M%S')))
        json['repetition'] = str(schedule.end_schedule.strftime('%Y%m%d')) + 'T235959' + repetition
        json['create'] = str(datetime.now().strftime('%Y%m%d'))
        json['location'] = instance.campus.reduction+instance.audience.number_audience+' '+instance.type.name_type
        json['summary'] = instance.discipline.name_discipline
        json['description'] = (f"{instance.professor.last_name} {instance.professor.first_name[0]}."
                               f"{instance.professor.patronymic[0]}.")
        json['subgroup'] = f"{schedule.subgroup.group.number_group} {schedule.subgroup.name_subgroup}"
    return json
