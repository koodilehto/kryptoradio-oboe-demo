'use strict';
var React = require('react');
var oboe = require('oboe');

var LineChart = require('./linechart.jsx');


module.exports  = React.createClass({
    displayName: 'DemoPage',

    getInitialState: function() {
        return {
            exchanges: [],
            requests: [],
            bids: [],
            trades: []
        };
    },
    componentDidMount: function() {
        var that = this;

        oboe('http://localhost:3000/api/resource/exchange/jsoncsv')
           .node('*', function(arr) {
                if(Array.isArray(arr) && Array.isArray(arr[0])) {
                    arr = arr[0];

                    var actionType = arr[3];
                    var priceLevel = parseFloat(arr[4]);
                    var amount = parseFloat(arr[5]);
                    amount = isNaN(amount)? 0: amount;

                    var o = {
                        marketName: arr[0],
                        securityName: arr[1],
                        currency: arr[2],
                        actionType: actionType,
                        priceLevel: priceLevel,
                        amount: amount
                    };

                    that.setState({
                        exchanges: that.state.exchanges.concat([o])
                    });

                    addPrice({
                        R: 'requests',
                        B: 'bids',
                        T: 'trades'
                    }[actionType], priceLevel);
                }
           });

        function addPrice(name, level) {
            if(!name) {
                return console.warn('addPrice - missing name');
            }

            var state = that.state[name];
            var o = {};

            o[name] = state.concat({
                x: state.length,
                y: level
            });

            that.setState(o);
       }
    },
    render: function() {
        var exchanges = this.state.exchanges;
        var data = {
            requests: this.state.requests,
            bids: this.state.bids,
            trades: this.state.trades
        };

        return (
            <div>
                <h1>Exchanges</h1>

                <LineChart data={data} />

                <table className="exchanges">
                    <thead>
                        <tr>
                            <th>Market name</th>
                            <th>Security name</th>
                            <th>Currency</th>
                            <th>Action type</th>
                            <th>Price level</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                    {exchanges.map(function(exchange, i) {
                        return <tr key={i}>
                            <td>{exchange.marketName}</td>
                            <td>{exchange.securityName}</td>
                            <td>{exchange.currency}</td>
                            <td>{exchange.actionType}</td>
                            <td>{exchange.priceLevel}</td>
                            <td>{exchange.amount}</td>
                        </tr>;
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
});
