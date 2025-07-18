from typing import Any

from django.contrib.auth.models import AbstractUser
from django.http import HttpRequest, QueryDict


# Type stub to extend Django's HttpRequest with custom attributes added by middleware
class AiravataHttpRequest(HttpRequest):
    airavata_client: Any
    profile_service: dict[str, Any]
    authz_token: Any
    gateway_id: str
    username: str
    is_gateway_admin: bool
    is_read_only_gateway_admin: bool
    query_params: QueryDict
    data: dict[str, Any]
    user: 'AiravataUser'
    META: dict[str, str]

# Type stub to extend Django's User model with custom attributes
class AiravataUser(AbstractUser):
    user_profile: Any
