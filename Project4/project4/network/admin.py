from django.contrib import admin
from .models import User, Post, Follow, Like

class UserView(admin.ModelAdmin):
    list_display = ("id", "username")

class PostView(admin.ModelAdmin):
    list_display = ("id", "owner", "date")

class FollowView(admin.ModelAdmin):
    list_display = ("id", "user_follows", "user_followed")

# Register your models here.
admin.site.register(User, UserView)
admin.site.register(Post, PostView)
admin.site.register(Follow, FollowView)
admin.site.register(Like)