const favoriteIcon = (data) => {
  $(`#${data._id}-fave`).click((e) => {
    $.ajax({
      method: "POST",
      url: "/api/articles/fave/" + data._id,
      data: {
        favorite: data.favorite,
        id: data._id
      },
      success: function (article) {
        console.log(article)
        window.location.reload();
    }
  });
  })
}

const saveNote = (data) => {
  // When you click the savenote button
  $("#savenote").click((e) => {
    // Save the id
    var thisId = data._id

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/api/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        window.location.reload();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  })
}

const noteFiller = (data) => {

  // Empty the notes from the note section
  $("#notes").empty();

  $("#notes").append("<h2>" + data.title + "</h2> <hr>");
  // If there's a note in the article
  if (data.note) {

    for (let index in data.note) {

      let dbNote = data.note[index];

      const newNote = $("<p>")
      const noteBody = $("<p>").text(dbNote.body);
      const noteHeader = $("<h4>").text(dbNote.title);
      $(newNote).append(noteHeader);
      $(newNote).append(noteBody);
      $("#notes").append(newNote);

    };


  };

  $("#notes").append("<input class='form-control' id='titleinput' name='title' >");
  $("#notes").append("<textarea class='form-control' id='bodyinput' name='body'></textarea>");
  $("#notes").append("<button class='form-control form-button' data-id='" + data._id + "' id='savenote'>Comment</button>");
  saveNote(data);
};

// Whenever someone clicks a p tag
$(".list-group-item").click(function (e) {
  // Save the id
  var thisId = $(this).data("id")

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/api/articles/" + thisId,
    success: function (data) {
      noteFiller(data);
    }
  });
});


$("#doTheScrape").click((e) => {
  e.preventDefault();
  $.ajax({
    type: "GET",
    url: "/api/scrape",
    success: function () {
      location.reload(true);
    }
  });
})

$(".list-group-item").each((index, element)=> {
  let data = {
    _id: $(element).data("id"),
    favorite: $(element).data("fave")
  }
  favoriteIcon(data);
})