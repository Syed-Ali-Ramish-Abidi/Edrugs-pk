import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          backgroundColor: '#ffebeb',
          color: '#d32f2f',
          minHeight: '100vh',
          fontFamily: 'monospace'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>Something went wrong.</h1>
          
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Error Message:</h2>
            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', border: '1px solid #ffcdd2', whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Component Stack:</h2>
            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', border: '1px solid #ffcdd2', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </div>
          
          {this.state.error && this.state.error.stack && (
            <div style={{ marginTop: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Error Stack:</h2>
              <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', border: '1px solid #ffcdd2', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                {this.state.error.stack}
              </div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
