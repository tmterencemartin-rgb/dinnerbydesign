import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { safeStorage } from '../lib/storage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    safeStorage.removeItem('dbd_has_started');
    safeStorage.session.removeItem('dbd_temporary_preferences');
    window.location.href = '/';
  };

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      let errorMessage = "Something went wrong.";
      try {
        // Attempt to extract JSON from the error message. 
        // Firestore errors often come wrapped in a string or as a raw JSON string.
        const jsonMatch = error?.message?.match(/\{.*\}/);
        const jsonToParse = jsonMatch ? jsonMatch[0] : "";
        
        if (jsonToParse) {
          const parsedError = JSON.parse(jsonToParse);
          if (parsedError.error) {
            errorMessage = `Service Error: ${parsedError.error}\nOperation: ${parsedError.operationType}\nPath: ${parsedError.path}`;
          } else if (parsedError.message) {
            errorMessage = parsedError.message;
          }
        } else {
          errorMessage = error?.message || errorMessage;
        }
      } catch (e) {
        // If parsing fails, use the raw message
        errorMessage = error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm font-medium hover:text-gray-900 py-2 transition-colors underline decoration-gray-200 underline-offset-4"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset & Clear State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
