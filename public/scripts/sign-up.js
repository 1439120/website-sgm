// // // Example starter JavaScript for disabling form submissions if there are invalid fields
// (function () {
//     'use strict'

//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.querySelectorAll('.needs-validation')

//     // Loop over them and prevent submission
//     Array.prototype.slice.call(forms)
//       .forEach(function (form) {
//         form.addEventListener('submit', function (event) {
//           if (!form.checkValidity()) {
//             event.preventDefault()
//             event.stopPropagation()
//           }

//           form.classList.add('was-validated')
//         }, false)
//       })
//   })()

// let form = document.getElementById('form');
// let sfname = document.getElementById('sfname');
// let suname = document.getElementById('suname');
// let semail = document.getElementById('semail');
// let snum = document.getElementById('snum');
// let spass = document.getElementById('spass');
// let scpass = document.getElementById('scpass');
// let gender = document.getElementsByName('gender')

// form.addEventListener('submit', (e) => {
//     e.preventDefault()  // wont submit the form
//     checkInput()
// })

// function checkInput(){
//     let emailVal = semail.value.trim()
//     let unameVal = suname.value

//     if(uname = ''){
//         setErrorFor(suname, 'Username cannot be empty')
//     }else{
//         //setSuccessFor(suname)
//     }
// }

// function setErrorFor(input, mssg){
//     let formControl = input.parentElement;
//     let small = form.querySelector('small')
//     small.innerHTML = mssg
//     formControl.className = "form-control error"
// }
