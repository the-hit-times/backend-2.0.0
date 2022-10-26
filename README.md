# HIT TIMES BACKEND

## Start project in localhost

1. git clone https://github.com/the-hit-times/The-HIT-Times-Admin-Portal.git
2. cd the-hit-times
3. create .env and paste credentials 
4. npm install
5. npm start



# API Reference

## 1. Login api
```http
   /login
```
## 2.create post 
```http
   /createpost
```
## 3.Get json data of posts

```http
   /api/posts

```  
### To get limited post 
```http
   /api/posts?limit={no. of post }&page={page no.}

```
## 4.get all posts in display section
```http
   /display
```
## 5.edit post
```http
   /post/edit/:id of post
```
## 6.delete post  
```http
   /post/del/:id of post
```
