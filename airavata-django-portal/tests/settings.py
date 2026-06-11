from django_airavata.settings import *  # noqa

# Above imports the common settings, can override them below as needed.
# The portal has no database; tests inherit the dummy backend from settings.py.

# Settings that are expected to be defined in settings_local.py
AIRAVATA_API_HOST = "localhost"
AIRAVATA_API_PORT = 8930
AIRAVATA_API_SECURE = False

PROFILE_SERVICE_HOST = AIRAVATA_API_HOST
PROFILE_SERVICE_PORT = 8962
PROFILE_SERVICE_SECURE = False

PORTAL_TITLE = "Django Airavata Gateway"  # ty: ignore[invalid-assignment]  # overriding a star-imported settings value; literal-narrowing false positive
