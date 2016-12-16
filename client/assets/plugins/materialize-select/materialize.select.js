// jshint ignore: start
var unique_id;

function materialize_select() {

    $("select").material_select();

    $(".select-dropdown").on("close", function() {
        $(".select-dropdown.dropdown-content").fadeOut();
    });

    $(".select-dropdown[data-activates]").click(function() {
        unique_id = $(this).attr("data-activates");
        var list = $("#" + unique_id);

        var parent = $(".select-dropdown[data-activates='" + unique_id + "']");
        list.css("width", parent.width() + "px");
        list.css("position", "absolute");
        list.css("top", "0px");
        list.css("left", "0px");
        list.fadeIn();
    });

}
