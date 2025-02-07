// let profileImage = document.getElementById('profileImageUrl');
let textContent = document.getElementById('textContent');
let fileInput = document.getElementById('fileInput');
let postBtn = document.getElementById('postBtn');
let disableBtn = document.getElementById('disableBtn');
let profileUsername = document.getElementById('profileUsername');
let profileImageDashboard = document.getElementById('profileImageDashboard');
let currentUser = JSON.parse(localStorage.getItem('currentUser'))
let currentuserId = JSON.parse(localStorage.getItem('currentUserId'));
// console.log(currentUser)
profileImageDashboard.src = currentUser.imageUrl;
profileUsername.innerHTML = currentUser.name
async function post() {
    // console.log(currentuserId)
    disableBtn.classList.remove('d-none');
    postBtn.classList.add('d-none');
    try {
        const { data, error } = await supabase
            .from('posts')
            .insert({ content: textContent.value, userID: currentuserId })
            .select()
        if (data) {
            console.log(data)
            if (fileInput.files.length > 0) {
                const uploadFile = fileInput.files[0];
                console.log(uploadFile)
                try {
                    console.log('try Block')
                    const { data: postImage, error: postError } = await supabase
                        .storage
                        .from('postImages')
                        .upload(`public/${data[0].id}`, uploadFile, {
                            cacheControl: 3600,
                            upsert: false
                        })
                    if (postImage) {
                        const { data: CreatPublicUrl } = supabase
                            .storage
                            .from('postImages')
                            .getPublicUrl(`${postImage.path}`)

                        if (CreatPublicUrl) {
                            console.log(CreatPublicUrl)
                            try {
                                const { data: updatePostUrlInPostDatabase, error: errorOccurInpostingImageUrl } = await supabase
                                    .from('posts').
                                    update({ 'postImageUrl': CreatPublicUrl.publicUrl })
                                    .eq('userID', currentuserId)
                                if (errorOccurInpostingImageUrl) throw errorOccurInpostingImageUrl
                            } catch (error) {
                                console.log(error)
                            }
                            finally {
                                document.getElementById('postContainer').innerHTML = '';
                                loadAllPost();
                            }
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }

    } catch (error) {
        console.log(error)
    }
    finally {
        disableBtn.classList.add('d-none');
        postBtn.classList.remove('d-none');
        textContent.value = '';
        fileInput.value = '';
    }
}


async function loadAllPost() {
    try {
        const { data: postData, error: postError } = await supabase
            .from('posts')
            .select()
        if (postError) throw postError
        if (postData) {
            try {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select()
                if (userError) throw userError
                if (userData) {
                    let userMap = {}
                    userData.forEach((user) => {
                        userMap[user.userID] = user
                    })
                    let myPost = false; postData.forEach((post) => {
                        let postList = userMap[post.userID]
                        console.log(post)
                        if (currentuserId === post.userID) {
                            myPost = true;
                        }
                        document.getElementById('postContainer').innerHTML += `
                            <div class="post">
            <div class="card mb-3">
              <div class="card-body">
                <div class="d-flex align-items-center position-relative">
                <div style="width:80px;height:80px;" class="me-3">
                  <img src="${postList.profileImageUrl}" class="rounded-circle me-2" width="100%" height="100&" alt="User" />
                </div>
                  <div class="">
                    <h6 class="mb-1">${postList.name}</h6>
                    <small class="text-muted">${new Date(post.created_at
                        ).toLocaleString()}</small>
                    ${myPost ? ` <div class="dropdown position-absolute top-0 end-0 bg-transparent">
            <button class="bg-transparent border-0" id="navbardDropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <button class="dropdown-item" type="button" onclick="deletePost(${post.id})">Delete</button>
            </div>
          </div>` : ''}

                  </div>
                </div>
                <p class="mt-5">${post.content}</p>
                ${post.postImageUrl ? `<div class="mt-3">
                  <img src="${post.postImageUrl}" class="img-fluid rounded w-100" alt="Post Image">
                </div>` : ''}
  
                <div class="mt-3 d-flex">
                <button style="width:calc(100% / 3);" class="btn btn-interact "><i class="fa-solid fa-thumbs-up"></i> Like</button>
                <button style="width:calc(100% / 3);" class="btn btn-interact"><i class="fa-solid fa-comment"></i> Comment</button>
                <button style="width:calc(100% / 3);" class="btn btn-interact"><i class="fa-solid fa-share"></i> Share</button>
                </div>
              </div>
            </div>
          </div>
                            `
                    })

                }
            } catch (error) {
                console.log(error);
                console.log('user fetch Error')
            }
        }
    } catch (error) {
        console.log(error);
        console.log('post fetch Error')
    }
}
if (postBtn) {
    postBtn.addEventListener('click', post)
}

async function deletePost(postId) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .select()
        if (data) {
            const { data: deleteImage, error: errorDuringDeleteImage } = await supabase
                .storage
                .from('postImages')
                .remove([`public/${postId}`])
            if (deleteImage) {
                document.getElementById('postContainer').innerHTML = '';
                loadAllPost();
            }
            if (errorDuringDeleteImage) throw errorDuringDeleteImage
        }
        if (error) throw error
    } catch (error) {
        console.log(error)
    }
}
window.deletePost = deletePost;
window.load = loadAllPost();