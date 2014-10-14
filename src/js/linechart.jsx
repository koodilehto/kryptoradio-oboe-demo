'use strict';
var React = require('react');
var _ = require('underscore');

var Chart = require('./chart.jsx')
var DataSeries = require('./dataseries.jsx');


module.exports = React.createClass({
  getDefaultProps: function() {
    return {
      width: 600,
      height: 300
    }
  },

  render: function() {
    var data = this.props.data,
        size = { width: this.props.width, height: this.props.height };

    var max = _.max(_.flatten(_.values(data)), function(o) {return o.y;}).y;

    var xScale = d3.scale.linear()
      .domain([0, _.max(data, function(arr) {return arr.length}).length])
      .range([0, this.props.width]);

    var yScale = d3.scale.linear()
      .domain([0, max])
      .range([this.props.height, 0]);

    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries data={data.requests} size={size} xScale={xScale} yScale={yScale} ref="requests" color="cornflowerblue" />
        <DataSeries data={data.bids} size={size} xScale={xScale} yScale={yScale} ref="bids" color="red" />
        <DataSeries data={data.trades} size={size} xScale={xScale} yScale={yScale} ref="trades" color="green" />
      </Chart>
    );
  }
});
