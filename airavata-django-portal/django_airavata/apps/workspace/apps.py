from django_airavata.app_config import AiravataAppConfig


class WorkspaceConfig(AiravataAppConfig):
    name = 'django_airavata.apps.workspace'
    label = 'django_airavata_workspace'
    verbose_name = 'Workspace'

    @property
    def app_order(self):
        return 0

    @property
    def url_home(self):
        return 'django_airavata_workspace:dashboard'

    @property
    def fa_icon_class(self):
        return 'fa-flask'

    @property
    def app_description(self):
        return """
        Launch applications and manage your experiments and projects.
    """

    nav = [
        {
            'label': 'Dashboard',
            'icon': 'fa fa-tachometer-alt',
            'url': 'django_airavata_workspace:dashboard',
            'active_prefixes': ['applications', 'dashboard']
        },
        {
            'label': 'Experiments',
            'icon': 'fa fa-flask',
            'url': 'django_airavata_workspace:experiments',
            'active_prefixes': ['experiments']
        },
        {
            'label': 'Projects',
            'icon': 'fa fa-box',
            'url': 'django_airavata_workspace:projects',
            'active_prefixes': ['projects']
        },
        {
            'label': 'Storage',
            'icon': 'fa fa-folder-open',
            'url': 'django_airavata_workspace:storage',
            'active_prefixes': ['storage']
        },
    ]
