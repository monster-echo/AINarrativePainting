import { Redirect, Route, RouteProps, useLocation } from 'react-router'
import { useAuthStore } from '../../stores/authStore'

interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute = ({ component, ...rest }: ProtectedRouteProps) => {
  const { session } = useAuthStore()
  const returnUrl = useLocation().pathname

  return (
    <Route
      {...rest}
      render={props =>
        session ? (
          <Route {...rest} component={component} />
        ) : (
          <Redirect
            to={{
              pathname: '/login?returnUrl=' + returnUrl,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

export default ProtectedRoute
