#!/bin/bash
# The portal has no database, so there is nothing to migrate — just serve.
exec python manage.py runserver 0.0.0.0:8000
