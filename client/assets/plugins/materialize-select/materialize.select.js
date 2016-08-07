// jshint ignore: start
var unique_id;

function materialize_select() {

    $("select").material_select();

    $(".select-dropdown").on("open", function(event) {
        if (!unique_id) return;

        var list = $("#" + unique_id);
        var parent = $(".select-dropdown[data-activates='" + unique_id + "']");
        list.css("width", parent.width() + "px");
        list.css("position", "absolute");
        list.css("top", "0px");
        list.css("left", "0px");
        list.fadeIn();
    });

    $(".select-dropdown").on("close", function(event) {
        $(".select-dropdown.dropdown-content").fadeOut();
    });

    $(".select-dropdown[data-activates]").click(function() {
        if ($(".select-dropdown.dropdown-content").is(":visible")) {
            $(".select-dropdown").trigger("close");
        } else {
            unique_id = $(this).attr("data-activates");
            $(".select-dropdown").trigger("open");
        }
    });

}
