const React = require('react')
const ReactDOM = require('react-dom')
const ReactRouter = require('react-router')
const History = require('history')

const { Content, About, Admit } = require('./components/contents')

let { Router, Route, Link, withRouter } = ReactRouter
let hashHistory = ReactRouter.useRouterHistory(History.createHashHistory)({
  queryKey: false
})


ReactDOM.render(
    <Router history={hashHistory}>
        <Route path='/' component={Content}>
            <Route path='/admit' component={Admit} />
            <Route path='/about' component={About} />
        </Route>
    </Router>,
    document.getElementById('app')
)
