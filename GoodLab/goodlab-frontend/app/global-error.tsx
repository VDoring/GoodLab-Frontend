"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#fee',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '64px', marginBottom: '16px', color: '#c00' }}>500</h1>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
            심각한 오류가 발생했습니다
          </h2>
          <p style={{ marginBottom: '24px', color: '#666' }}>
            페이지를 새로고침하거나 나중에 다시 시도해주세요.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#c00',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
          {error.digest && (
            <p style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
              오류 ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
