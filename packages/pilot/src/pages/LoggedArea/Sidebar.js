import React from 'react'
import PropTypes from 'prop-types'

import {
  Sidebar,
  SidebarHeader,
  SidebarLinks,
  SidebarLink,
} from 'former-kit'

import { withRouter } from 'react-router-dom'

import Menu32 from 'emblematic-icons/svg/Menu32.svg'

import routes from './routes'

class SidebarContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
    }

    this.handleToggleSidebar = this.handleToggleSidebar.bind(this)
  }

  handleToggleSidebar () {
    const { collapsed } = this.state
    this.setState({ collapsed: !collapsed })
  }

  render () {
    const { collapsed } = this.state
    const { location: { pathname }, history } = this.props

    return (
      <Sidebar collapsed={collapsed}>
        <SidebarHeader>
          {!collapsed &&
            <h1>FormerKit</h1>
          }
          <button onClick={this.handleToggleSidebar}>
            <Menu32 width={16} height={16} />
          </button>
        </SidebarHeader>

        <SidebarLinks>
          {Object.values(routes).map(({ title, path, icon: Icon }) => (
            <SidebarLink
              key={path}
              title={title}
              active={path === pathname}
              icon={<Icon width={16} height={16} />}
              collapsed={collapsed}
              onClick={() => history.push({
                pathname: path,
                search: (path === 'transactions')
                ? '?search=&dates%5Bstart%5D=2018-01-06T02%3A00%3A00.000Z&dates%5Bend%5D=2018-03-08T02%3A59%3A59.999Z&offset=1'
                : '',
              })}
            />
          ))}
        </SidebarLinks>
      </Sidebar>
    )
  }
}

SidebarContainer.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
}

export default withRouter(SidebarContainer)
