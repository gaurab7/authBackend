// authentication middleware not really necessary for backend with only public api requests like register and login
//this will only be needed when we need to alter user profile values for which we would need JWT key verification
//.i.e unless using protected requests ( get /user, post/user) not really needed