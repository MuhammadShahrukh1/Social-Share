let signupEmail = document.getElementById('signupEmail');
let signupUsername = document.getElementById('signupUsername');
let signupPassword = document.getElementById('signupPassword');
let loginEmail = document.getElementById('loginEmail');
let loginPassword = document.getElementById('loginPassword');
let signupDetail = document.getElementById('signupDetail');
let loginDetail = document.getElementById('loginDetail');
let loginPage = document.getElementById('loginPage');
let signupPage = document.getElementById('signupPage');
let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let usernameFormat = /^[a-zA-Z0-9]/;
let passwordFromat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
let emailCheckFromDataBase;
let checkBox = document.getElementById('terms');
let signupdata;
let loginData;
let imageUploader = document.getElementById('imageUploader');

async function signup() {
    document.getElementById('signupDetail').classList.add('hidden');
    document.getElementById('loadingSignup').classList.remove('hidden')
    try {
        const { data, error } = await supabase.auth.signUp({
            email: (signupEmail.value).toLowerCase(),
            password: signupPassword.value,
            options: {
                data: {
                    first_name: (signupUsername.value).toLowerCase(),
                }
            }
        })
        if (data) {
            // console.log(data);
            signupdata = data
            // console.log(signupdata)
            uploadImage(data);
        }

        signupdata = data
        return data
    } catch (error) {
        console.log(error)
    }
    finally {
        if (signupdata) {
            swal.fire({
                title: `Account Created`,
                text: `Check Your Email For Confirmation`,
                icon: `success`
            }),
                document.getElementById('signupDetail').classList.remove('hidden');
            document.getElementById('loadingSignup').classList.add('hidden')
            signupEmail.value = '';
            signupPassword.value = '';
            signupUsername.value = '';
            checkBox.checked = false;
            imageUploader.value = ''
        }
    }

}
//this function check sign up email is already exist in our user table or not
async function emailCheck() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select()
        if (error) throw error
        if (data) {
            console.log(data)
            emailCheckFromDataBase = data;
        }

    } catch (error) {
        console.log(error)
    }
}

if (signupDetail) {
    signupDetail.addEventListener('click', () => {
        event.preventDefault();
        console.log(emailCheckFromDataBase)
        // console.log('start')
        for (var i = 0; i < emailCheckFromDataBase.length; i++) {
            console.log(emailCheckFromDataBase[i].email)
            if (emailCheckFromDataBase[i].email === signupEmail.value.toLowerCase()) {
                emailCheckFromDataBase = signupEmail.value;
                console.log(emailCheckFromDataBase);
                break
            }
        }
        // emailCheck()
        // console.log(emailCheckFromDataBase)
        if (signupEmail.value.trim() !== '') {
            // console.log('email Empty')
            if (signupEmail.value.match(mailFormat)) {
                // console.log('emial Regex')
                if (signupUsername.value.trim() !== '') {
                    // console.log('user name empty')
                    if (signupUsername.value.match(usernameFormat)) {
                        // console.log('uesrname regex')
                        if (signupPassword.value.trim() !== '') {
                            // console.log('password Empty')
                            if (signupPassword.value.match(passwordFromat)) {
                                if (checkBox.checked) {
                                    // console.log((Boolean(imageUploader.files > 0)))
                                    if (!(emailCheckFromDataBase === signupEmail.value)) {
                                        if (imageUploader.files.length > 0) {
                                            signup();
                                        }
                                        else {
                                            swal.fire({
                                                title: `Upload Picture`,
                                                text: `Insert Picture For Profile`,
                                                icon: `error`
                                            });
                                        }

                                        // console.log('finiesh')
                                    }
                                    else {
                                        swal.fire({
                                            title: `Exist`,
                                            text: `Email address Already Registered`,
                                            icon: `error`
                                        }),
                                            signupEmail.value = ''
                                        signupPassword.value = ''
                                        signupUsername.value = ''
                                        checkBox.checked = false;

                                    }
                                    // console.log('Passwword Regex')

                                }
                                else {
                                    checkBox.focus();
                                }

                            }
                            else {
                                swal.fire({
                                    title: `Invalid password`,
                                    text: `Enter Valid Password`,
                                    icon: `error`
                                }),
                                    signupPassword.value = '';
                                signupPassword.focus();
                            }
                        }
                        else {
                            swal.fire({
                                title: `Password?`,
                                text: `Enter Your Password`,
                                icon: `question`
                            }),
                                // signupPassword.value = '';
                                signupPassword.focus();
                        }
                    }
                    else {
                        swal.fire({
                            title: `Invalid Username`,
                            text: `Enter A Valid Username`,
                            icon: `error`
                        }),
                            signupUsername.value = '';
                        signupPassword.value = '';
                        signupUsername.focus();
                    }
                }
                else {
                    swal.fire({
                        title: `userName`,
                        text: `Enter a username`,
                        icon: `question`
                    }),
                        // signupPassword.value = '';
                        signupUsername.focus();
                }
            }
            else {
                swal.fire({
                    title: `Invalid Email`,
                    text: `Enter A Valid Mail`,
                    icon: `error`
                }),
                    signupEmail.value = '';
                signupPassword.value = '';
                signupUsername.value = '';
                signupEmail.focus();
            }

        }
        else {
            swal.fire({
                title: `Email?`,
                text: `Please Enter Email`,
                icon: `question`
            }),
                signupUsername.value = '';
            signupPassword.value = '';
            signupEmail.focus();
        }
    })
}
let currentUserId;
async function login() {
    document.getElementById('loginDetail').classList.add('hidden');
    document.getElementById('loadingLogin').classList.remove('hidden')
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail.value,
            password: loginPassword.value,
        });
        if (data) {
            console.log(data)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                console.log(user)
                currentUserId = user.id;
                localStorage.setItem('currentUserId', JSON.stringify(currentUserId));
                const { data : fetchUserdata, error : fetchUserError } = await supabase
                    .from('users')
                    .select()
                    .eq('userID', user.id)
                if(fetchUserdata){
                    // console.log(fetchUserdata)
                    let currentUser = {
                        email : fetchUserdata[0].email,
                        name : fetchUserdata[0].name,
                        imageUrl : fetchUserdata[0].profileImageUrl
                    };
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    console.log(currentUser)
                }
                else{
                    console.log(fetchUserError)
                }
            }
        }
        if (error) throw error
        loginData = data;
        return data
    } catch (error) {
        console.log(error.message)
        document.getElementById('loginDetail').classList.remove('hidden');
        document.getElementById('loadingLogin').classList.add('hidden')
    }

    finally {
        if (loginData) {
            window.location.href = './dashboard.html';
            loginEmail.value = '';
            loginPassword.value = '';
            document.getElementById('loginDetail').classList.remove('hidden');
            document.getElementById('loadingLogin').classList.add('hidden')
        }
    }
}

if (loginDetail) {
    loginDetail.addEventListener('click', () => {
        event.preventDefault()
        if (loginEmail.value.trim() !== '') {
            if (loginEmail.value.match(mailFormat)) {
                if (loginPassword.value.trim() !== '') {
                    login();
                }
                else {
                    swal.fire({
                        title: `Password?`,
                        text: `Enter Your Password`,
                        icon: `question`
                    })
                    loginPassword.focus();
                }
            }
            else {
                swal.fire({
                    title: `Invalid Email`,
                    text: `Enter valid format of email`,
                    icon: `error`
                })
                loginEmail.focus();
                loginEmail.value = '';
            }
        }
        else {
            swal.fire({
                title: `Email?`,
                text: `Enter Your Email`,
                icon: `question`
            })
            loginEmail.focus();
        }
    })
}


//this function upload image in profile bucket 
async function uploadImage(data) {
    console.log(data)
    let uploadedImage = imageUploader.files[0];
    try {
        const { data: profileImageData, error: profileImageError } = await supabase
            .storage
            .from('profileImages')
            .upload(`public/${data.user.id}`, uploadedImage, {
                cacheControl: '3600',
                upsert: false
            })
        if (profileImageData) {
            // let profileImageDatainFunction = profileImageData;
            publicUrlOfImage(profileImageData);
        }
        if (profileImageError) throw profileImageError
    } catch (error) {
        console.log(error)
    }
}
//this function get public url of profile image
async function publicUrlOfImage(profileImageData) {
    try {
        const { data: imagePublicUrl } = supabase
            .storage
            .from('profileImages')
            .getPublicUrl(profileImageData.path)
        if (imagePublicUrl) {
            // let imagePublicUrlinFunction = imagePublicUrl;
            insertDataInUserTable(imagePublicUrl);
        }

    } catch (error) {
        console.log(error)
    }
}
//this function insert user data in user table
async function insertDataInUserTable(imagePublicUrl) {
    try {
        const { data: signupUserDetailSaveInUserTable, error: signupUserDetailErrorInSave } = await supabase
            .from('users')
            .insert({
                name: signupdata.user.user_metadata.first_name,
                email: signupdata.user.email,
                userID: signupdata.user.id,
                profileImageUrl: imagePublicUrl.publicUrl
            });
        if (signupUserDetailSaveInUserTable) {
            console.log(signupUserDetailSaveInUserTable)
        }
        if (signupUserDetailErrorInSave) throw signupUserDetailErrorInSave;
    } catch (error) {
        console.log(error)
    }
}
window.load = emailCheck();