import * as React from 'react'

export default function isLoggedIn () {
  const [isLoggedIn] = React.useState(true)

  // React.useEffect(() => {
  //   // Todo: Implement auth check.
  // }, [])

  return isLoggedIn
}
