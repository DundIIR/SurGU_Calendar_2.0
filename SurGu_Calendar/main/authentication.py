from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings


class BearerAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise AuthenticationFailed("Токен не предоставлен")
        parts = auth_header.split()
        if parts[0].lower() != "bearer":
            raise AuthenticationFailed("Неверный формат токена")
        elif len(parts) == 1:
            raise AuthenticationFailed("Токен не предоставлен")
        elif len(parts) > 2:
            raise AuthenticationFailed("Неверный формат токена")
        token = parts[1]
        try:
            decoded_token = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            print(decoded_token)
            email = decoded_token.get("email")
            if not email:
                raise AuthenticationFailed("Email не найден в токене")
            User = get_user_model()
            user = User.objects.filter(email=email).first()
            if not user:
                user = User.objects.create(
                    email=email,
                    password=decoded_token.get("sub"),
                    is_active=True,
                )
                user.save()

            return (user, None)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Токен истёк")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Неверный токен")
