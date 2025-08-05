import React from 'react';

interface ProgressBarProps {
  currentStep: 'cart' | 'address' | 'shipment' | 'complete';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { id: 'cart', name: 'Shopping Cart' },
    { id: 'address', name: 'Address' },
    { id: 'shipment', name: 'Shipping & Payment Options' },
    { id: 'complete', name: 'Complete' },
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    const stepIndex = steps.findIndex(step => step.id === stepId);

    if (stepIndex === currentIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className="w-full bg-white py-6 px-4 mb-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            return (
              <div key={step.id} className="flex items-center flex-1 relative">
                <div className="flex items-center">
                  {/* Step Number Circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm z-10 relative
                      ${status === 'current' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Step Name */}
                  <span
                    className={`
                      ml-3 text-sm font-medium whitespace-nowrap
                      ${status === 'current' ? 'text-gray-900' : 'text-gray-500'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-3">
                    <div className="h-0.5 w-full border-t-2 border-dotted border-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
