---
title: "GIT: To force-push or not to force-push"
date: "9 Oct 2012"
tags: ruby
author: Jan Votava
layout: "../../layouts/BlogPost.astro"
---

Be aware that force-pushing is a highly dangerous and unclean solution when you're working in a shared repository. All commits in the shared repository should be considered __immutable__. To keep your repository consistent and keep your coworkers happy, you should use `git revert` instead.

For keeping things safe, checkout http://git-scm.com/book/en/Git-Basics-Undoing-Things

## Why force-push?

If you made some mistake and you haven’t pushed the changes to remote repository, you can use tools such as `git commit --amend`, `rebase`, `reset` and others.

But once you’ve pushed your changes, you cannot change your git history without force-pushing.

## Things go wrong...

Let's assume you know what you're doing and want to change the history of your git repository.

As an example, say you pushed some sensitive data that belong nowhere near your repository. How to remove it?

__BEWARE:__ All sensitive data that you have pushed to the remote repository should be considered compromised.

## Let’s get to it

Because we're rubyists, let's assume that the sensitive data are in config/database.yml.

filter out sensitive data from index

    git filter-branch --index-filter 'git rm --cached --ignore-unmatch config/database.yml' --prune-empty --tag-name-filter cat -- --all

    Rewrite 911477d03cdbe6ed5bbeeea99d413d2268308442 (2/2)rm 'config/database.yml'

    Ref 'refs/heads/master' was rewritten
    Ref 'refs/remotes/origin/master' was rewritten
    WARNING: Ref 'refs/remotes/origin/master' is unchanged


To prevent things from happening again, you should add the file to your repository’s .gitignore file.

Your history is now different than on the server, you cannot use normal push. We need to force-push.

    git push -f origin master

If your server has the config variable 'receive.denynonfastforwards' you'll get this error

    ! [remote rejected] master -&gt; master (non-fast forward)

to get around this error you can change the configuration variable on the server (if you have an access)

Another alternative is to use a rather dirty hack to delete the remote master branch and then recreate it from scratch:

    git push origin :master
    git push origin master

![force push](http://i.imgur.com/XFQLB.jpg)

## So now nobody can see the commit? Nope!

There’s another thing that you need to be aware of - Reflog. Every time you do a commit, push or any other data related operation, reflog knows about it and keeps track. Reflog’s man page tells us:

Reflog is a mechanism to record when the tip of branches are updated. This command is to manage the information recorded in it.

How to delete the reflog? Observe:

    $ rm -rf .git/refs/original/

    $ git reflog expire --expire=now --all

    $ git gc --prune=now
    Counting objects: 3, done.
    Writing objects: 100% (3/3), done.
    Total 3 (delta 0), reused 3 (delta 0)

    $ git gc --aggressive --prune=now
    Counting objects: 3, done.
    Writing objects: 100% (3/3), done.
    Total 3 (delta 0), reused 3 (delta 0)

Your colleagues will need to use rebase rather than merge otherwise they'll end up with tainted history.

## Final words

Use force push only as a last resort when everything else fails. Things might get ugly for you and for your repository.
