document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox("inbox"));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Waits for the compost to be subbmited
  document.querySelector("#compose-form").onsubmit = () => {
    //Get data
    let sender = document.querySelector(".form-control").value;
    let recipients = document.querySelector("#compose-recipients").value;
    let subject = document.querySelector("#compose-subject").value;
    let body = document.querySelector("#compose-body").value;

    //Send data
    send(sender, recipients, subject, body);

    return false;
  }

  //Waits for the reply to be submmited
  document.querySelector("#reply-form").onsubmit = () => {
    let sender = document.querySelector("#from-reply").value;
    let recipients = document.querySelector("#reply-recipients").value;
    let subject = document.querySelector("#reply-subject").value;
    let body = document.querySelector("#reply-body").value;

    //Send data
    send(sender, recipients, subject, body);
    
    return false;
  }

  // By default, load the inbox
  load_mailbox("inbox");
});

function send(sender, recipients, subject, body) {
  fetch('/emails', {
    method: 'POST',
    
    body: JSON.stringify({
        sender: sender,
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      if (result.message === "Email sent successfully.")  {
        console.log(result);
        load_mailbox("sent", "success", result.message); 
      } else {
        console.log(result);
        load_mailbox("sent", "error", result.error); 
      }
        
      
  });
}

function show_alert(type, message) {
  const view = document.querySelector("#emails-view");
  const alert = document.createElement("div");

  if (type === "none") {

  } else if (type === "error") {
    alert.className = "alert alert-danger";
    alert.innerHTML = message;
    view.append(alert);

  } else if ( type === "success") {
    alert.className = "alert alert-success";
    alert.innerHTML = message;
    view.append(alert);
  }
}

function display_mail(email_id){
  // Show email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#reply-view").style.display = "none";
  document.querySelector('#email-display').style.display = 'block';
    

  //Clear the div 
  document.querySelector('#email-display').innerHTML = "";

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {

    //Get the data
    let sender = email.sender;
    let recipients = email.recipients;
    let subject = email.subject;
    let timestamp = email.timestamp;
    let body = email.body;

    //Create a div to add all the data
    let mail_box = document.createElement('div');

    //Archive and unarchive
    let archive = email.archived ? "Unarchive" : "Archive";

    //Add the data
    mail_box.innerHTML =`<h6><strong>From: </strong>${sender}</h6>
    <h6><strong>To: </strong>${recipients}</h6>
    <h6><strong>Subject: </strong>${subject}</h6>
    <h6><strong>Timestamp: </strong>${timestamp}</h6>
    <input id="archive" onclick="archiveUnArchive(${email_id})" type="button" class="btn btn-primary" value="${archive}">    
    <hr>
    </br>
    <p>${body}</p>
    <input id="reply" onclick="display_reply(${email_id})" type="button" class="btn btn-secondary" value="Reply">`; 

    //Display the page
    document.querySelector("#email-display").append(mail_box);
      
  });
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-display').style.display = 'none';
  document.querySelector("#reply-view").style.display = "none";  
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox, alert, alert_code) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-display').style.display = 'none';
  document.querySelector("#reply-view").style.display = "none";  

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Display alert if its needed
  show_alert(alert, alert_code);

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    //Iterate on each mail

    emails.forEach(email => {

      //Get data from each mail
      let sender = email.sender;
      let recipients = email.recipients;
      let subject = email.subject;
      let timestamp = email.timestamp;

      //Create a div to store all the data
      let card = document.createElement('div');
      card.className = "card";
      card.style.backgroundColor = email.read ? "gray": "white" ;
      card.style.padding ="10px 20px 10px 20px";
      card.style.margin = "0 0 15px";

      //Check if it is an sent mailbox
      if (mailbox === "sent"){

        //Add the data to the div
        card.innerHTML = `<h5><strong>Recipient: </strong>${recipients}</h6>
        <h5><strong>Subject: </strong>${subject}</h5>
        <h6>${timestamp}</h6>`;

      } else {

        //Add the data to the div
        card.innerHTML = `<h5><strong>Sender: </strong>${sender}</h6>
        <h5><strong>Subject: </strong>${subject}</h5>
        <h6>${timestamp}</h6>`;
      }

      //Add the event listener 
      card.addEventListener("click", () => {
        let email_id = email.id;
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
        
        display_mail(email_id);
      });

      //Display the div
      document.querySelector("#emails-view").append(card);
    });
  });
}

function archiveUnArchive(email_id){ 
  //Get the value from the input
  let b = document.querySelector("#archive").value;

  //Check if its already archived or not
  if (b === "Archive") {
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })    
  } else if (b === "Unarchive") {
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })    
  }

  //Load the inbox page
  load_mailbox("inbox");
  //Autoreload the page
  location.reload();
}

function display_reply(email_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-display').style.display = 'none';
  document.querySelector("#reply-view").style.display = "block";  

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    let button = document.querySelector("#reply");
    let recipients = email.sender;
    let subject = email.subject;
    let timestamp = email.timestamp;
    let body = email.body;

    document.querySelector("#reply-recipients").value = recipients;
    document.querySelector("#reply-subject").value = `Re: ${subject}`;
    document.querySelector("#reply-body").value = `On ${timestamp} ${recipients} wrote: "${body}" your reply: `;
  });
}