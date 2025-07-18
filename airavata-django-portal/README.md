# Apache Airavata Django Portal

![Build Status](https://github.com/apache/airavata-django-portal/actions/workflows/build-and-test.yaml/badge.svg)
[![Build Status](https://readthedocs.org/projects/apache-airavata-django-portal/badge/?version=latest)](https://apache-airavata-django-portal.readthedocs.io/en/latest/?badge=latest)

The Airavata Django Portal is a web interface to the
[Apache Airavata](http://airavata.apache.org/) API implemented using the Django
web framework. The intention is that the Airavata Django Portal can be used as
is for a full featured web based science gateway but it can also be customized
through various plugins to add more domain specific functionality as needed.

## Getting Started

The following steps will help you quickly get started with running the Airavata
Django Portal locally. This will allow you to try it out and can also be used as
a development environment. If you just want to run the Airavata Django Portal
locally, see the Docker instructions below for a more simplified approach.

The Airavata Django Portal works with Python versions 3.6 - 3.10. You'll need
one of these versions installed locally.

You'll also need Node.js and yarn to build the JavaScript frontend code. Please
install Node.js version 19. You
can also use [nvm](https://github.com/nvm-sh/nvm) to manage the Node.js install.
If you have nvm installed you can run `nvm install && nvm use` before running
any yarn commands. See
[the Yarn package manager](https://classic.yarnpkg.com/lang/en/) for information
on how to install Yarn 1 (Classic).

1.  Checkout this project and create a virtual environment.

    ```
    git clone https://github.com/apache/airavata-portals.git
    cd airavata-portals/airavata-django-portal
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip setuptools wheel
    pip install .
    ```

    - **Windows note**: Use ```venv\Scripts\activate``` instead of ```source venv/bin/activate```
      <!-- https://docs.python.org/3/library/venv.html -->

    - **macOS note**: to install the MySQL dependencies you need to have the
      MySQL development headers and libraries installed. Also, on macOS you need
      to have openssl installed. See the
      [mysqlclient-python installation notes](https://github.com/PyMySQL/mysqlclient-python#install)
      for more details.

2.  Create a local settings file.

    - Option 1 (**recommended**). The best way to get a local settings file is
      to download one from an existing Airavata Django Portal instance. If you
      have Admin access, you can log in, go to _Settings_ and then _Developer
      Console_ (/admin/developers) and download a `settings_local.py` file for
      local development. Save it to the `django_airavata/` directory.

    - Option 2. Otherwise, if you know the hostname and ports of an Airavata
      deployment, you can copy `django_airavata/settings_local.py.sample` to
      `django_airavata/settings_local.py` and edit the contents to match your
      Keycloak and Airavata server deployments.

      ```
      cp django_airavata/settings_local.py.sample django_airavata/settings_local.py
      ```

3.  Run Django migrations

    ```
    python manage.py migrate
    ```

4.  Build the JavaScript sources. There are a few JavaScript packages in the
    source tree, colocated with the Django apps in which they are used. The
    `build_js.sh` script will build them all.

    ```
    ./build_js.sh
    ```

    - **Window note**: on Windows, run `.\build_js.bat` instead

5.  Load the default Wagtail CMS pages.

    ```
    python manage.py load_cms_data new_default_theme
    ```

6.  Run the server

    ```
    python manage.py runserver
    ```

7.  Point your browser to http://localhost:8000.

## Docker instructions

To run the Django Portal as a Docker container, you need a `settings_local.py`
file which you can create from the `settings_local.py.sample` file. Then run the
following:

1. Build the Docker image.

   ```
   docker build -t airavata-django-portal .
   ```

2. Run the Docker container.

   ```
   docker run -d \
     -v /path/to/my/settings_local.py:/code/django_airavata/settings_local.py \
     -p 8000:8000 airavata-django-portal
   ```

3. Load an initial set of Wagtail pages (theme). You only need to do this when
   starting the container for the first time.

   ```
   docker exec CONTAINER_ID python manage.py load_cms_data new_default_theme
   ```

4. Point your browser to http://localhost:8000.

### Multi-architecture images

To build and push
[multi-architecture images](https://docs.docker.com/desktop/multi-arch/), first
create a builder (one time)

```
docker buildx create --name mybuilder --use
```

then run

```
docker buildx build --pull --platform linux/amd64,linux/arm64 -t apache/airavata-django-portal:latest --push .
```

## Documentation

Documentation currently is available at
https://apache-airavata-django-portal.readthedocs.io/en/latest/ (built from the
'docs' directory).

To build the documentation locally, first
[set up a development environment](#setting-up-development-environment), then
run the following in the root of the project:

```
mkdocs serve
```

## Feedback

Please send feedback to the mailing list at <dev@airavata.apache.org>. If you
encounter bugs or would like to request a new feature you can do so in the
[Airavata Jira project](https://issues.apache.org/jira/projects/AIRAVATA) (just
select the _Django Portal_ component when you make your issue).

## Customization

See the Customization Guide in the
[documentation](https://apache-airavata-django-portal.readthedocs.io/en/latest/)
for information on how to customize the Airavata Django Portal user interface.
To get started we recommend going through the
[Gateways Tutorial](https://apache-airavata-django-portal.readthedocs.io/en/latest/tutorial/gateways_tutorial/).
This tutorial covers the different ways that the user interface can be
customized.

## Contributing

For general information on how to contribute, please see the
[Get Involved](http://airavata.apache.org/get-involved.html) section of the
Apache Airavata website.

### Setting up development environment

Run `pip install -r requirements-dev.txt` to install development and testing
libraries.

Use a code editor that integrates with editorconfig and flake8. I also recommend
autopep8 for automatically formatting code to follow the PEP8 guidelines.
Prettier is used for formatting JavaScript and Vue.js code.

See the docs for more information on
[developing the backend](./docs/dev/developing_backend.md) and
[frontend code](./docs/dev/developing_frontend.md).

### Running Django Tests

Run `./runtests.py` to run the Django unit tests.

## License

The Apache Airavata Django Portal is licensed under the Apache 2.0 license. For
more information see the [LICENSE](LICENSE) file.


# Airavata Django Portal Commons

Utilities for working with dynamically loaded Django apps.

## Getting Started

Install this package with pip

```
pip install airavata-django-portal-commons
```

### Dynamically loaded Django apps

1. At the end of your Django server's settings.py file add

```python
import sys
from airavata_django_portal_commons import dynamic_apps

# Add any dynamic apps installed in the virtual environment
dynamic_apps.load(INSTALLED_APPS)

# (Optional) merge WEBPACK_LOADER settings from custom Django apps
settings_module = sys.modules[__name__]
dynamic_apps.merge_settings(settings_module)
```

- Note: if the dynamic Django app uses WEBPACK_LOADER, keep in mind that it is
  important that the version of
  [django-webpack-loader](https://github.com/django-webpack/django-webpack-loader)
  and the version of webpack-bundle-tracker be compatible. If you're using
  django-webpack-loader prior to version 1.0 then a known good pair of versions
  is django-webpack-loader==0.6.0 and webpack-bundle-tracker==0.4.3.

2. Also add
   `'airavata_django_portal_commons.dynamic_apps.context_processors.custom_app_registry'`
   to the context_processors list:

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ...
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                ...
                'airavata_django_portal_commons.dynamic_apps.context_processors.custom_app_registry',
            ],
        },
    },
]
```

3. In your urls.py file add the following to the urlpatterns

```python
urlpatterns = [
    # ...
    path('', include('airavata_django_portal_commons.dynamic_apps.urls')),
]
```

## Creating a dynamically loaded Django app

See
https://apache-airavata-django-portal.readthedocs.io/en/latest/dev/custom_django_app/
for the latest information.

Note that by default the
[cookiecutter template](https://github.com/machristie/cookiecutter-airavata-django-app)
registers Django apps under the entry_point group name of `airavata.djangoapp`,
but you can change this. Just make sure that when you call `dynamic_apps.load`
that you pass as the second argument the name of the entry_point group.

## Developing

### Making a new release

1. Update the version in setup.cfg.
2. Commit the update to setup.cfg.
3. Tag the repo with the same version, with the format `v${version_number}`. For
   example, if the version number in setup.cfg is "1.2" then tag the repo with
   "v1.2".

   ```
   VERSION=...
   git tag -m $VERSION $VERSION
   git push --follow-tags
   ```

4. In a clean checkout

   ```
   cd /tmp/
   git clone /path/to/airavata-django-portal-commons/ -b $VERSION
   cd airavata-django-portal-commons
   python3 -m venv venv
   source venv/bin/activate
   python3 -m pip install --upgrade pip build
   python3 -m build
   ```

5. Push to pypi.org. Optionally can push to test.pypi.org. See
   <https://packaging.python.org/tutorials/packaging-projects/> for more info.

   ```
   python3 -m pip install --upgrade twine
   python3 -m twine upload dist/*
   ```

# Airavata Django Portal SDK

[![Build Status](https://travis-ci.com/apache/airavata-django-portal-sdk.svg?branch=master)](https://travis-ci.com/apache/airavata-django-portal-sdk)

The Airavata Django Portal SDK provides libraries that assist in developing
custom Django app extensions to the
[Airavata Django Portal](https://github.com/apache/airavata-django-portal).

See the documentation at https://airavata-django-portal-sdk.readthedocs.io/ for
more details.

## Getting Started

To integrate the SDK with an Airavata Django Portal custom app, add

```
airavata-django-portal-sdk
```

to the `install_requires` list in your setup.cfg or setup.py file. Then
reinstall the Django app with

```
pip install -e .
```

(see your Airavata Django custom app's README for details)

You can also just install the library with:

```
pip install airavata-django-portal-sdk
```

## Migrations

```
django-admin makemigrations --settings=airavata_django_portal_sdk.tests.test_settings airavata_django_portal_sdk
```

## Developing

### Setting up dev environment

To generate the documentation,
[create a virtual environment](https://docs.python.org/3/tutorial/venv.html) and
then:

```
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements-dev.txt
```

### Documentation

```
mkdocs serve
```

### Running tests

```
pytest
```

or

```
django-admin test --settings airavata_django_portal_sdk.tests.test_settings
```

or use tox to run the tests in all supported Python environments

```
tox
```

### Running flake8

```
flake8 .
```

### Automatically formatting Python code

```
autopep8 -i -aaa -r .
isort .
```

### Making a new release

1. Update the version in setup.py
2. Tag the repo with the same version, with the format `v${version_number}`. For
   example, if the version number in setup.py is "1.2" then tag the repo with
   "v1.2".

   ```
   VERSION=...
   git tag -m $VERSION $VERSION
   git push --follow-tags
   ```

3. In a clean checkout

   ```
   cd /tmp/
   git clone /path/to/airavata-django-portal-sdk/ -b $VERSION
   cd airavata-django-portal-sdk
   python3 -m venv venv
   source venv/bin/activate
   python3 -m pip install --upgrade build
   python3 -m build
   ```

4. Push to pypi.org. Optionally can push to test.pypi.org. See
   <https://packaging.python.org/tutorials/packaging-projects/> for more info.

   ```
   python3 -m pip install --upgrade twine
   python3 -m twine upload dist/*
   ```

