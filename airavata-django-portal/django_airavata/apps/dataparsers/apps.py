from django_airavata.app_config import AiravataAppConfig


class DataParsersConfig(AiravataAppConfig):
    name = 'django_airavata.apps.dataparsers'
    label = 'django_airavata_dataparsers'
    verbose_name = 'Data Parsers'

    @property
    def app_order(self):
        return 20

    @property
    def url_home(self):
        return 'django_airavata_dataparsers:home'

    @property
    def fa_icon_class(self):
        return 'fa-copy'

    @property
    def app_description(self):
        return """
        Define data parsers for post-processing experimental and ad-hoc
        datasets.
    """

    nav = [
        {
            'label': 'Home',
            'icon': 'fa fa-home',
            'url': 'django_airavata_dataparsers:home',
        },
    ]

    def enabled(self, request):
        return getattr(request, 'is_gateway_admin', False)
