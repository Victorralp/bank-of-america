import React, { useState } from 'react';
import useBankStore from '@/lib/bankStore';
import { FiX, FiCheck } from 'react-icons/fi';

interface OpenAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export const OpenAccountModal: React.FC<OpenAccountModalProps> = ({ isOpen, onClose, userId }) => {
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newAccount, setNewAccount] = useState<any>(null);
  
  const createAccount = useBankStore(state => state.createAccount);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const account = await createAccount(userId.toString(), accountType);
      setNewAccount(account);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setNewAccount(null);
      }, 3000);
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            color: '#666',
          }}
        >
          <FiX size={20} />
        </button>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#0bbd8c',
          marginBottom: '24px',
        }}>
          Open a New Account
        </h2>

        {success ? (
          <div style={{
            textAlign: 'center',
            padding: '20px 0',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#e7f9f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <FiCheck size={30} color="#0bbd8c" />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}>
              Account Created Successfully!
            </h3>
            <p style={{
              color: '#666',
              marginBottom: '16px',
            }}>
              Your new {accountType} account is ready to use.
            </p>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <p style={{
                fontSize: '14px',
                marginBottom: '4px',
              }}>
                Account Number: <strong>{newAccount?.accountNumber}</strong>
              </p>
              <p style={{
                fontSize: '14px',
              }}>
                Current Balance: <strong>$0.00</strong>
              </p>
              {accountType === 'savings' && (
                <p style={{
                  fontSize: '14px',
                  color: '#0bbd8c',
                }}>
                  Interest Rate: <strong>2.5% APY</strong>
                </p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}>
                Account Type
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                <div 
                  onClick={() => setAccountType('checking')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: `2px solid ${accountType === 'checking' ? '#0bbd8c' : '#eaeaea'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: accountType === 'checking' ? '#e7f9f4' : 'white',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: accountType === 'checking' ? '#0bbd8c' : '#333',
                  }}>
                    Checking
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#666',
                  }}>
                    For everyday transactions
                  </p>
                </div>
                <div 
                  onClick={() => setAccountType('savings')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: `2px solid ${accountType === 'savings' ? '#0bbd8c' : '#eaeaea'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: accountType === 'savings' ? '#e7f9f4' : 'white',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: accountType === 'savings' ? '#0bbd8c' : '#333',
                  }}>
                    Savings
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#666',
                  }}>
                    2.5% APY Interest Rate
                  </p>
                </div>
              </div>
            </div>

            {accountType === 'savings' && (
              <div style={{
                backgroundColor: '#e7f9f4',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#0bbd8c',
                  marginBottom: '8px',
                }}>
                  Savings Account Benefits
                </h4>
                <ul style={{
                  paddingLeft: '20px',
                  fontSize: '13px',
                  color: '#333',
                }}>
                  <li style={{ marginBottom: '4px' }}>Earn 2.5% APY on your balance</li>
                  <li style={{ marginBottom: '4px' }}>No minimum balance requirements</li>
                  <li style={{ marginBottom: '4px' }}>No monthly maintenance fees</li>
                  <li>Easy transfers between your accounts</li>
                </ul>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#0bbd8c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? 'Processing...' : `Open ${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}; 