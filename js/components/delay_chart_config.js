
function get_delay_chart_config(cnf) {
  var config =
  {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "width": 500,
    "height": 500,
    "data": [
      {
        "name": "rawData",
        "values": cnf.data,
        "transform": [
          {
            "type": "collect",
            "sort": {
              "field": [
                "Shift",
                "Weekday",
                "Product_category",
                "Part_shipment"
              ],
              "order": [
                "ascending",
                "ascending",
                "ascending",
                "ascending"
              ]
            }
          }
        ]
      },
      {
        "name": "fields",
        "values": [
          "Shift",
          "Weekday",
          "Product_category",
          "Part_shipment"
        ]
      },
      {
        "name": "connectionNodes",
        "source": "fields",
        "transform": [
          {
            "type": "window",
            "ops": [
              "rank"
            ],
            "as": [
              "id"
            ]
          },
          {
            "type": "cross",
            "as": [
              "sourceScale",
              "targetScale"
            ],
            "filter": "(datum.sourceScale.data != datum.targetScale.data) && ((datum.sourceScale.id - datum.targetScale.id) == -1)"
          },
          {
            "type": "formula",
            "expr": "datum.sourceScale.id",
            "as": "sourceScaleId"
          },
          {
            "type": "formula",
            "expr": "datum.targetScale.id",
            "as": "targetScaleId"
          },
          {
            "type": "formula",
            "expr": "datum.sourceScale.data",
            "as": "sourceScale"
          },
          {
            "type": "formula",
            "expr": "datum.targetScale.data",
            "as": "targetScale"
          }
        ]
      },
      {
        "name": "data",
        "source": "rawData",
        "transform": [
          {
            "type": "aggregate",
            "groupby": [
              "Shift",
              "Weekday",
              "Product_category",
              "Part_shipment"
            ],
            "ops": [
              "average"
            ],
            "fields": [
              "Recovery_time"
            ],
            "as": [
              "avg_time"
            ]
          }
        ]
      },
      {
        "name": "block_data",
        "source": "data",
        "transform": [
          {
            "type": "fold",
            "fields": [
              "Shift",
              "Weekday",
              "Product_category",
              "Part_shipment"
            ]
          },
          {
            "type": "aggregate",
            "groupby": [
              "value",
              "key"
            ],
            "fields": [
              "avg_time"
            ],
            "ops": [
              "average"
            ],
            "as": [
              "node_avg_time"
            ]
          },
          {
            "type": "formula",
            "expr": "datum.key + datum.value",
            "as": "id"
          },
          {
            "type": "collect",
            "sort": {
              "field": [
                "id"
              ],
              "order": [
                "descending"
              ]
            }
          }
        ]
      },
      {
        "name": "shiftWeekPath",
        "source": "data",
        "transform": [
          {
            "type": "aggregate",
            "groupby": [
              "Shift",
              "Weekday"
            ],
            "fields": [
              "avg_time"
            ],
            "ops": [
              "average"
            ],
            "as": [
              "avg_time"
            ]
          },
          {
            "type": "lookup",
            "from": "block_data",
            "key": "value",
            "fields": [
              "Shift"
            ],
            "values": [
              "id"
            ],
            "as": [
              "sourceId"
            ],
            "default": "some label"
          },
          {
            "type": "lookup",
            "from": "block_data",
            "key": "value",
            "fields": [
              "Weekday"
            ],
            "values": [
              "id"
            ],
            "as": [
              "targetId"
            ],
            "default": "some label"
          }
        ]
      },
      {
        "name": "weekProductPath",
        "source": "data",
        "transform": [
          {
            "type": "aggregate",
            "groupby": [
              "Weekday",
              "Product_category"
            ],
            "fields": [
              "avg_time"
            ],
            "ops": [
              "average"
            ],
            "as": [
              "avg_time"
            ]
          },
          {
            "type": "lookup",
            "from": "block_data",
            "key": "value",
            "fields": [
              "Weekday"
            ],
            "values": [
              "id"
            ],
            "as": [
              "sourceId"
            ],
            "default": "some label"
          },
          {
            "type": "lookup",
            "from": "block_data",
            "key": "value",
            "fields": [
              "Product_category"
            ],
            "values": [
              "id"
            ],
            "as": [
              "targetId"
            ],
            "default": "some label"
          }
        ]
      },
      {
        "name": "productShipmentPath",
        "source": "data",
        "transform": [
          {
            "type": "aggregate",
            "groupby": [
              "Product_category",
              "Part_shipment"
            ],
            "fields": [
              "avg_time"
            ],
            "ops": [
              "average"
            ],
            "as": [
              "avg_time"
            ]
          },
          {
            "type": "lookup",
            "from": "block_data",
            "key": "value",
            "fields": [
              "Product_category"
            ],
            "values": [
              "id"
            ],
            "as": [
              "sourceId"
            ],
            "default": "some label"
          },
          {
            "type": "lookup",
            "from": "block_data",
            "key": "value",
            "fields": [
              "Part_shipment"
            ],
            "values": [
              "id"
            ],
            "as": [
              "targetId"
            ],
            "default": "some label"
          }
        ]
      },
      {
        "name": "data_selected",
        "values": null
      }
    ],
    "signals": [
      {
        "name": "fontSize",
        "update": "height/35"
      },
      {
        "name": "label_dy",
        "update": "fontSize * 1.8"
      },
      {
        "name": "active",
        "value": null,
        "on": [
          {
            "events": "rect:click",
            "update": "null"
          }
        ]
      }
    ],
    "scales": [
      {
        "name": "yscale",
        "type": "band",
        "range": "height",
        "round": true,
        "domain": {
          "data": "fields",
          "field": "data"
        },
        "padding": 0.7
      },
      {
        "name": "Shift",
        "type": "band",
        "range": "width",
        "domain": {
          "data": "rawData",
          "field": "Shift"
        },
        "padding": 0
      },
      {
        "name": "Weekday",
        "type": "band",
        "range": "width",
        "domain": {
          "data": "rawData",
          "field": "Weekday"
        },
        "padding": 0
      },
      {
        "name": "Product_category",
        "type": "band",
        "range": "width",
        "domain": {
          "data": "rawData",
          "field": "Product_category"
        },
        "padding": 0
      },
      {
        "name": "Part_shipment",
        "type": "band",
        "range": "width",
        "domain": {
          "data": "rawData",
          "field": "Part_shipment"
        },
        "padding": 0
      },
      {
        "name": "colorScale",
        "type": "linear",
        "domain": [1.6, 1.9],
        "range": ['red', 'yellow', 'green'],
        // "reverse": true
      }
    ],
    "axes": [
      {
        "orient": "left",
        "scale": "yscale",
        "domain": false,
        "ticks": false,
        "encode": {
          "labels": {
            "update": {
              "fontSize": {
                "signal": "fontSize"
              },
              "dx": {
                "value": -10
              }
            }
          }
        }
      },
      {
        "orient": "top",
        "zindex": 1,
        "scale": "Shift",
        "offset": {
          "scale": "yscale",
          "value": "Shift",
          "mult": -1
        },
        "domain": false,
        "ticks": false,
        "encode": {
          "labels": {
            "update": {
              "fontSize": {
                "signal": "fontSize"
              },
              "dy": {
                "signal": "label_dy"
              }
            }
          }
        }
      },
      {
        "orient": "top",
        "zindex": 1,
        "scale": "Weekday",
        "offset": {
          "scale": "yscale",
          "value": "Weekday",
          "mult": -1
        },
        "domain": false,
        "ticks": false,
        "encode": {
          "labels": {
            "update": {
              "fontSize": {
                "signal": "fontSize"
              },
              "dy": {
                "signal": "label_dy"
              }
            }
          }
        }
      },
      {
        "orient": "top",
        "zindex": 1,
        "scale": "Product_category",
        "offset": {
          "scale": "yscale",
          "value": "Product_category",
          "mult": -1
        },
        "domain": false,
        "ticks": false,
        "encode": {
          "labels": {
            "update": {
              "fontSize": {
                "signal": "fontSize"
              },
              "dy": {
                "signal": "label_dy"
              }
            }
          }
        }
      },
      {
        "orient": "top",
        "zindex": 1,
        "scale": "Part_shipment",
        "offset": {
          "scale": "yscale",
          "value": "Part_shipment",
          "mult": -1
        },
        "domain": false,
        "ticks": false,
        "encode": {
          "labels": {
            "update": {
              "fontSize": {
                "signal": "fontSize"
              },
              "dy": {
                "signal": "label_dy"
              }
            }
          }
        }
      }
    ],
    "marks": [
      {
        "name": "rectData",
        "type": "rect",
        "from": {
          "data": "block_data"
        },
        "encode": {
          "update": {
            "y": {
              "scale": "yscale",
              "field": "key"
            },
            "x": {
              "scale": {
                "signal": "datum.key"
              },
              "field": "value"
            },
            "height": {
              "signal": "height/15"
            },
            "width": {
              "scale": {
                "signal": "datum.key"
              },
              "band": 1
            },
            "strokeWidth": {
              "value": 0
            },
            "stroke": {
              "value": "#fff"
            },
            "fill": {
              "scale": "colorScale",
              "field": "node_avg_time"
            },
            "opacity": {
              "value": 1
            },
            "tooltip": {
              "signal": "datum"
            }
          }
        }
      },
      {
        "type": "path",
        "name": "pathSet1",
        "from": {
          "data": "shiftWeekPath"
        },
        "encode": {
          "update": {
            "strokeWidth": {
              "signal": "( width / length(data('shiftWeekPath')) )"
            },
            "tooltip": {
              "signal": "(datum)"
            },
            "href": { "value": "https://vega.github.io/" },
            "strokeOpacity": [
              {
                "test": "(indata('data_selected', 'id', datum.sourceId)) || (indata('data_selected', 'id', datum.targetId))",
                "value": 1
              },
              {
                "value": 0
              }
            ],
            "zindex": [
              {
                "test": "indata('data_selected', 'id', datum.sourceId)",
                "value": 1
              },
              {
                "test": "indata('data_selected', 'id', datum.targetId)",
                "value": 1
              },
              {
                "value": 0
              }
            ],
            "stroke": {
              "scale": "colorScale",
              "field": "avg_time"
            }
          }
        },
        "transform": [
          {
            "type": "lookup",
            "from": "rectData",
            "key": "datum.id",
            "fields": [
              "datum.sourceId"
            ],
            "as": [
              "sourceNode"
            ]
          },
          {
            "type": "lookup",
            "from": "rectData",
            "key": "datum.id",
            "fields": [
              "datum.targetId"
            ],
            "as": [
              "targetNode"
            ]
          },
          {
            "type": "joinaggregate",
            "groupby": [
              "sourceNode.datum.id"
            ],
            "as": [
              "targetCount"
            ]
          },
          {
            "type": "joinaggregate",
            "groupby": [
              "targetNode.datum.id"
            ],
            "as": [
              "sourceCount"
            ]
          },
          {
            "type": "stack",
            "groupby": [
              "sourceNode.datum.id"
            ],
            "sort": {
              "field": "datum.sourceId",
              "order": "descending"
            },
            "as": [
              "s_x0",
              "s_x1"
            ]
          },
          {
            "type": "stack",
            "groupby": [
              "targetNode.datum.id"
            ],
            "sort": {
              "field": "datum.targetId",
              "order": "descending"
            },
            "as": [
              "t_x0",
              "t_x1"
            ]
          },
          {
            "type": "formula",
            "expr": "((datum.s_x0 + datum.s_x1)/2)",
            "as": "s_multiple"
          },
          {
            "type": "formula",
            "expr": "((datum.t_x0 + datum.t_x1)/2)",
            "as": "t_multiple"
          },
          {
            "type": "linkpath",
            "sourceX": {
              "expr": "datum.sourceNode.bounds.x1 + ((datum.sourceNode.width / datum.targetCount) * datum.s_multiple)"
            },
            "sourceY": {
              "expr": "datum.sourceNode.bounds.y2"
            },
            "targetX": {
              "expr": "datum.targetNode.bounds.x1 + ((datum.targetNode.width / datum.sourceCount) * datum.t_multiple)"
            },
            "targetY": {
              "expr": "datum.targetNode.bounds.y1"
            },
            "shape": "diagonal"
          }
        ]
      },
      {
        "type": "path",
        "name": "pathSet2",
        "from": {
          "data": "weekProductPath"
        },
        "encode": {
          "update": {
            "strokeWidth": {
              "signal": "( width / length(data('weekProductPath')) )"
            },
            "tooltip": {
              "signal": "(datum)"
            },
            "strokeOpacity": [
              {
                "test": "(indata('data_selected', 'id', datum.sourceId)) || (indata('data_selected', 'id', datum.targetId))",
                "value": 1
              },
              {
                "value": 0
              }
            ],
            "zindex": [
              {
                "test": "indata('data_selected', 'id', datum.sourceId)",
                "value": 1
              },
              {
                "test": "indata('data_selected', 'id', datum.targetId)",
                "value": 1
              },
              {
                "value": 0
              }
            ],
            "stroke": {
              "scale": "colorScale",
              "field": "avg_time"
            }
          }
        },
        "transform": [
          {
            "type": "lookup",
            "from": "rectData",
            "key": "datum.id",
            "fields": [
              "datum.sourceId"
            ],
            "as": [
              "sourceNode"
            ]
          },
          {
            "type": "lookup",
            "from": "rectData",
            "key": "datum.id",
            "fields": [
              "datum.targetId"
            ],
            "as": [
              "targetNode"
            ]
          },
          {
            "type": "joinaggregate",
            "groupby": [
              "sourceNode.datum.id"
            ],
            "as": [
              "targetCount"
            ]
          },
          {
            "type": "joinaggregate",
            "groupby": [
              "targetNode.datum.id"
            ],
            "as": [
              "sourceCount"
            ]
          },
          {
            "type": "stack",
            "groupby": [
              "sourceNode.datum.id"
            ],
            "sort": {
              "field": "datum.sourceId",
              "order": "descending"
            },
            "as": [
              "s_x0",
              "s_x1"
            ]
          },
          {
            "type": "stack",
            "groupby": [
              "targetNode.datum.id"
            ],
            "sort": {
              "field": "datum.targetId",
              "order": "descending"
            },
            "as": [
              "t_x0",
              "t_x1"
            ]
          },
          {
            "type": "formula",
            "expr": "((datum.s_x0 + datum.s_x1)/2)",
            "as": "s_multiple"
          },
          {
            "type": "formula",
            "expr": "((datum.t_x0 + datum.t_x1)/2)",
            "as": "t_multiple"
          },
          {
            "type": "linkpath",
            "sourceX": {
              "expr": "datum.sourceNode.bounds.x1 + ((datum.sourceNode.width / datum.targetCount) * datum.s_multiple)"
            },
            "sourceY": {
              "expr": "datum.sourceNode.bounds.y2"
            },
            "targetX": {
              "expr": "datum.targetNode.bounds.x1 + ((datum.targetNode.width / datum.sourceCount) * datum.t_multiple)"
            },
            "targetY": {
              "expr": "datum.targetNode.bounds.y1"
            },
            "shape": "diagonal"
          }
        ]
      },
      {
        "type": "path",
        "name": "pathSet3",
        "from": {
          "data": "productShipmentPath"
        },
        "encode": {
          "update": {
            "strokeWidth": {
              "signal": "( width / length(data('productShipmentPath')) )"
            },
            "tooltip": {
              "signal": "(datum)"
            },
            "strokeOpacity": [
              {
                "test": "(indata('data_selected', 'id', datum.sourceId)) || (indata('data_selected', 'id', datum.targetId))",
                "value": 1
              },
              {
                "value": 0
              }
            ],
            "zindex": [
              {
                "test": "indata('data_selected', 'id', datum.sourceId)",
                "value": 1
              },
              {
                "test": "indata('data_selected', 'id', datum.targetId)",
                "value": 1
              },
              {
                "value": 0
              }
            ],
            "stroke": {
              "scale": "colorScale",
              "field": "avg_time"
            }
          }
        },
        "transform": [
          {
            "type": "lookup",
            "from": "rectData",
            "key": "datum.id",
            "fields": [
              "datum.sourceId"
            ],
            "as": [
              "sourceNode"
            ]
          },
          {
            "type": "lookup",
            "from": "rectData",
            "key": "datum.id",
            "fields": [
              "datum.targetId"
            ],
            "as": [
              "targetNode"
            ]
          },
          {
            "type": "joinaggregate",
            "groupby": [
              "sourceNode.datum.id"
            ],
            "as": [
              "targetCount"
            ]
          },
          {
            "type": "joinaggregate",
            "groupby": [
              "targetNode.datum.id"
            ],
            "as": [
              "sourceCount"
            ]
          },
          {
            "type": "stack",
            "groupby": [
              "sourceNode.datum.id"
            ],
            "sort": {
              "field": "datum.sourceId",
              "order": "descending"
            },
            "as": [
              "s_x0",
              "s_x1"
            ]
          },
          {
            "type": "stack",
            "groupby": [
              "targetNode.datum.id"
            ],
            "sort": {
              "field": "datum.targetId",
              "order": "descending"
            },
            "as": [
              "t_x0",
              "t_x1"
            ]
          },
          {
            "type": "formula",
            "expr": "((datum.s_x0 + datum.s_x1)/2)",
            "as": "s_multiple"
          },
          {
            "type": "formula",
            "expr": "((datum.t_x0 + datum.t_x1)/2)",
            "as": "t_multiple"
          },
          {
            "type": "linkpath",
            "sourceX": {
              "expr": "datum.sourceNode.bounds.x1 + ((datum.sourceNode.width / datum.targetCount) * datum.s_multiple)"
            },
            "sourceY": {
              "expr": "datum.sourceNode.bounds.y2"
            },
            "targetX": {
              "expr": "datum.targetNode.bounds.x1 + ((datum.targetNode.width / datum.sourceCount) * datum.t_multiple)"
            },
            "targetY": {
              "expr": "datum.targetNode.bounds.y1"
            },
            "shape": "diagonal"
          }
        ]
      },
      {
        "name": "rectData2",
        "type": "rect",
        "from": {
          "data": "block_data"
        },
        "encode": {
          "update": {
            "y": {
              "scale": "yscale",
              "field": "key"
            },
            "x": {
              "scale": {
                "signal": "datum.key"
              },
              "field": "value"
            },
            "height": {
              "signal": "20"
            },
            "width": {
              "scale": {
                "signal": "datum.key"
              },
              "band": 1
            },
            "strokeWidth": {
              "value": 0
            },
            "stroke": {
              "value": "#fff"
            },
            "fill": {
              "scale": "colorScale",
              "field": "node_avg_time"
            },
            "opacity": {
              "value": 1
            },
            "tooltip": {
              "signal": "datum"
            }
          }
        }
      }
    ]
  }
  return config
}
