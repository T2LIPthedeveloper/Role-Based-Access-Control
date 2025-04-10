from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rbac_app.models import User as RbacUser, File

class Command(BaseCommand):
    help = 'Load dummy data for RBAC demonstration'

    def handle(self, *args, **kwargs):
        # Create admin user
        admin_user, created = RbacUser.objects.get_or_create(
            username='admin',
            defaults={'password': 'adminpassword', 'role': 'admin'}
        )
        if created:
            admin_user.set_password('adminpassword')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created admin user'))

        # Create editor user
        editor_user, created = RbacUser.objects.get_or_create(
            username='editor',
            defaults={'password': 'editorpassword', 'role': 'editor'}
        )
        if created:
            editor_user.set_password('editorpassword')
            editor_user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created editor user'))

        # Create viewer user
        viewer_user, created = RbacUser.objects.get_or_create(
            username='viewer',
            defaults={'password': 'viewerpassword', 'role': 'viewer'}
        )
        if created:
            viewer_user.set_password('viewerpassword')
            viewer_user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created viewer user'))

        # Create files
        admin_only_file, created = File.objects.get_or_create(
            name='Admin Only File',
            defaults={'uploaded_by': admin_user, 'allowed_roles': ['admin']}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created Admin Only File'))

        admin_editor_file, created = File.objects.get_or_create(
            name='Admin and Editor File',
            defaults={'uploaded_by': admin_user, 'allowed_roles': ['admin', 'editor']}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created Admin and Editor File'))

        public_file, created = File.objects.get_or_create(
            name='Public File',
            defaults={'uploaded_by': admin_user, 'allowed_roles': ['admin', 'editor', 'viewer']}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created Public File'))

        self.stdout.write(self.style.SUCCESS('Successfully loaded dummy data'))