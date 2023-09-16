# HIT TIMES BACKEND

## Start project in localhost

1. git clone https://github.com/the-hit-times/The-HIT-Times-Admin-Portal.git
2. cd the-hit-times
3. create .env and paste credentials
4. npm install
5. to run in production mode run -> npm start
6. to run in development mode run -> npm run dev

# API Reference
For all the endpoints refers to For other endpoints, refer to  [API Documentation](/API_DOCs.yaml)

## 1. Login api

```http
   /login
```

## 2. Create post

```http
   /createpost
```

## 3. Get json data of posts

```http
   /api/posts

```

### To get limited post

```http
   /api/posts?limit={no. of post }&page={page no.}

```

## 4. Get all posts in display section

```http
   /display
```

## 5. Edit post

```http
   /post/edit/:id of post
```

## 6. Delete post

```http
   /post/del/:id of post
```

## 7. Send Notification 

```http 
    /api/sendnotification
```
