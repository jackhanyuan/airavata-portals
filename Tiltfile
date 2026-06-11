# -*- mode: Python -*-
# airavata-portals tenant. Prereq: ./devstack/devstack setup (shared with airavata).
# Run on a distinct Tilt port:  tilt up --port 10351
# Tiltfiles are Starlark, not Python: no `import`; `os` is built in (getenv/putenv only).
PROFILE = os.getenv('DEVSTACK_PROFILE', 'airavata')
os.putenv('DOCKER_HOST', 'unix://%s/.colima/%s/docker.sock' % (os.getenv('HOME'), PROFILE))
PORTAL = 'airavata-django-portal'
SETTINGS = PORTAL + '/django_airavata/settings_local.py'
SDK_SRC = '../airavata/airavata-python-sdk'

# Stage the sibling airavata-python-sdk into the portal build context. It's an editable
# path dependency that lives in the sibling airavata repo, outside this build context, so
# the Dockerfile can't COPY it directly. This rsync mirrors it into .devstack-sdk/ (gitignored)
# and re-runs when the SDK changes, which retriggers the image build.
local_resource('stage-sdk',
    cmd='mkdir -p %s/.devstack-sdk && rsync -a --delete --exclude .venv --exclude __pycache__ --exclude .git %s/ %s/.devstack-sdk/airavata-python-sdk/' % (PORTAL, SDK_SRC, PORTAL),
    deps=[SDK_SRC], labels=['django-portal'])

local_resource('portal-settings', cmd='''
set -e
f="%s"
if [ ! -f "$f" ]; then cat > "$f" <<'EOF'
DEBUG = True
ALLOWED_HOSTS = ['.airavata.host', 'localhost', '127.0.0.1']
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CSRF_TRUSTED_ORIGINS = ['https://gateway.airavata.host']
KEYCLOAK_CLIENT_ID = 'pga'
KEYCLOAK_CLIENT_SECRET = 'm36BXQIxX3j3VILadeHMK5IvbOeRlCCc'
KEYCLOAK_AUTHORIZE_URL = 'https://auth.airavata.host/realms/default/protocol/openid-connect/auth'
KEYCLOAK_TOKEN_URL = 'https://auth.airavata.host/realms/default/protocol/openid-connect/token'
KEYCLOAK_USERINFO_URL = 'https://auth.airavata.host/realms/default/protocol/openid-connect/userinfo'
KEYCLOAK_LOGOUT_URL = 'https://auth.airavata.host/realms/default/protocol/openid-connect/logout'
KEYCLOAK_VERIFY_SSL = False
GATEWAY_ID = 'default'
GRPC_API_HOST = 'airavata-server'
GRPC_API_PORT = 9090
GRPC_API_SECURE = False
PORTAL_TITLE = 'Airavata Django Portal (devstack)'
EOF
fi
''' % SETTINGS, labels=['django-portal'])

local_resource('devstack-ensure', cmd='./devstack/devstack ensure',
               resource_deps=['portal-settings'], labels=['platform'])

# NOTE: no `only=` — in Tilt that restricts the build CONTEXT (not just rebuild triggers),
# and the Dockerfile needs the whole portal source (django_airavata/, scripts/, .devstack-sdk/).
# .dockerignore already trims node_modules/.venv/dist. Runtime source edits flow through the
# bind-mount + polling reload; dep changes (uv.lock) rebuild the image.
docker_build('airavata-django-portal:dev', PORTAL, dockerfile=PORTAL + '/Dockerfile')

docker_compose(PORTAL + '/compose.yml')
dc_resource('airavata-django-portal', resource_deps=['devstack-ensure', 'stage-sdk'], labels=['django-portal'],
            links=[link('https://gateway.airavata.host', 'Gateway Portal')])
