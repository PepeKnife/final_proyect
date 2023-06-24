from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    owner = models.ForeignKey(User, related_name='owner', on_delete=models.CASCADE)
    content = models.TextField(blank=True, max_length=280)
    date = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return f"post id : {self.pk} -> '{self.content}'"

class Follow(models.Model):
    user_follows = models.ForeignKey(User, related_name="follower", on_delete=models.CASCADE)
    user_followed = models.ForeignKey(User, related_name="followed", on_delete=models.CASCADE)

class Like(models.Model):
    user = models.ForeignKey(User, related_name="user_liked", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="post_liked", on_delete=models.CASCADE)

    def __str__(self):
        return f"user: {self.user} liked {self.post}"