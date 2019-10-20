/* globals vega, get_delay_chart_config */

var chartData, view, $svg_rects, $svg_paths
$.getJSON("delay_data", function (result) {
  chartData = result;
  draw_chart()
});

function draw_chart() {

  let _data = chartData
  $("#chart").empty()
  var config = get_delay_chart_config({ data: _data })
  render_delay_chart(config);
}
// common render fn
function render_delay_chart(spec) {
  view = new vega.View(vega.parse(spec))
    .renderer("svg") // set renderer (canvas or svg)
    .initialize("#chart") // initialize view within parent DOM container
    .width($("#chart").width() - 100)
    .height($("#chart").height())
    .hover() // enable hover encode set processing
    .run();

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

  var recovery_min = parseInt($("#delay_slider").attr("min"))
  var recovery_max = parseInt($("#delay_slider").attr("max"))
  color_scale = d3.scaleLinear()
    .domain([1.5, 1.75, 2.0])
    .range(["green", "yellow", "red"]);

}, 1000)

var initial_trained = 5 //parseInt($("#staff_slider").val()) || 5
$("body")
  .on("change", "#staff_slider", function () {
    var trained = +$(this).val();
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
    let svg_all_nodes = $svg_paths;
    svg_all_nodes.push(...$svg_rects);
    _.each(svg_all_nodes, function (item) {
      let item_data_val = item.datum.avg_time || item.datum.node_avg_time;
      if (item_data_val >= delay_val) {
        item._svg.setAttribute("class", "custom_fade");
      } else {
        item._svg.classList.remove("custom_fade");
      }
    });
  });
