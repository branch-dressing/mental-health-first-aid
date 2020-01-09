## Models
### User
Desc: A user
Contents:
-username
-passwordHash
-friendCode

### liked things
Description: users and non users can write things they like about you to remind the user that they are liked and of their positive qualities.
Contents:
-a message
-a user the message corresponds to
-(optinal) who it is from
-tags

### photos
Desc: Photos to calm or make happy. Possibly puppies, people close to you something that makes you laugh.
Contents:
-Url to photo
-tags

### Contacts
Desc: people to contact in times hard times:
Contents:
-Name
-relationship
-phone number
-email

## OTHER IDEAS FOR LATER
-List of suggested activities
-list of food?

## Routes
### Auth
Create authentication routes
* `POST /auth/signup`
  * creates a new user
  * responds with the created user
* `POST /auth/signin`
  * responds with a user
* `GET /auth/verify`
  * uses the `ensureAuth` middleware
  * responds with a user

### liked things
* POST
  - doesnt need auth
  - does need a friend code 

* GET
  -get all
  -get one
  -get by tag

* PATCH
  -update tags
  -requires auth

* DELETE
  -Requires auth


  ### photos
Create RESTful post routes
* `POST /photos`
  * requires authentication
  * creates a new post
  * responds with the new post
  * HINT: get the user who created the post from `req.user`.
* `GET /photos`
  * responds with a list of photos
* `GET /photos/:id`
  * responds with a post by id
  * should include the populated user
  * should include all comments associated with the post (populated with commenter)
    * HINT: You'll need to make two separate queries and a `Promise.all`
* `PATCH /photos/:id`
  * requires authentication
  * only can update the post caption
  * respond with the updated post
  * NOTE: make sure the user attempting to update the post owns it
* `DELETE /photos/:id`
  * requires authentication
  * deletes a post
  * responds with the deleted post
  * NOTE: make sure the user attempting to delete the post owns it
* `GET /photos/?=tag`
  * respond with a list of the 10 photos with the most comments