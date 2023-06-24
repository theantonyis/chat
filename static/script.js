const socket = io({
  auth: {
    cookie: document.cookie
  }
});
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const logout = document.getElementById('logout');

$.ajax({
    url: 'https://api.weatherapi.com/v1/current.json?key=b3561c41d0154b909ff135649231806&q=Kivertsi&aqi=no',
    type: "GET", /* or type:"GET" or type:"PUT" */
    dataType: "json",
    data: {
    },
    success: function (result) {
        weather = result;
        console.log(weather);
        console.log(weather.current);
        $('#icon').attr("src", "https:" + weather.current.condition.icon);
        $('#city').html(weather.location.country + " , " + weather.location.name);
        $('#temp').html(weather.current.temp_c + "°C");
    },
    error: function () {
        alert("There is some error...");
    }
});


logout.addEventListener('click', (e) => {
  document.cookie = 'token=; Max-Age=0';
  location.assign('/login');
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('new_message', input.value);
    input.value = '';
  }
});

socket.on('message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('all_messages', function(msgArray) {
  msgArray.forEach(msg => {
    let item = document.createElement('li');
    item.textContent = msg.login + ': ' + msg.content;
    messages.appendChild(item);
  });
  window.scrollTo(0, document.body.scrollHeight);
});