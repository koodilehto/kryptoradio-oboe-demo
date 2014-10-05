'use strict';
var React = require('react');
var oboe = require('oboe');


module.exports  = React.createClass({
    displayName: 'DemoPage',

    getInitialState: function() {
        return {
            exchanges: []
        };
    },
    componentDidMount: function() {
        var that = this;

        oboe('http://localhost:3000/api/resource/exchange/jsoncsv')
           .node('*', function(arr) {
                if(Array.isArray(arr) && Array.isArray(arr[0])) {
                    arr = arr[0];
                    var o = {
                        marketName: arr[0],
                        securityName: arr[1],
                        currency: arr[2],
                        actionType: arr[3],
                        priceLevel: arr[4],
                        amount: parseFloat(arr[5])
                    };

                    console.log('received a fragment', o);

                    that.setState({exchanges: that.state.exchanges.concat([o])});
                }
           });
    },
    render: function() {
        var exchanges = this.state.exchanges;

        return (
            <div>
                <h1>Exchanges</h1>

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
