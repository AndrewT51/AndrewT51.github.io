$(document).ready(init);

function init(){
  $('.animated').on('mouseover', function(){
    $(this).addClass('pulse')
  })
  $('.animated').on('mouseleave', function(){
    $(this).removeClass('pulse')
  })
}