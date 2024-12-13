import { Redirect, Route, RouteProps } from 'react-router'
import { Component } from 'react'

interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute = ({ component, ...rest }: ProtectedRouteProps) => {
  return (
    <Route
      {...rest}
      render={props =>
        false ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

export default ProtectedRoute
