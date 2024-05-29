const baseUrl = "https://tarmeezacademy.com/api/v1"

//// ========= POST REQUESTS ============== /// 


function editPostBtnClicked(postObject)
  {
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    
    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value= post.id 
    document.getElementById("post-modal-title").innerHTML = "Edit post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {}) 
    postModal.toggle() 
  }

  function deletePostBtnClicked(postObject)
  {
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
     
    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {}) 
    postModal.toggle() 
  }

  function confirmDelete() {
      const token = localStorage.getItem("token")
      const postId = document.getElementById("delete-post-id-input").value
      const url = `${baseUrl}/posts/${postId}`
      const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
       }
      
      axios.delete(url, {
        headers:  headers
      })
        .then((response) => {
        const modal = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("The Post Has Been Deleted Successfully", "success")
        getPosts()    
            
  }).catch((error) =>{  0
    const message = error.response.data.message
    showAlert(message, "danger")
  })
}

function createNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "" 
  
  
  const title = document.getElementById("post-title-input").value
  const body = document.getElementById("post-body-input").value
  const image = document.getElementById("post-image-input").files[0]
  const token = localStorage.getItem("token")

  let formData = new FormData()
  formData.append("body" , body)
  formData.append("title" , title)
  formData.append("image" , image)

 let url = ``
 
  const headers = {
   "Content-Type": "multipart/form-data",
   "authorization": `Bearer ${token}`
  }

  if (isCreate == true ) 
   {
     url =  `${baseUrl}/posts`

     
   } else {
     formData.append("_method" , "put")
     url =  `${baseUrl}/posts/${postId}`


   }
   toggleLoader(true)
   axios.post(url, formData, 
     {
    headers:   {  
   "Content-Type": "multipart/form-data",
   "authorization": `Bearer ${token}`
               }
     }
  )
  .then((response) => {
   const modal = document.getElementById("create-post-modal")
   const modalInstance = bootstrap.Modal.getInstance(modal)
   modalInstance.hide()
   showAlert("New Post Has Been Created", "success")
   getPosts()
  })
  .catch((error) => {
   const message = error.response.data.message 
   showAlert(message,"danger")
  })
  .finally(() => {
    toggleLoader(false)
  })
 }

 function postClicked(postId) 
 {
   const user = getCurrentUser()  
  window.location = `postDetails.html?postId=${postId}`
 }

 function profileClicked() 
 {
  const user = getCurrentUser()
  const userId = user.id 
  window.location = `profile.html?userid=${userId}`
 }

function setupUi()
  {
    const token = localStorage.getItem("token")
    
    const loginDiv = document.getElementById("logged-in-div")
  
    const logoutDiv = document.getElementById("logout-div")
    
    // add btn 
    const addBtn = document.getElementById ("add-btn") 

    if(token == null) // user is guest  (not logged in)
     {
      
        if(addBtn != null)
      {
        addBtn.style.setProperty("display", "none" , "important")
      }
     
      loginDiv.style.setProperty("display" , "flex" , "important") 
      logoutDiv.style.setProperty("display" , "none" , "important") 
     } else  { // for logged in user
      
        if(addBtn != null){
        addBtn.style.setProperty("display" , "block" , "important")
      }
      
      loginDiv.style.setProperty("display" , "none" , "important") 
      logoutDiv.style.setProperty("display" , "flex" , "important") 
      const user = getCurrentUser()
      document.getElementById("nav-username").innerHTML = user.username
      document.getElementById("nav-user-image").src = user.profile_image
     }
  }


  // =========== AUTH FUNCTIONS ==================/
  function loginBtnClicked() 
  {

   const username = document.getElementById("username-input").value
   const password = document.getElementById("password-input").value
  
   const params = {
    "username": username , 
    "password": password 
   }

   const url = `${baseUrl}/login`
   toggleLoader(true)
   axios.post(url, params)
   .then((response) => {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))


     const modal = document.getElementById("login-modal")
     const modalInstance = bootstrap.Modal.getInstance(modal)

     modalInstance.hide()
     showAlert("logged in successfully", "success")
     setupUi()
   }).catch((error)=> {
    const message = error.response.data.message
    showAlert(message, "danger")
   }).finally(() => {
    toggleLoader(false)
   })
  }

  function toggleLoader(show = true) 
{
    if(show)
      {
        document.getElementById("loader").style.visibility = 'visible'
      } else {
        document.getElementById("loader").style.visibility = 'hidden'
      }
}

  function registerBtnClicked() 
  {
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]
  
    let formData = new FormData()
    formData.append("name" , name)
    formData.append("username" , username)
    formData.append("password" , password)
    formData.append("image" , image)

    const headers = {
    "Content-Type": "multipart/form-data",
    }
    const url = `${baseUrl}/register`

    toggleLoader(true)
    axios.post(url, formData, {
     headers:  headers
    })
    .then((response) => {
    console.log(response.data)
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))


     const modal = document.getElementById("register-modal")
     const modalInstance = bootstrap.Modal.getInstance(modal)
     modalInstance.hide()
     
     showAlert("New User Registered Successfully", "success")
     setupUi()
   }).catch((error) =>{
      const message = error.response.data.message
      showAlert(message, "danger")
   })
   .finally(() => {
    toggleLoader(false)
   })
  }

  function logout() 
  {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("logged out successfully", )
    setupUi()
  }

  function showAlert(customMessage, type="success") 
  {
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}


        appendAlert(customMessage, type)
     
        /// todo: Hide The Alert
        setTimeout (() => {
          // const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
            // const alert = document.getElementById("success-alert")
            // const modalAlert = bootstrap.Alert.getInstance(alert)
            // modalAlert.hide()
          // document.getElementById("success-alert").hide()
        },3000)
       
  }

  function getCurrentUser() 
  {
    let user = null 
    const storageUser = localStorage.getItem("user")

    if (storageUser != null) 
    {
      user = JSON.parse(storageUser)
    }

    return user 
  }

  function addBtnClicked()
{
  document.getElementById("post-modal-submit-btn").innerHTML = "Create"
  document.getElementById("post-id-input").value= "" 
  document.getElementById("post-modal-title").innerHTML = "Create A New Post"
  document.getElementById("post-title-input").value = ""
  document.getElementById("post-body-input").value = ""
  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {}) 
  postModal.toggle() 
}

/***********************profileScript **********************/

setupUi() 
getUser()
getPosts()

function getCurrentUserId() 
{
  const urlParams = new URLSearchParams(window.location.search)
  const id =  urlParams.get("userid")  
  return id 
}
function getUser()
{
    const id = getCurrentUserId() 
    axios.get(`${baseUrl}/users/${id}`)
 .then((response) => {
    const user = response.data.data 
    document.getElementById("main-info-email").innerHTML = user.email
    document.getElementById("main-info-name").innerHTML = user.name
    document.getElementById("main-info-username").innerHTML = user.username
    document.getElementById("main-info-image").src = user.profile_image
    document.getElementById("name-posts").innerHTML = `${user.username}'s`
    
    // POSTS COUNT & COMMENT COUNT
    document.getElementById("posts-count").innerHTML = user.posts_count
    document.getElementById("comments-count").innerHTML = user.comments_count
 
  }) 
}

  function getPosts() {
    
    const id = getCurrentUserId() 
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
    const posts = response.data.data
    document.getElementById("user-posts").innerHTML = ""
    
    for(post of posts) 
    {
     
      const author = post.author
      let postTitle = ""

      // show or hide (edit) button 
      let user = getCurrentUser() 
      let isMyPost =  user != null && post.author.id == user.id 
      let editBtnContent = ``

      if(isMyPost){ 
        editBtnContent = 
        `
        <button class= 'btn btn-danger' style=" margin-left:5px; float: right" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> delete </button>
        <button class= 'btn btn-secondary' style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> edit </button>
        `
      }
      else 
      if (post.title != null ) 
      {
        postTitle = post.title
      }
      let content = ` 
      <div class="card shado">
                <div class="card-header">
                  <img src="${author.profile_image}" alt="" class="rounded-circle border border-3" style="width: 40px;height: 40px;">
                  <span>${author.username}</span>

                  ${editBtnContent}
                 
                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                    <img class="w-100" src="${post.image}" alt="">
                   
                    <h6 style="color: rgb(146, 146, 146);" class="mt-1">
                        ${post.created_at}
                    </h6>

                    <h5>
                       ${postTitle}
                    </h5>

                    <p>
                     ${post.body}
                    </p>
                   
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                          </svg>
                        <span>
                            (${post.comments_count}) Comments
                              
                              <span id="post-tags-${post.id}">
                                
                              </span>
                            </span>

                    </div>
                </div>
              </div>
      `
      document.getElementById("user-posts").innerHTML += content

      
      const currentPostTagsId = `post-tags-${post.id}`
      document.getElementById(currentPostTagsId ).innerHTML = ""

      for (tag of post.tags)
      {
        let tagsContent = 
        `        
        <button class="btn btn-sm rounded-5" style="background-color:gray; color:white">
                                  Policy
                                </button>
        `
        document.getElementById(currentPostTagsId).innerHTML += tagsContent 
      }
    }
     
  })
  }

  /*********************************************************************** */
  let currentPage = 1 
  let lastPage = 1 
  //===== INFINITE SCROLL =====// 
  window.addEventListener("scroll", function() {
  
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    
    if(endOfPage && currentPage < lastPage) 
    {
      currentPage = currentPage + 1 
      getPosts(false, currentPage + 1)
    }
  });
  //=====// INFINITE SCROLL //=====// 

  setupUi()

  
  getPosts()
  function userClicked(userId) 
  {
    window.location = `profile.html?userid=${userId}`
  }
  function getPosts(reload = true , page = 1) {
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?=limit=6&page=${page}`)
    .then((response) => {
    toggleLoader(false)
    const posts = response.data.data
    lastPage = response.data.meta.last_page
    
    if(reload == true) 
    {
      document.getElementById("posts").innerHTML = ""
    }
    
    
    
    for(post of posts) 
    {
     

      const author = post.author
      let postTitle = ""

      // show or hide (edit) button 
      let user = getCurrentUser() 
      let isMyPost =  user != null && post.author.id == user.id 
      let editBtnContent = ``

      if(isMyPost){ 
        editBtnContent = 
        `
        <button class= 'btn btn-danger' style=" margin-left:5px; float: right" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> delete </button>
        <button class= 'btn btn-secondary' style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> edit </button>
        `
      }
      else 
      if (post.title != null ) 
      {
        postTitle = post.title
      }
      let content = ` 
      <div class="card shado">
                <div class="card-header" >
                 
                <span onclick="userClicked(${author.id})" style="cursor: pointer">
                  <img src="${author.profile_image}" alt="" class="rounded-circle border border-3" style="width: 40px;height: 40px;">
                  <span>${author.username}</span>
                </span>
                  
                  ${editBtnContent}
                 
                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                    <img class="w-100" src="${post.image}" alt="">
                   
                    <h6 style="color: rgb(146, 146, 146);" class="mt-1">
                        ${post.created_at}
                    </h6>

                    <h5>
                       ${postTitle}
                    </h5>

                    <p>
                     ${post.body}
                    </p>
                   
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                          </svg>
                        <span>
                            (${post.comments_count}) Comments
                              
                              <span id="post-tags-${post.id}">
                                
                              </span>
                            </span>

                    </div>
                </div>
              </div>
      `
      document.getElementById("posts").innerHTML += content

      
      const currentPostTagsId = `post-tags-${post.id}`
      document.getElementById(currentPostTagsId ).innerHTML = ""

      for (tag of post.tags)
      {
        let tagsContent = 
        `        
        <button class="btn btn-sm rounded-5" style="background-color:gray; color:white">
                                  Policy
                                </button>
        `
        document.getElementById(currentPostTagsId).innerHTML += tagsContent 
      }
    }
     
  })
  }
  

  function registerBtnClicked() 
  {
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]
  
    let formData = new FormData()
    formData.append("name" , name)
    formData.append("username" , username)
    formData.append("password" , password)
    formData.append("image" , image)

    const headers = {
    "Content-Type": "multipart/form-data",
    }
    const url = `${baseUrl}/register`
    toggleLoader(true)
    axios.post(url, formData, {
     headers:  headers
    })
    .then((response) => {
    toggleLoader(false)
    console.log(response.data)
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))


     const modal = document.getElementById("register-modal")
     const modalInstance = bootstrap.Modal.getInstance(modal)
     modalInstance.hide()
     
     showAlert("New User Registered Successfully", "success")
     setupUi()
   }).catch((error) =>{
      const message = error.response.data.message
      showAlert(message, "danger")
   })
   .finally(() => {
    toggleLoader(false)
   })
  }

  function logout() 
  {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("logged out successfully", )
    setupUi()
  }

  function postClicked(postId) 
  {
   window.location = `postDetails.html?postId=${postId}`
  }



  function showAlert(customMessage, type="success") 
  {
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}


        appendAlert(customMessage, type)
     
        /// todo: Hide The Alert
        setTimeout (() => {
          // const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
            // const alert = document.getElementById("success-alert")
            // const modalAlert = bootstrap.Alert.getInstance(alert)
            // modalAlert.hide()
          // document.getElementById("success-alert").hide()
        },3000)
       
  }

  

  function getCurrentUser() 
  {
    let user = null 
    const storageUser = localStorage.getItem("user")

    if (storageUser != null) 
    {
      user = JSON.parse(storageUser)
    }

    return user 
  }



function addBtnClicked()
{
  document.getElementById("post-modal-submit-btn").innerHTML = "Create"
  document.getElementById("post-id-input").value= "" 
  document.getElementById("post-modal-title").innerHTML = "Create A New Post"
  document.getElementById("post-title-input").value = ""
  document.getElementById("post-body-input").value = ""
  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {}) 
  postModal.toggle() 
}



