# cargo-delay


![preview](\preview.gif)


## Setup

- [Install Gramex 1.x](https://learn.gramener.com/guide/install/)
- run `gramex Setup`
- Clone this repository
- Copy data from [repo](assets/data/)


## About

**[Cargo delay](https://uat.gramener.com/cargo-delay/)** is a simple app developed using [gramex](https://github.com/gramener/gramex/).

This app demonstrates the changes in the cargo transport time

One can notice the change in shipping time when changes in the cargo staff.

And also helps you to understand the shiping time on specific day in a week based on the number of staff.


## How to Run

- From the repo folder, run `gramex setup .`
- From the repo folder, run `gramex`
- Open `localhost:9988` in browser

## Working Version

- This app is hosted at [https://uat.gramener.com/cargo-delay/](https://uat.gramener.com/cargo-delay/)
- Default username & password could be ''`alpha`''

### Configuring GRAMEX.YAML

- Import UI Components from gramex

```
import:
  ui:
    path: $GRAMEXAPPS/ui/gramex.yaml
    YAMLURL: $YAMLURL/ui/

```

- Define each App-URL in the `url` section of `gramex.yaml`

- auth, template & cache control can be added to the url config.

- A sample block of url yaml config will look like this.

```
url:
    url-name:                           # A unique name for this handler
    pattern: /(.*)                      # All URLs beginning with /
    handler: FileHandler                # Handler used
    kwargs:                             # Options to the handler
        path: .                         #   path is current dir
        default_filename: index.html    #   / becomes /index.html
        index: true                     #   display file list if index.html missing
        template: '*.html'              # Transform all .html files
```
- A URL Pattern starts with the `/$YAMLURL/` which indicates end point of server.

- Following block is the url pattern used in this app.

```
url:
  cargo-delay-home:
    pattern: /$YAMLURL/
    handler: FileHandler
    kwargs:
      path: $YAMLPATH/index.html
```

- ### Handlers:
    In order to provide our dashboard with access to the data, files, auth & more gramex functionalities, Gramex uses components called Handlers. [(Explore Handlers in gramex)](https://learn.gramener.com/guide/).

    ### [FormHandler](https://learn.gramener.com/guide/formhandler/)

    FormHandler lets you access, read & write to the data from databases & files.


    This allow you to ..
     1) convert a data file into a REST API
     2) preview the data in an interactive table
     3) create a chart showing sales across multiple categories.

    Take a look at [Data end points](\gramex.yaml#L35-L45) created using from handlers in this application.

## Sanky Chart Generation

[Vega](https://vega.github.io/vega/) provides interactive d3-charts visualization through JSON format.

The creation of vega chart needs a JSON Specification of the charts, that should be passed to the vega renderer.

 - Click [here](\js\components/delay_chart_config.js) to see specification of the chart used in this app.

 - For more about vega go to [vega.github.io/vega/](https://vega.github.io/vega/)

 - The following function renders the vega chart

    ```

    function render_vega(spec, chart_id) {
      var view = new vega.View(vega.parse(spec))
        .renderer("svg")                    // set renderer (canvas or svg)
        .initialize(chart_id)               // initialize view within parent DOM container
        .width($(chart_id).width() - 100)   // sets chart width
        .height($(chart_id).height())       // sets chart height
        .hover()                            // enable hover encode set processing
        .run();

      return view
    }

    ```

- This function has been defined in the script file [delay.js](\js\delay.js#L14)

- The additional interactions for the chart are added on click event Listeners that we need to add after the chart rendered. [(delay.js)](delay.js#L51-L75)


