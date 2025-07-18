
import json

from django.core.management.base import BaseCommand
from wagtail.models import Revision as PageRevision


class Command(BaseCommand):
    help = "Fix the content_type id in the page revisions content_type which may be correct due to being imported from a different Django instance"

    def handle(self, **options):
        fixed_count = 0
        for pr in PageRevision.objects.all():
            if isinstance(pr.content, str):
                content_json = json.loads(pr.content)
            else:
                content_json = pr.content
            page = getattr(pr, 'content_object', None)
            if page and content_json['content_type'] != page.content_type.id:
                content_json['content_type'] = page.content_type.id
                pr.content = json.dumps(content_json)
                pr.save()
                fixed_count = fixed_count + 1
        if fixed_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f"Successfully fixed the content type of {fixed_count} page revisions")
            )
