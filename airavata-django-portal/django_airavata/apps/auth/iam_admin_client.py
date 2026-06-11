"""IAM admin operations via the gRPC ``iam`` facade.

These operations run in admin/service contexts (e.g. the user-management admin
views), so they use a Keycloak **service-account** token rather than a logged-in
user's token. Each call builds a short-lived ``AiravataClient`` scoped to that
token and talks to the gRPC ``iam`` facade; callers consume the returned protobuf
``UserProfile`` directly (``user_id``/``first_name``/``last_name``/``emails``).

``update_username`` talks to the Keycloak admin REST API directly (not the gRPC
backend).
"""

import logging
from contextlib import contextmanager
from urllib.parse import urlparse

import requests
from django.conf import settings

from django_airavata.airavata_grpc import build_airavata_client

from . import utils

logger = logging.getLogger(__name__)


@contextmanager
def _iam():
    """Yield the gRPC ``iam`` facade scoped to the Keycloak service account.

    The IAM admin operations resolve the Keycloak realm from the request's
    gateway claim, so the service-account client carries ``gatewayID`` in its
    ``x-claims`` metadata (mirroring the legacy service-account ``AuthzToken``).
    """
    access_token = utils.get_service_account_authz_token().accessToken
    client = build_airavata_client(
        access_token, claims={"gatewayID": settings.GATEWAY_ID}
    )
    try:
        yield client.iam
    finally:
        client.close()


def is_username_available(username):
    with _iam() as iam:
        return iam.is_username_available(username)


def enable_user(username):
    with _iam() as iam:
        return iam.enable_user(username)


def delete_user(username):
    with _iam() as iam:
        return iam.delete_iam_user(username)


def get_user(username):
    with _iam() as iam:
        return iam.get_iam_user(username)


def get_users(offset, limit, search=None):
    with _iam() as iam:
        return iam.get_iam_users(offset, limit, search or "")


def update_username(username, new_username):
    # make sure that new_username is available
    if not is_username_available(new_username):
        raise Exception(
            f"Can't change username of {username} to {new_username} because it is not available"
        )
    # fetch user representation
    authz_token = utils.get_service_account_authz_token()
    headers = {"Authorization": f"Bearer {authz_token.accessToken}"}
    parsed = urlparse(settings.KEYCLOAK_AUTHORIZE_URL)
    r = requests.get(
        f"{parsed.scheme}://{parsed.netloc}/auth/admin/realms/{settings.GATEWAY_ID}/users",
        params={"username": username},
        headers=headers,
    )
    r.raise_for_status()
    user_list = r.json()
    user = None
    # The users search finds partial matches. Loop to find the exact match.
    for u in user_list:
        if u["username"] == username:
            user = u
            break
    if user is None:
        raise Exception(f"Could not find user {username}")

    # update username
    user["username"] = new_username
    r = requests.put(
        f"{parsed.scheme}://{parsed.netloc}/auth/admin/realms/{settings.GATEWAY_ID}/users/{user['id']}",
        json=user,
        headers=headers,
    )
    r.raise_for_status()
