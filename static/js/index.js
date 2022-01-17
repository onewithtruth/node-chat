let socket = io()
socket.on('connect', function() {
  let name = prompt('hello!', '')
  if (!name) {
    name = 'anonymous'
  }

  socket.emit('newUser', name)
})

socket.on('update', function(data) {
  console.log(`${data.name}: ${data.message}`)
})

//message sending function
function send() {
  let message = document.getElementById("test").value
  document.getElementById('test').value = ''
  socket.emit('message', {type: 'message', message: message})
}