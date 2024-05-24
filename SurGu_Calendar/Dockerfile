FROM python:alpine

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Устанавливаем обновления и необходимые модули

# Обновление pip python
RUN pip install --upgrade pip

# Установка пакетов для проекта
COPY requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

WORKDIR /app

# Копирование проекта
COPY . .