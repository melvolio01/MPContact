const submitBtn = document.getElementById('submit-button');
const postCode = document.getElementById('postcode');
const results = document.getElementById('results');
const message = document.getElementById('message');
let requestCode;
let postCodeUrl;
let constituency;
let member;
let eMail;
let memberUrl;
let emailUrl;

submitBtn.addEventListener('click', function(e){
    getPostcode();
    postcode.value = '';
    event.preventDefault();
})


function getPostcode(){
    if (postcode.value !== '') {
        requestCode = postcode.value;
        postCodeUrl = `https://api.postcodes.io/postcodes/${requestCode}`
        fetch(postCodeUrl)
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
            if(data.result.parliamentary_constituency){
        constituency = data.result.parliamentary_constituency;
        getMember(constituency);
        console.log(constituency);
        return constituency;
            }
        });
    } 
}

function getMember() {
    memberUrl = `http://data.parliament.uk/membersdataplatform/services/mnis/members/query/constituency=${constituency}/`;
    fetch(memberUrl)
    .then(function(response){
        return response.text();
    })
    .then(function(data){
        ;
        memString = data.split('>')[3];
        member = (memString.split('<')[0]);
        console.log(member);
        uriMember = encodeURIComponent(member.trim())
        getEmail(member);
    })
    
    
}

function getEmail(){
    emailUrl = `http://data.parliament.uk/membersdataplatform/services/mnis/members/query/name=${uriMember}/Addresses/`;
    fetch(emailUrl)
    .then(function(response){
        return response.text();
    })
    .then(function(data){
        let emailString = data.split('>');
        emailString.forEach(function(str){
            if(str.includes('@')){
                eMail = str.split('<')[0];
                console.log(typeof eMail);     
            }
        })
        appendResults();
    })
}

function appendResults(){
    results.innerHTML = `
                            <li>Your Parliamentary Constituency is: ${constituency}</li>
                            <li>Your Member of Parliament is: ${member}</li>
                            <li>${member}'s e-mail address is: <a href="mailto:${eMail}">${eMail}</a></li>
                        `
}


