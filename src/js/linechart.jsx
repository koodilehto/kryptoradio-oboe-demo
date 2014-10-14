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

    var max = _.chain(data)
      .zip()
      .map(function(values) {
        return _.reduce(values, function(memo, value) {
            return Math.max(memo, value.y);
        }, 0);
      })
      .max()
      .value();

    var xScale = d3.scale.linear()
      .domain([0, data.length])
      .range([0, this.props.width]);

    var yScale = d3.scale.linear()
      .domain([0, max])
      .range([this.props.height, 0]);

    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries data={data} size={size} xScale={xScale} yScale={yScale} ref="data" color="cornflowerblue" />
      </Chart>
    );
  }
});
