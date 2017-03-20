---
layout: post
title:  "Magic Window Final Project: When Tilt Brush meet Tango"
date:   2017-03-10 14:58:25 +0000
categories: ITP MW
---





<iframe src="https://player.vimeo.com/video/209280491" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>


User demo:

<iframe src="https://player.vimeo.com/video/209280539" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

The problem we run into is that the Tilt Brush SDK library can not function properly in Unity. I successfully bring all the texture from Tilt Brush to the Unity 


![S17](/pics/S17-MW-t&t.png)


but we are not able to give event trigger on a Tilt Brush exported object or animated it. So that limited the movement of the ball, which is the key to the storytelling. Another limitation is that the steam VR can not run on Android mobile device. Therefore the teleport and custom trigger can not be used on the Tango device. 

The task we did on the normal Unity object, and they all work perfectly in both Unity and Tango mobile devices:

<iframe src="https://player.vimeo.com/video/209280562" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>



<iframe src="https://player.vimeo.com/video/209280549" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>


We decided to change this project to an experimental experience for the final project, but I will keep working on the Tilt Brush SDK library and develop a way for it to interact with Unity. 

