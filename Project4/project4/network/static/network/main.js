document.addEventListener("DOMContentLoaded", () => {
    //disabled new post input
    const textArea = document.querySelector("#new-post-content");
    const newPostBtn = document.querySelector("#new-post-btn");
    disabledBtn(textArea, newPostBtn);
})



//Function that disabled new-post button
function disabledBtn (input, btn) {

    btn.disabled = true;

    input.onkeyup = () => {
        if (input.value.length > 0){
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    }

}

//Function to create a cookie and verify csrf token
function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if(parts.length == 2) return parts.pop().split(';').shift();
}

//Function to edit a post that already exists
function edit_post(id) {

    const new_content = document.getElementById(`textarea_${id}`).value;

    const post_content_display = document.querySelector(".post-content");

    fetch(`/edit/${id}`, {
        method:"POST",
        headers: {"Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
        body: JSON.stringify({
            content:new_content
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        post_content_display.innerHTML = `<p class='post-content'>${new_content}</p>`;
    })
}

//Function to like a post
function like_unlike(post_id){

    const btn = document.getElementById(`${post_id}`);
    const post_likes = document.getElementById(`post_likes_${post_id}`);
    var like;


    if (btn.style.color =="red") {
        like = true;
    } else {
        like = false;
    }
    if (like) {
        fetch(`unlike/${post_id}`)
        .then(response => response.json())
        .then(result => {
            btn.style.color="black";
            post_likes.innerHTML --;
        })
    } else {
        fetch(`like/${post_id}`)
        .then(response => response.json())
        .then(result => {            
            btn.style.color="red";
            post_likes.innerHTML ++;
        })
    }

    like = !like

}
