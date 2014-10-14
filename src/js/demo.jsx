'use strict';
var React = require('react');
var oboe = require('oboe');

var LineChart = require('./linechart.jsx');


module.exports  = React.createClass({
    displayName: 'DemoPage',

    getInitialState: function() {
        return {
            exchanges: [],
            data: []
        };
    },
    componentDidMount: function() {
        var that = this;

        oboe('http://localhost:3000/api/resource/exchange/jsoncsv')
           .node('*', function(arr) {
                if(Array.isArray(arr) && Array.isArray(arr[0])) {
                    arr = arr[0];

                    var priceLevel = arr[4];
                    var o = {
                        marketName: arr[0],
                        securityName: arr[1],
                        currency: arr[2],
                        actionType: arr[3],
                        priceLevel: priceLevel,
                        amount: parseFloat(arr[5])
                    };

                    console.log('received a fragment', o);

                    that.setState({
                        exchanges: that.state.exchanges.concat([o]),
                        data: that.state.data.concat({
                            x: that.state.data.length,
                            y: priceLevel
                        })
                    });
                }
           });
    },
    render: function() {
        var exchanges = this.state.exchanges;
        var data = this.state.data;

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
