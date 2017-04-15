const React = require('react')
const { Link } = require('react-router')

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
    router: React.PropTypes.object.isRequired
}

export function About() {
    return (
        <div>
            <h1>About</h1>
        </div>
    )
}

export class Admit extends React.Component {
    render() {
        return(
            <div>
                <h1>Admit</h1>
            </div>
        )
    }
}