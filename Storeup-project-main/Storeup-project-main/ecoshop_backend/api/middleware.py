import os
from django.conf import settings

class SubdomainMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(':')[0]  # Remove port if present
        
        # Get domain from settings (from environment variable)
        domain = getattr(settings, 'DOMAIN', 'mydomain.com')
        
        # Check if this is a subdomain of our domain
        if host.endswith(domain):
            subdomain = host.replace('.' + domain, '')
            if subdomain and subdomain != 'www':
                request.subdomain = subdomain
            else:
                request.subdomain = None
        # Check for Render domains
        elif host.endswith('.onrender.com'):
            # Extract subdomain from Render URL (e.g., store1-app.onrender.com -> store1)
            parts = host.split('.')
            if len(parts) >= 3:
                subdomain = parts[0]
                request.subdomain = subdomain
            else:
                request.subdomain = None
        else:
            request.subdomain = None
            
        return self.get_response(request) 