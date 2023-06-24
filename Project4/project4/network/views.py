from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator

import json
from django.http import JsonResponse

from .models import User, Post, Follow, Like


def index(request):
    allPosts = Post.objects.all().order_by('-id')

    paginator=Paginator(allPosts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    #All the likes made on the page
    allLikes = Like.objects.all()
    liked_post = []

    try:
        for like in allLikes:
            if like.user.id == request.user.id:
                liked_post.append(like.post.id)
    except:
        liked_post = []



    return render(request, "network/index.html", {
        "posts": page_obj,
        "likes": liked_post
    })

def new_post(request):
    if request.method == 'POST':
        user = User.objects.get(pk=request.user.id)
        content = request.POST['new-post-content']

        new_post = Post(
            owner=user,
            content=content            
        )
        new_post.save()
        return HttpResponseRedirect(reverse("index"))

def profile(request, username):
    profile = User.objects.get(username=username)
    user_posts = Post.objects.filter(owner=profile).order_by("-id")

    followed = Follow.objects.filter(user_follows=profile)
    follower = Follow.objects.filter(user_followed=profile)
    
    try:
        follow = Follow.objects.filter(user_follows=User.objects.get(pk=request.user.id), user_followed=profile)
        if len(follow) != 0:
            isFollowing = True
        else:
            isFollowing = False
    except:
        isFollowing = False

    paginator=Paginator(user_posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    #All the likes made on the page
    allLikes = Like.objects.all()
    liked_post = []

    try:
        for like in allLikes:
            if like.user.id == request.user.id:
                liked_post.append(like.post.id)
    except:
        liked_post = []

    return render(request, "network/profile.html", {
        "profile_user": profile,
        "posts": page_obj,

        "likes": liked_post,

        "follower": follower,
        "followed": followed,

        "isFollowing": isFollowing
    })

def follow(request):
    if request.method =="POST":
        user_followed = User.objects.get(username=request.POST['profile_user'])
        user_follower = User.objects.get(pk=request.user.id)

        new_follow = Follow(
            user_follows = user_follower,
            user_followed = user_followed
        )
        new_follow.save()

        return HttpResponseRedirect(reverse("profile", args=(user_followed.username, )))

def unfollow(request):
    if request.method =="POST":
        user_followed = User.objects.get(username=request.POST['profile_user'])
        user_follower = User.objects.get(pk=request.user.id)

        follow_object = Follow.objects.get(user_follows=user_follower, user_followed=user_followed)
        follow_object.delete()

        return HttpResponseRedirect(reverse("profile", args=(user_followed.username, )))

def following(request):
    
    all_posts = Post.objects.all().order_by("-id")
    request_user = User.objects.get(pk=request.user.pk)
    follows = Follow.objects.filter(user_follows=request_user)

    following_posts = []

    for post in all_posts:
        for follower in follows:
            if follower.user_followed == post.owner:
                following_posts.append(post)

    paginator=Paginator(following_posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    #All the likes made on the page
    allLikes = Like.objects.all()
    liked_post = []

    try:
        for like in allLikes:
            if like.user.id == request.user.id:
                liked_post.append(like.post.id)
    except:
        liked_post = []
    

    return render(request, "network/following.html", {
        "posts": page_obj,
        "likes": liked_post
    })

def edit(request, id):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    else:
        data = json.loads(request.body)
        request_post = Post.objects.get(pk=id)

        request_post.content = data['content']
        request_post.save()

        return JsonResponse({"message": "Post edited succesfully.", "data": data['content']}, status=201)

def like(request, post_id):
    post = Post.objects.get(pk=post_id)
    user = User.objects.get(pk=request.user.id)
    post.likes += 1
    post.save()

    create_like=Like(user=user, post=post)
    create_like.save()

    return JsonResponse({"message": "Post liked successfully."})

def unlike(request, post_id):
    post = Post.objects.get(pk=post_id)
    user = User.objects.get(pk=request.user.id)

    post.likes -= 1
    post.save()

    unlike_post = Like.objects.get(post=post, user=user)
    unlike_post.delete()

    return JsonResponse({"message": "Post unliked successfully."})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
