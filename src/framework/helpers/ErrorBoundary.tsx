import React from "react";

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    //TODO: Send data back to the server to be logged
    //logErrorToMyService(error, info);
    console.error(error);
    console.info(info);
  }

  render() {
    if (this.state.hasError) {
      //TODO: show a card with more data
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
