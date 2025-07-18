from django_airavata.app_config import AiravataAppConfig


class GroupsConfig(AiravataAppConfig):
    name = 'django_airavata.apps.groups'
    label = 'django_airavata_groups'
    verbose_name = 'Groups'

    @property
    def app_order(self):
        return 10

    @property
    def url_home(self):
        return 'django_airavata_groups:manage'

    @property
    def fa_icon_class(self):
        return 'fa-users'

    @property
    def app_description(self):
        return """
        Create and manage user groups.
    """

    nav = [
        {
            'label': 'Groups',
            'icon': 'fa fa-users',
            'url': 'django_airavata_groups:manage',
        },
    ]
