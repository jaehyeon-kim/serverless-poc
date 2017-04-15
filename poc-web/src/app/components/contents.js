const React = require('react')
const PropTypes = require('prop-types')
const { Link } = require('react-router')
const { fetch } = require('isomorphic-fetch')
import 'es6-promise';

export class Content extends React.Component {
    render() {
        return (
            <div>
                <h1>Serverless POC</h1>
                <div className='navbar navbar-default'>
                    <ul className='nav nav-pill navbar-nav'>
                        <li className={(this.context.router.isActive('/admit')) ? 'active' : ''}>
                            <Link to='/admit' activeClassName='active'>Admit</Link>
                        </li>
                        <li className={(this.context.router.isActive('/about')) ? 'active' : ''}>
                            <Link to='/about' activeClassName='active'>About</Link>
                        </li>                        
                    </ul>
                </div>
                {this.props.children}
            </div>
        )
    }
}

Content.contextTypes = {
    router: PropTypes.object.isRequired
}

export function About() {
    return (
        <div>
            <h1>About</h1>
        </div>
    )
}

export class Admit extends React.Component {
    constructor(props) {
        super(props)
        this.state = { gre: 0, gpa:0.0, rank: "4", result: undefined}
        this.handleGREChange = this.handleGREChange.bind(this)
        this.handleGPAChange = this.handleGPAChange.bind(this)
        this.handleRankChange = this.handleRankChange.bind(this)
        this.getAdmit = this.getAdmit.bind(this)
    }
    getInputValue(val, min, max) {
        let numVal = Number(val)
        if (numVal >= min && numVal <= max) {
            return numVal;
        } else if (numVal > max) {
            return max;
        } else {
            return min;
        }
    }
    handleGREChange(event) {
        this.setState({gre: this.getInputValue(event.target.value, 0, 800)})
        console.log("gre: ", this.state.gre)
    }
    handleGPAChange(event) {
        this.setState({gpa: this.getInputValue(event.target.value, 0, 4)})
        console.log("gpa: ", this.state.gpa)
    }
    handleRankChange(event) {        
        this.setState({rank: event.target.value})
        console.log("rank: ", this.state.rank)
    }
    getAdmit(event) {
        event.preventDefault()
        let baseUrl = 'https://api.jaehyeon.me/poc/admit'
        let reqUrl = baseUrl + '&gre=' + this.state.gre + '&gpa=' + this.state.gpa + '&rank=' + this.state.rank
        console.log(reqUrl)
        fetch(reqUrl, {
            headers: {
                'x-api-key': ''
            }
        })
        .then((response)=>{return response.json()})
        .then((data) =>{this.setState({result:data.result})})
        console.log("result: ", this.state.result)
    }
    render() {
        return(
            <div className="container">
                <form>
                    <div className="form-group">
                        <label htmlFor="gre">GRE:</label>
                        <input type="number" className="form-control" id="gre" value={this.state.gre} onChange={this.handleGREChange} name="gre" min="0" max="800" step="1" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gpa">GPA:</label>
                        <input type="number" className="form-control" id="gpa" value={this.state.gpa} onChange={this.handleGPAChange} name="gpa" min="0" max="4" step="0.1" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rank">Rank:</label>
                        <select className="form-control" id="rank" value={this.state.rank} onChange={this.handleRankChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-default" onClick={this.getAdmit}>Check!</button>
                    </div>
                </form>
            </div>
        )
    }
}