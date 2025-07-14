import React from 'react';

interface ProgressBarProps {
  currentStep: 'cart' | 'address' | 'shipment' | 'complete';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { id: 'cart', name: 'My Cart' },
    { id: 'address', name: 'Delivery Address' },
    { id: 'shipment', name: 'Shipment & Payment' },
    { id: 'complete', name: 'Complete' },
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    const stepIndex = steps.findIndex(step => step.id === stepId);

    if (stepIndex < currentIndex) {
      return 'completed';
    } else if (stepIndex === currentIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${getStepStatus(step.id) === 'completed' ? 'bg-purple-600 text-white' : ''}
                ${getStepStatus(step.id) === 'current' ? 'bg-purple-500 text-white ring-2 ring-purple-300' : ''}
                ${getStepStatus(step.id) === 'upcoming' ? 'bg-gray-300 text-gray-600' : ''}
              `}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-center text-sm font-medium whitespace-nowrap
                ${getStepStatus(step.id) === 'completed' ? 'text-purple-700' : ''}
                ${getStepStatus(step.id) === 'current' ? 'text-purple-600' : ''}
                ${getStepStatus(step.id) === 'upcoming' ? 'text-gray-500' : ''}
              `}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 rounded-full
                ${getStepStatus(steps[index + 1].id) === 'completed' || getStepStatus(steps[index + 1].id) === 'current' ? 'bg-purple-400' : 'bg-gray-300'}
              `}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;
