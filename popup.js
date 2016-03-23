(function() {

  loadCategoies();

  function loadCategoies() {
    chrome.runtime.sendMessage('loadCategoies', function(categories) {
      createCategories( JSON.parse(categories) );
    });
  }


  document.body.addEventListener( 'click', function( event ) {
    if( event.target.tagName === "BUTTON") {
      var button = event.target;
      var loading = document.getElementById('loading');
      loading.setAttribute('class', 'shown');

      var reqBody = {
        action : (button.getAttribute('class') === 'containFilm') ? 'deleteFilmFromCategory' : 'addFilmToCategory',
        category : button.innerHTML.toLowerCase()
      }

      chrome.runtime.sendMessage( reqBody, function (res) {
        (button.getAttribute('class') === 'containFilm') ? button.removeAttribute('class') : button.setAttribute('class', 'containFilm');
        loading.setAttribute('class', 'hidden');
      } );
    }
  }, false);


  function createCategories(categories) {
    var categoryList = document.getElementById('categoryList');
    categories.forEach(function (category) {
      createOneCategory(categoryList, category);
    })
  }


  function createOneCategory(categoryList, category) {
    var categoryButton = categoryList.appendChild(document.createElement("LI"))
                                     .appendChild(document.createElement("BUTTON"));
    categoryButton.textContent = category.name;
    if (category.isContainFilm) {
      categoryButton.setAttribute('class', 'containFilm');
    }
  }

}) ();
