document.addEventListener('DOMContentLoaded', function(){

  var panel_html = demo_panel_vars.demo_panel_theme_list;
  var display_panel = demo_panel_vars.show_panel;

  if (display_panel == 'yes'){
    setTimeout(function() {
      document.body.insertAdjacentHTML("beforeend", panel_html )

      document.querySelector('.view-themes').addEventListener('click', function(event) {
        event.preventDefault();
        const demosPanel = document.querySelector('.demos-panel');
        demosPanel.classList.toggle("open");

        if( !demosPanel.classList.contains("loaded") ){
          // set image src attribute from data-scr
          document.querySelectorAll('.demos-panel img').forEach(elementImg => {
            elementImg.setAttribute("src", elementImg.getAttribute("data-src"));
          });
        }
        demosPanel.classList.add("loaded");

      });

      document.querySelector('.demos-panel_overlay').addEventListener('click', function() {
        document.querySelector('.demos-panel').classList.remove("open");
      });

    }, 2500);
  }


});


/* window.addEventListener('scroll',(event) => {
  if(document.scrollingElement.scrollTop > 200){
    console.log('Scrolling...');
  }
}); */