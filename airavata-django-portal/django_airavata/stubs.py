from typing import Dict, Any, Optional
from django.http import HttpRequest, QueryDict
from django.contrib.auth.models import AbstractUser

# Type stub to extend Django's HttpRequest with custom attributes added by middleware
class AiravataHttpRequest(HttpRequest):
    airavata_client: Any
    profile_service: Dict[str, Any]
    authz_token: Any
    gateway_id: str
    username: str
    is_gateway_admin: bool
    is_read_only_gateway_admin: bool
    query_params: QueryDict
    data: Dict[str, Any]
    user: 'AiravataUser'

# Type stub to extend Django's User model with custom attributes
class AiravataUser(AbstractUser):
    user_profile: Any 