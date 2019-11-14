/* globals vega, get_vega_config, */

var $svg_rects, $svg_paths


$(function() {
  $.getJSON("delay_data", function (result) {
    var data = result;
    var config = get_vega_config({ data: data })
    render_delay_chart(config)
  });
})

function render_vega(spec, chart_id) {
  /* render_vega() takes parameters
        -> spec - A vega chart spec
                - Must be a JSON config
        -> chart_id - An id/class_name to the chart container
                    - Must be a String
    and returns vega view.
  */
  var view = new vega.View(vega.parse(spec))
    .renderer("svg")                    // set renderer (canvas or svg)
    .initialize(chart_id)               // initialize view within parent DOM container
    .width($(chart_id).width() - 100)   // sets chart width
    .height($(chart_id).height())       // sets chart height
    .hover()                            // enable hover encode set processing
    .run();

  return view
}

// render chart fn
function render_delay_chart(chart_spec) {

  /*
      This function accepts parameter
        -> spec - JSON vega specification chartcreates
      creates the chart using render_vega()
      and adds click, hover & filter actions to the view.

  */
  var chart_container = "#chart"
  $(chart_container).empty();
  var view = render_vega(chart_spec, chart_container)

  var mergedPathsArray = view
    .data("pathSet1")
    .concat(view.data("pathSet2"))
    .concat(view.data("pathSet3"));
  view.addEventListener("click", function (event, item) {
    var selectedPaths = mergedPathsArray.filter(elem => {
      if (elem.datum != undefined)
        return (
          elem.datum.sourceId == item.datum.id ||
          elem.datum.targetId == item.datum.id
        );
    });
    var visibility = _.uniq(
      _.map(selectedPaths, _.property("_svg.style.strokeOpacity"))
    );
    selectedPaths.forEach(element => {
      if (visibility.length == 2) {
        element._svg.style.strokeOpacity = 1;
        element._svg.style.visibility = "visible"
      } else if (_.values(visibility) == 0) {
        element._svg.style.strokeOpacity = 1;
        element._svg.style.visibility = "visible";
      } else if (_.values(visibility) == 1) {
        element._svg.style.strokeOpacity = 0;
        element._svg.style.visibility = "hidden";
      }
    });
  });

  $svg_rects = view.data("rectData")
  $svg_rects.push(...view.data("rectData2"));

  $svg_paths = view.data("pathSet3");
  $svg_paths.push(...view.data("pathSet2"))
  $svg_paths.push(...view.data("pathSet1"))

  $(".bt_slider").slider();
}

var color_scale;

setTimeout(function () {
  color_scale = d3.scaleLinear()
    .domain([1.5, 1.75, 2.0])
    .range(["green", "yellow", "red"]);

}, 1000)

// Initial value of trained_staff slider..
// var initial_trained = parseInt($("#staff_slider").val())
var initial_trained = 5

$("body")
  .on("change", "#staff_slider", function () {
    var trained = +$(this).val();
    $("#staff_slider_val").html(trained)
    let svg_all_nodes = $svg_paths;
    svg_all_nodes.push(...$svg_rects);
    var scale = Math.pow(1.03, trained - initial_trained);
    _.each(svg_all_nodes, function (item) {
      let item_data_val = item.datum.avg_time || item.datum.node_avg_time;
      item._svg.style.fill = color_scale(item_data_val / scale)
      item._svg.style.stroke = color_scale(item_data_val / scale);
    })
  })

  .on("change", "#delay_slider", function () {
    let delay_val = $(this).val();
    $("#delay_slider_val").html(delay_val)
    let svg_all_nodes = $svg_paths;
    svg_all_nodes.push(...$svg_rects);
    _.each(svg_all_nodes, function (item) {
      let item_data_val = item.datum.avg_time || item.datum.node_avg_time;
      if (item_data_val < delay_val) {
        item._svg.setAttribute("class", "custom_fade");
      } else {
        item._svg.classList.remove("custom_fade");
      }
    });
  });
