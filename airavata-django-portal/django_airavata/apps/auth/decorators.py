"""DB-free auth decorators.

``django.contrib.auth.decorators.login_required`` cannot be used once
``django.contrib.auth`` / ``django.contrib.contenttypes`` are removed from
``INSTALLED_APPS``: its anonymous-redirect path lazily imports
``django.contrib.auth.views`` -> ``forms`` -> ``models`` ->
``contenttypes.models``, which raises because those model classes have no
installed app. Identity here comes from the verified Keycloak token, so this is
a minimal ``request.user.is_authenticated`` check that redirects to
``settings.LOGIN_URL`` with the usual ``?next=`` parameter.
"""

from functools import wraps
from urllib.parse import urlparse, urlunparse

from django.conf import settings
from django.http import HttpResponseRedirect, QueryDict
from django.shortcuts import resolve_url


def login_required(view_func=None, redirect_field_name="next", login_url=None):
    def decorator(view):
        @wraps(view)
        def _wrapped(request, *args, **kwargs):
            if getattr(request.user, "is_authenticated", False):
                return view(request, *args, **kwargs)
            resolved_url = resolve_url(login_url or settings.LOGIN_URL)
            parts = list(urlparse(resolved_url))
            if redirect_field_name:
                querystring = QueryDict(parts[4], mutable=True)
                querystring[redirect_field_name] = request.get_full_path()
                parts[4] = querystring.urlencode(safe="/")
            return HttpResponseRedirect(urlunparse(parts))

        return _wrapped

    if view_func:
        return decorator(view_func)
    return decorator
