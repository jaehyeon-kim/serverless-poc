const React = require('react')
const PropTypes = require('prop-types')
const { Link } = require('react-router')
const { Button, Modal } = require('react-bootstrap')

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

class ResultModal extends React.Component {
    constructor(props) {
        super(props)
    }
    getInitialState() {
        return { showModal: false };
    }
    close() { this.setState({ showModal: false }) }
    open() { this.setState({ showModal: true }) }
    render() {
        return(
            <div>
                
            </div>
        )
    }
}

export class Admit extends React.Component {
    constructor(props) {
        super(props)
        this.state = { gre: 800, gpa:4.0, rank: "1", result: 'init', showModal: false}
        this.handleGREChange = this.handleGREChange.bind(this)
        this.handleGPAChange = this.handleGPAChange.bind(this)
        this.handleRankChange = this.handleRankChange.bind(this)
        this.getAdmit = this.getAdmit.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.modalClose = this.modalClose.bind(this)
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
    getResultString(result) {
        if (result == null) {
            return "Please try again!!"
        } else if (result == "init") {
            return "Processing..."
        } else {
            return (result ? "Congratulations! Expected status is PASS!!" : "Oops! Expected status is FAIL!!")
        }
    }
    handleGREChange(event) {
        this.setState({gre: this.getInputValue(event.target.value, 0, 800)})
    }
    handleGPAChange(event) {
        this.setState({gpa: this.getInputValue(event.target.value, 0, 4)})
    }
    handleRankChange(event) {        
        this.setState({rank: event.target.value})
    }
    sleep(milliseconds) {
        let start = new Date().getTime()
        for (let i=0; i<1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) break;
        }
    }
    getAdmit(event) {
        this.setState({result:'init'})
        let baseUrl = 'https://api.jaehyeon.me/poc/admit'
        let reqUrl = baseUrl + '?gre=' + this.state.gre + '&gpa=' + this.state.gpa + '&rank=' + this.state.rank
        fetch(reqUrl, {
            headers: {
                'x-api-key': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }
        })
        .then((response)=>{return response.json()})
        .then((data) =>{this.setState({result:data.body.result})})
        .catch((error) => this.setState({result:null}))

        this.modalOpen()
    }
    modalOpen() {
        this.setState({ showModal: true })
    }
    modalClose() {
        this.setState({ showModal: false })
    }
    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
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
                                <button type="button" className="btn btn-default" onClick={this.getAdmit}>Check!</button>
                                <Modal show={this.state.showModal} onHide={this.modalClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Predicted admission status</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <h3>{this.getResultString(this.state.result)}</h3>
                                        <hr />
                                        <p>GRE: {this.state.gre}</p>
                                        <p>GPA: {this.state.gpa}</p>
                                        <p>RANK: {this.state.rank}</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={this.modalClose}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

