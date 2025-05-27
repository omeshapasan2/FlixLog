import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const PreLoader = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '200px', height: '200px' }}>
        <DotLottieReact
          src="https://lottie.host/792b854a-0e23-48d5-b68a-900c7b19aaf8/AkxS7WaodM.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default PreLoader;