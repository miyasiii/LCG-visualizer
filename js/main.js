let margin = {top: 20, right: 20, bottom: 30, left: 60};
let width = 500 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "item")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let xScale = d3.scaleLinear().domain([0,1]).range([0,width]);
let yScale = d3.scaleLinear().domain([0,1]).range([height,0]);

let xAxis = d3.axisBottom(xScale).tickSizeInner(6).tickSizeOuter(-height)
let yAxis = d3.axisLeft(yScale).tickSizeInner(6).tickSizeOuter(-width)

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
    .attr("y", height/2)
    .attr("x", -30)
    .style("text-anchor", "end")
    .style("fill", "#000")
    .text("Ui"); 
 
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
    .attr("y", 30)
    .attr("x", width/2)
    .style("text-anchor", "start")
    .style("fill", "#000")
    .text("Ui+1"); 

const sample = 5000;
const colorCategoryScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, sample]);

function update(){
  svg.selectAll("circle").remove();
  let data = [];
  let d = 0;

  var a = parseInt(document.getElementById("param_m").value)
  var c = parseInt(document.getElementById("param_c").value)
  var m = parseInt(document.getElementById("param_a").value)

  for (i=0; i < sample; i++) {
    data.push({"i":d/m, "i1":0, "idx":i});
    d = (a * d + c) % m;
    data[i]["i1"] = d/m;
  }

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 2)
    .attr("fill", function(d){ return colorCategoryScale(d["idx"]); })
    .attr("cx", function(d){ return xScale(d["i1"]); })
    .attr("cy", function(d){ return yScale(d["i"]); });
}
  
var timer;

d3.select("#generate-btn").on( "click", function() {
  update();
  d3.event.preventDefault() ;
});

d3.select("#start-btn").on( "click", function() {
  d3.select("#start-btn").attr("disabled","");
  d3.select("#stop-btn").attr("disabled",null);
  d3.selectAll(".tbox").each(function(d,i) {
    this.disabled = "disabled";
  })
  d3.selectAll(".countup-check").each(function(d,i) {
    this.disabled = "disabled";
  })
  timer = setInterval(function(){
    if(checks[0]){
      document.getElementById("param_a").value = parseInt(document.getElementById("param_a").value) + 1;
    }
    if(checks[1]){
      document.getElementById("param_c").value = parseInt(document.getElementById("param_c").value) + 1;
    }
    if(checks[2]){
      document.getElementById("param_m").value = parseInt(document.getElementById("param_m").value) + 1;
    }
    update();
  }, 1000);
  d3.event.preventDefault() ;
});

d3.select("#stop-btn").on( "click", function() {
  d3.select("#stop-btn").attr("disabled","");
  d3.select("#start-btn").attr("disabled",null);
  d3.selectAll(".tbox").each(function(d,i) {
    this.disabled = null;
  })
  d3.selectAll(".countup-check").each(function(d,i) {
    this.disabled = null;
  })
  clearInterval(timer);
  d3.event.preventDefault() ;
});

let checks = [false,false,false];
d3.selectAll(".countup-check").on( "click", function() {
  d3.selectAll(".countup-check").each(function(d,i) {
    if(this.checked === true){
      checks[i] = true;
    }else{
      checks[i] = false;
    }
  });

  if(checks.includes(true)){
    d3.select("#generate-btn").attr("hidden","");
    d3.select("#start-stop-btn").attr("hidden", null);
  }else{
    d3.select("#start-stop-btn").attr("hidden", "");
    d3.select("#generate-btn").attr("hidden", null);
  }

});

// colorbar
var w = "5em";
var h = "1em";
var number = 100;
var bar = d3.select("#bar").append("svg").attr("width",w).attr("height",h);
var color = d3.scaleSequential(d3.interpolateRainbow).domain([0,number]);
var a = bar.append("defs").append("linearGradient").attr("id",'myBar');
for(i=0;i<number;i++){
  a.append("stop").attr("offset",(i*100/number)+'%').attr("stop-color",color(i));
  a.append("stop").attr("offset",((i+1)*100/number)+'%').attr("stop-color",color((i+1)));
}
bar.append("rect").attr("x",0).attr("y",0).attr("width",w).attr("height",h).attr("fill","url(#myBar)");

update();
