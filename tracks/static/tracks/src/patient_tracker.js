var timeline_original_data;

(function() {
  patientTimeline = function() {
    var orient = "top",
        daysPerMonth = 365.242199/12,
        width = null,
        height = null,
        tickFormat = { format: d3.time.format("%I %p"), 
          tickTime: d3.time.hours, 
          tickNumber: 1, 
          tickSize: 1 },
        nColors = 20;
        colorCycle = d3.scale.category20().domain(d3.range(0,nColors)),
        colorPropertyName = null,
        opacityPropertyName = null,
        beginning = 0,
        ending = 0,
        margin = {left: 250, right:30, top: 20, bottom:8},
        stacked = false,
        rotateTicks = false,
        itemHeight = 25,
        itemMargin = 8
      ;

    function timeline (gParent) {
      var g = gParent.append("g");
      var gParentSize = gParent[0][0].getBoundingClientRect();

      var gParentItem = d3.select(gParent[0][0]);

      var yAxisMapping = {},
        maxStack = 1,
        minTime = 0,
        maxTime = Number.NEGATIVE_INFINITY;
      
      setWidth();

      // check how many stacks we're gonna need
      // do this here so that we can draw the axis before the graph
        g.each(function (d, i) {
          d.forEach(function (datum, index) {

            // create y mapping for stacked graph
            if (stacked && Object.keys(yAxisMapping).indexOf(index) === -1) {
              yAxisMapping[index] = maxStack;
              maxStack++;
            }

            // figure out beginning and ending times if they are unspecified
            if (ending === 0 && beginning === 0){
              datum.times.forEach(function (time, i) {
                if (time.starting_time < minTime)
                  minTime = time.starting_time;
                if (time.ending_time > maxTime)
                  maxTime = time.ending_time;
                if (time.starting_time > maxTime)
                  maxTime = time.starting_time;
              });
            }
          });
        });

        beginning = minTime;
        ending = maxTime;

        setTickFormat();

      var scaleFactor = (1/(ending - beginning)) * (width - margin.left - margin.right);

      // draw the axis
      var xScale = d3.time.scale()
        .domain([beginning, ending])
        .range([margin.left, width - margin.right]);

      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient(orient)
        .tickFormat(tickFormat.format)
        .ticks(tickFormat.tickTime, tickFormat.tickNumber)
        .tickValues(tickFormat.tickValues)
        .tickSize(tickFormat.tickSize);

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 0 +","+(margin.top + (itemHeight + itemMargin) * maxStack)+")")
        .call(xAxis);

      gParent.append('text')
          .attr("class", "timeline-label")
          .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
          .text("Time since admission (Months)");

      // draw the chart
      g.each(function(d, i) {
        d.forEach( function(datum, index){
          var data = datum.times;
          var hasLabel = (typeof(datum.label) !== "undefined");
          
          var sg = g.selectAll("svg").data(data).enter()
            .append('g')
            .attr('id', function (d, i) {
                return d.id;
            })
            .attr('transform',getTransform)
            .attr("tip",  function (d, i) {
              return d.tooltip;
            })
            .attr("class",  function (d, i) {
                var ret = "timeline-viz-elem";
                if (datum.class) ret += " "+datum.class;
                if (d.class) ret += " "+d.class;
                return ret;
            })
            .on("mouseover", function(d, i){
              $('.timeline-viz-elem').tooltip({
                 content: d.tooltip,
                 position: 'absolute',
                  onShow: function(){
                    $(this).tooltip('tip').css({
                      backgroundColor: '#666',
                      borderColor: '#666' 
                    });
                  }
              });

              // showTip(d.tooltip);
              $('#summary_div').html(d.tooltip)
              // addToolTip(d.tooltip);
            });

            sg.append(datum.display)
            .attr("width", function (d, i) {
              return (d.ending_time - d.starting_time) * scaleFactor;
            })
            .attr("r", itemHeight/2)
            .attr("height", 4)
            .attr("fill", function(d, i){ 
              if( colorPropertyName ){ 
                  if (d[colorPropertyName]&&d[colorPropertyName].indexOf('#')===0) 
                    return d[colorPropertyName];
                  return colorCycle( sumCharCodes(d[colorPropertyName]) % nColors );
              } 
              return colorCycle(index % nColors);  
            })
            .attr("opacity", function(d, i){ 
              if( opacityPropertyName ){ 
                  return d[opacityPropertyName];
              } 
              return 1.0;  
            });

          // add the label
          if (hasLabel) {
            gParent.append('text')
              .attr("class", "timeline-label")
              .attr("transform", "translate("+ 0 +","+ (itemHeight/2 + margin.top + (itemHeight + itemMargin) * yAxisMapping[index])+")")
              .text(hasLabel ? datum.label : datum.id);
          }

          function getStackPosition(d, i) {
            if (stacked) {
              return margin.top + (itemHeight + itemMargin) * yAxisMapping[index];
            } 
            return margin.top;
          }
      
            function getTransform(d, i) {
                return 'translate('+getXPos(d,i)+','+getStackPosition(d,i)+")";
            }
        });
      });
      
      if (rotateTicks) {
        g.selectAll("text")
          .attr("transform", function(d) {
            return "rotate(" + rotateTicks + ")translate("
              + (this.getBBox().width/2+10) + "," // TODO: change this 10
              + this.getBBox().height/2 + ")";
          });
      }

      var gSize = g[0][0].getBoundingClientRect();
      setHeight();
          
      // addToolTip();

      function sumCharCodes(str) {
          if (!str) return 0;
          var strU = str.toUpperCase();
          var sum = 0;
          for (var i=0; i<strU.length; i++) {
              sum += strU.charCodeAt(i);
          }
          return sum;
      }
      
      function getXPos(d, i) {
        return margin.left + (d.starting_time - beginning) * scaleFactor;
      }
      
      function setTickFormat() {
          var tickValues = [];
		  var num_months=0 ;
		  
          for (var i=0; i*1*daysPerMonth<=ending; i++) {
		        num_months+=1 ;
          } ;
		  step=1
		  if (num_months>=100) {
				  step=6
			  }
		  if (num_months>=200) {
				  step=12
			  }
          if (beginning<0) {
              for (var i=-1; i*step*daysPerMonth>=beginning; i++) {
                  tickValues.push(i*step*daysPerMonth);
              }
          }
          // time tickform to each month 
          for (var i=0; i*step*daysPerMonth<=ending; i++) {
              tickValues.push(i*step*daysPerMonth);
          }
          
          tickFormat = {
            format: function(d) {return (d/daysPerMonth).toFixed(0);}, 
            tickValues: tickValues, 
            tickSize: 8
          };
      }

      function showTip(html){

      }
      
      function addToolTip() {
            var params = {
                content: {attr:"tip"},
                show: {event: "mouseover"},
                hide: {fixed: true, delay: 100, event:"mouseout"},
                style: { classes: 'qtip-light qtip-rounded qtip-wide' },
                position: {my:'top middle',at:'bottom middle',viewport: $(window)},
                events: {
                    render: function(event, api) {
                        $(".timeline-tooltip-table.uninitialized").dataTable( 
                            {
                            "sDom": 't',
                            "bJQueryUI": true,
                            "bDestroy": true,
                            "aoColumnDefs": [
                                
                            ],
                            "oLanguage": {
                                "sInfo": "&nbsp;&nbsp;(_START_ to _END_ of _TOTAL_)&nbsp;&nbsp;",
                                "sInfoFiltered": "",
                            },
                            "fnDrawCallback": function ( oSettings ) {
                                $(oSettings.nTHead).hide();
                            },
                            "aaSorting": [[0,'asc']],
                            "iDisplayLength": -1
                            } 
                        ).removeClass('uninitialized');
                    }
                }
             };
            $(".timeline-viz-elem").qtip(params);
      }

      function setHeight() {
        if (!height && !gParentItem.attr("height")) {
          if (itemHeight) {
            // set height based off of item height
            height = gSize.height + gSize.top - gParentSize.top + margin.bottom;
            // set bounding rectangle height
            d3.select(gParent[0][0]).attr("height", height);
          } else {
            throw "height of the timeline is not set";
          }
        } else {
          if (!height) {
            height = gParentItem.attr("height");
          } else {
            gParentItem.attr("height", height);
          }
        }
      }

      function setWidth() {
        if (!width && !gParentSize.width) {
          throw "width of the timeline is not set. As of Firefox 27, timeline().with(x) needs to be explicitly set in order to render";
        } else if (!(width && gParentSize.width)) {
          if (!width) {
            width = gParentItem.attr("width");
          } else {
            gParentItem.attr("width", width);
          }
        }
        // if both are set, do nothing
      }
    }

    timeline.margin = function (p) {
      if (!arguments.length) return margin;
      margin = p;
      return timeline;
    }
    
    timeline.itemHeight = function (h) {
      if (!arguments.length) return itemHeight;
      itemHeight = h;
      return timeline;
    }

    timeline.itemMargin = function (h) {
      if (!arguments.length) return itemMargin;
      itemMargin = h;
      return timeline;
    }

    timeline.height = function (h) {
      if (!arguments.length) return height;
      height = h;
      return timeline;
    };

    timeline.width = function (w) {
      if (!arguments.length) return width;
      width = w;
      return timeline;
    };

    timeline.tickFormat = function (format) {
      if (!arguments.length) return tickFormat;
      tickFormat = format;
      return timeline;
    };

    timeline.colors = function (colorFormat) {
      if (!arguments.length) return colorCycle;
      colorCycle = colorFormat;
      return timeline;
    };

    timeline.rotateTicks = function (degrees) {
      rotateTicks = degrees;
      return timeline;
    }

    timeline.stack = function () {
      stacked = !stacked;
      return timeline;
    };

    timeline.colorProperty = function(colorProp) {
      if (!arguments.length) return colorPropertyName;
      colorPropertyName = colorProp;
      return timeline;
    };

    timeline.opacityProperty = function(opacityProp) {
      if (!arguments.length) return opacityPropertyName;
      opacityPropertyName = opacityProp;
      return timeline;
    };
    
    return timeline;
  };
})();

(function () {
    prepareTimeLineData = (function() {
    	function checkNullOrUndefined(o) {
        	return o === null || typeof o === "undefined";
    	};
    
        function getStartStopDates(timePointData) {
            var startDate = timePointData["startDate"];
            var stopDate = timePointData["stopDate"];
            //TODO handling events spanning in two months
            var eventMonth = timePointData["eventMon"];
            var eventYear = timePointData["eventYear"];
            if (checkNullOrUndefined(stopDate)) stopDate = startDate;
            return [startDate, stopDate, eventMonth, eventYear];
        }
        
        function getTreatmentAgent(treatment) {
            var eventData = treatment["eventData"];
            var agent = eventData["AGENT"];
            if (checkNullOrUndefined(agent)) {
                agent = eventData["SUBTYPE"];
            }
            if (checkNullOrUndefined(agent)) {
                agent = eventData["TREATMENT_TYPE"];
            }
            return agent;
        }
        
        function separateEvents(events, attr) {
            var ret = {};
            events.forEach(function(event) {
                var value = event["eventData"][attr];
                if (!(value in ret)) {
                    ret[value] = [];
                }
                ret[value].push(event);
            });
            return ret;
        }
        
        function separateEventsByTime(events, allowOneDayOverlap) {
            var ret = [];
            events.forEach(function(event) {
                var dates = getStartStopDates(event);
                for (var row=0; row<ret.length; row++) {
                    var currStopDate = getStartStopDates(ret[row][ret[row].length-1])[1]; // assume sorted
                    if (dates[0]>currStopDate) break;
                    if (allowOneDayOverlap && dates[0]===currStopDate) break;
                }
                if (row===ret.length) ret.push([]);
                ret[row].push(event);
            });
            return ret;
        }

        function getColor(timePointData) {
            var type = timePointData["eventType"];
            if (type==="SPECIMEN")
                return "#999999";
            if (type==="TREATMENT")
                return getTreatmentAgent(timePointData);
            if (type==="LAB_TEST")
//                return timePointData["eventData"]["TEST"];
                return "#CC0000";
            if (type==="DIAGNOSTIC")
                return "#0099CC";
//                return timePointData["eventData"]["DIAGNOSTIC_TYPE"];
            if (type==="STATUS")
                return "#FF8800";
            return type;
        }
        
        function getOpacity(timePointData) {
            var type = timePointData["eventType"];
            if (type==="LAB_TEST") {
                var test = timePointData["eventData"]["TEST"];
                if (test) {
                    if (test.toUpperCase()==='PSA') {
                        var result = timePointData["eventData"]["RESULT"];
                        if (!result) return 0;
                        var psa = parseFloat(result)+1.1;
                        return Math.log(psa)/Math.log(1000);
                    }
                }
            }
            return 1.0;
        }
        
        function formatATimePoint(timePointData) {
            var dates = getStartStopDates(timePointData);

            var tooltip = [];
            tooltip.push("<td><b>Date</b></td><td>"+Math.round(dates[0])+  ", "+dates[2]+", "+dates[3]+(dates[1]===dates[0]?"":" - "+dates[1] + ", "+dates[2] +", "+dates[3])+"</td>");

            if ("eventData" in timePointData) {
                var eventData = timePointData["eventData"];
                tooltip.push("<td><b>Key</b></td><td>"+eventData+"</td>");
                //for (var key in eventData) {
                //    tooltip.push("<td>"+key+"</td><td>"+eventData[key]+"</td>");
                //}
            }
            
            var ret = {
                starting_time : dates[0],
                ending_time : dates[1],
                color: getColor(timePointData),
                opacity: getOpacity(timePointData),
                tooltip : "<table class='timeline-tooltip-table uninitialized'><thead><tr><th>&nbsp;</th><th>&nbsp;</th></tr></thead><tr>" + tooltip.join("</tr><tr>") + "</tr></table>"
            };
            
            var su2cSampleId = timePointData["eventData"];
            
            if (su2cSampleId) 
                ret['class'] = 'timeline-'+su2cSampleId;
            
            return ret;
        }
        
        function formatTimePoints(timePointsData) {
            var times = [];
            timePointsData.forEach(function(timePointData){
                times.push(formatATimePoint(timePointData));
            });
            return times;
        }
        
        function combineTimePointsByTime(sortedTimePoints) {
            if (!sortedTimePoints || sortedTimePoints.length===0) return sortedTimePoints;
            var pre = 0;
            var ret = [sortedTimePoints[0]];
            // assume sorted
            for (var i=1; i<sortedTimePoints.length; i++) {
                var preEvent = ret[pre];
                var currEvent = sortedTimePoints[i];
                if (preEvent["starting_time"]===currEvent["starting_time"]) {
                    preEvent["tooltip"] += "<hr>"+currEvent["tooltip"];
                } else {
                    ret.push(currEvent);
                    pre++;
                }
                
            }
            return ret;
        }
        
        function sortByDate(timePointsData, optionalAttr) {
            return timePointsData.sort(function(a,b){
                if (a["startDate"]===b["startDate"] && optionalAttr) {
                    var va = a["eventData"][optionalAttr];
                    var vb = a["eventData"][optionalAttr];
                    if (va===vb) return 0;
                    if ((typeof va)!=='string') return 1;
                    return va.localeCompare(vb);
                }
                return a["startDate"]-b["startDate"];
            });
        }
        
        function filter(timePointsData, key, value) {
        	var ret = [];
        	for (var i in timePointsData) {
        		var tpd = timePointsData[i];
        		var type = tpd["eventData"][key];
        		if (type && type.toUpperCase()===value)
        			ret.push(tpd);
        	}
            return ret;
        }
            
        var prepare = function(timelineData) {
            var timelineDataByType = {};
            //var i=0;
            timelineData.forEach(function(data) {
                var type = data["eventData"];
                if (!(type in timelineDataByType)) timelineDataByType[type] = [];
                timelineDataByType[type].push(data);
            });

            var ret = [];
            var minTime = maxTime = 0;
                
            for (var eventCode in timelineDataByType) { 
                var eventGroup = sortByDate(timelineDataByType[eventCode]);
                var times_calculated = combineTimePointsByTime(formatTimePoints(eventGroup));
                times_calculated.forEach(function (time, i) {
                    if (time.starting_time < minTime)
                      minTime = time.starting_time;
                    if (time.ending_time > maxTime)
                      maxTime = time.ending_time;
                    if (time.starting_time > maxTime)
                      maxTime = time.starting_time;
                });

                ret.push({
                    label:eventCode,
                    display:"circle",
                    class:"timeline-eventcode",
                    times: times_calculated
                })
                //if(++i == 20)
                //  break;
      		}
            /*if ("Medication" in timelineDataByType) {
                var eventGroup = sortByDate(timelineDataByType["Medication"]);
                ret.push({
                    label:"Medication",
                    display:"circle",
                    class:"timeline-medication",
                    times:combineTimePointsByTime(formatTimePoints(eventGroup))});
            }*/
            timeline_original_data = ret;
            $( "#amount" ).val( "" + Math.round(minTime) + " - " + Math.round(maxTime) );
            $("#slider-range").slider({min: Math.round(minTime), max: Math.round(maxTime), values: [ Math.round(minTime), Math.round(maxTime) ]});

            return ret;
//            return [
//                    {label:"Diagnostics", display:"circle", times: [{"starting_time": 0, "tooltip":"First diagonosis"},{"starting_time": 200}, {"ending_time": 500}]},
//                    {label:"Lab Tests", display:"circle", times: [{"starting_time": -10}, ]},
//                    {label:"Therapy", display:"rect", times: [{"starting_time": 140, "ending_time": 360, "tooltip":"Chemo"}]},
    //                  ];

              };
        
          return {
            prepare: prepare
          };

    })();
})();


// Filter Timeline data for slider
function filterRet(start, end) {
    var json_filtered = JSON.parse(JSON.stringify(timeline_original_data));
    var times_filtered = new Array();
    for(var i=0; i<timeline_original_data.length; i++) {
        times_filtered = [];
        for(var j=0; j<timeline_original_data[i].times.length; j++) {
            if(start <= timeline_original_data[i].times[j].starting_time && timeline_original_data[i].times[j].starting_time <= end) {
            times_filtered.push(timeline_original_data[i].times[j]);
            }
        }
        json_filtered[i].times = times_filtered;        
    }
    return json_filtered;
}
