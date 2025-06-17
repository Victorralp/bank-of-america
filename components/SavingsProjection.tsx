import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

interface SavingsProjectionProps {
  balance: number;
  interestRate: number;
}

export const SavingsProjection: React.FC<SavingsProjectionProps> = ({ balance, interestRate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateInterest = (principal: number, rate: number, years: number) => {
    // Simple compound interest formula: A = P(1 + r/n)^(nt)
    // Where A = final amount, P = principal, r = interest rate, n = compounding frequency, t = time
    const compoundingFrequency = 12; // monthly compounding
    const rateDecimal = rate / 100;
    return principal * Math.pow(1 + rateDecimal / compoundingFrequency, compoundingFrequency * years);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate projected balances
  const oneYearProjection = calculateInterest(balance, interestRate, 1);
  const threeYearProjection = calculateInterest(balance, interestRate, 3);
  const fiveYearProjection = calculateInterest(balance, interestRate, 5);

  // Calculate interest earned
  const oneYearInterest = oneYearProjection - balance;
  const threeYearInterest = threeYearProjection - balance;
  const fiveYearInterest = fiveYearProjection - balance;

  return (
    <div style={{
      marginTop: '15px',
      borderTop: '1px solid #f0f0f0',
      paddingTop: '15px',
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '8px 0',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          color: '#0bbd8c',
          fontWeight: '500',
          fontSize: '14px',
        }}>
          <FiInfo style={{ marginRight: '8px' }} />
          Projected Interest Earnings
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>
          ▼
        </div>
      </div>

      {isExpanded && (
        <div style={{
          marginTop: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '15px',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '12px',
          }}>
            Based on your current balance of {formatCurrency(balance)} with {interestRate}% APY:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '15px',
          }}>
            <div style={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #eaeaea',
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>1 Year</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0bbd8c' }}>
                {formatCurrency(oneYearInterest)}
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #eaeaea',
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>3 Years</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0bbd8c' }}>
                {formatCurrency(threeYearInterest)}
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #eaeaea',
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>5 Years</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0bbd8c' }}>
                {formatCurrency(fiveYearInterest)}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '12px',
            color: '#666',
            fontStyle: 'italic',
          }}>
            * Projections assume no additional deposits or withdrawals. Actual results may vary.
          </div>
        </div>
      )}
    </div>
  );
}; 