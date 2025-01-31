let loginPage = document.getElementById('loginPage');
let signupPage = document.getElementById('signupPage');
let logoutBtn = document.getElementById('logoutBtn')
if(loginPage){
    loginPage.addEventListener('click', () =>{
        event.preventDefault();
        window.location.href = './login.html'
    })
}
if(signupPage){
    signupPage.addEventListener('click', () =>{
        event.preventDefault();
        window.location.href = './index.html'
    })
}

async function checkSection(){
    try {
        const {data, error} = await supabase.auth.getSession();
        const authPage = ['/index.html', '/login.html', '/'];
        const currentPath = window.location.pathname;
        const isAuthPage = authPage.some((pages) => pages.includes(currentPath));
        console.log(data)
        if(data.session){
            if(isAuthPage){
                window.location.href = './dashboard.html';
                checkUser()
            }
        }
        else{
            if(!(isAuthPage)){
                window.location.href = './login.html'
            }
        }
        if(error) throw error
    } catch (error) {
        console.log(error)
    }
}


async function logout(){
    try {
        const { error } = await supabase.auth.signOut();
        if(error) throw error
        window.location.href = './login.html'
    } catch (error) {
        console.log(error)
    }
}

if(logoutBtn){
    logoutBtn.addEventListener('click', logout)
}
// async function checkUser(){
//     try {
//         const {data : {user}} = await supabase.auth.getUser();
//         if(user){
//             console.log('users')
//             console.log(user)
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
// logout()
window.load = checkSection();
