# Generated by Django 5.0.2 on 2025-07-05 08:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_store_owner'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShippingAgent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('area', models.CharField(max_length=200)),
                ('status', models.CharField(default='متاح', max_length=50)),
                ('active_orders', models.IntegerField(default=0)),
                ('completed_orders', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('store', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shipping_agents', to='api.store')),
            ],
            options={
                'verbose_name': 'مندوب شحن',
                'verbose_name_plural': 'مناديب الشحن',
            },
        ),
    ]
