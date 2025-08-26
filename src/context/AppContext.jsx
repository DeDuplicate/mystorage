import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [units, setUnits] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Initialize with sample data
  useEffect(() => {
    // Sample customers
    const sampleCustomers = [
      { 
        id: 1, 
        name: 'John Doe', 
        phone: '(555) 123-4567', 
        email: 'john@example.com',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62701'
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        phone: '(555) 234-5678', 
        email: 'jane@example.com',
        address: '456 Oak Ave',
        city: 'Springfield',
        state: 'IL',
        zip: '62702'
      },
      { 
        id: 3, 
        name: 'Mike Johnson', 
        phone: '(555) 345-6789', 
        email: 'mike@example.com',
        address: '789 Pine St',
        city: 'Springfield',
        state: 'IL',
        zip: '62703'
      },
      { 
        id: 4, 
        name: 'Sarah Wilson', 
        phone: '(555) 456-7890', 
        email: 'sarah@example.com',
        address: '321 Elm St',
        city: 'Springfield',
        state: 'IL',
        zip: '62704'
      },
      { 
        id: 5, 
        name: 'Robert Brown', 
        phone: '(555) 567-8901', 
        email: 'robert@example.com',
        address: '654 Maple Ave',
        city: 'Springfield',
        state: 'IL',
        zip: '62705'
      }
    ];

    // Sample units with customer relationships
    const sampleUnits = [
      {
        id: 1,
        unit_number: 'A101',
        floor: 1,
        size: '5x5',
        monthly_rate: 50,
        status: 'occupied',
        customer_id: 1,
        customer_name: 'John Doe',
        customer_phone: '(555) 123-4567',
        customer_email: 'john@example.com',
        rental_start: '2024-01-15',
        rental_end: '2024-07-15',
        notes: 'Paid through June'
      },
      {
        id: 2,
        unit_number: 'A102',
        floor: 1,
        size: '5x10',
        monthly_rate: 75,
        status: 'available',
        customer_id: null,
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        rental_start: '',
        rental_end: '',
        notes: ''
      },
      {
        id: 3,
        unit_number: 'A103',
        floor: 1,
        size: '10x10',
        monthly_rate: 100,
        status: 'occupied',
        customer_id: 2,
        customer_name: 'Jane Smith',
        customer_phone: '(555) 234-5678',
        customer_email: 'jane@example.com',
        rental_start: '2024-02-01',
        rental_end: '2025-02-01',
        notes: 'Annual contract'
      },
      {
        id: 4,
        unit_number: 'B201',
        floor: 2,
        size: '10x15',
        monthly_rate: 150,
        status: 'available',
        customer_id: null,
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        rental_start: '',
        rental_end: '',
        notes: 'Climate controlled'
      },
      {
        id: 5,
        unit_number: 'B202',
        floor: 2,
        size: '5x5',
        monthly_rate: 55,
        status: 'maintenance',
        customer_id: null,
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        rental_start: '',
        rental_end: '',
        notes: 'Painting in progress'
      },
      {
        id: 6,
        unit_number: 'A104',
        floor: 1,
        size: '10x20',
        monthly_rate: 200,
        status: 'reserved',
        customer_id: 3,
        customer_name: 'Mike Johnson',
        customer_phone: '(555) 345-6789',
        customer_email: 'mike@example.com',
        rental_start: '2024-02-01',
        rental_end: '',
        notes: 'Moving in next week'
      }
    ];

    // Sample contracts with unit and customer relationships
    const sampleContracts = [
      {
        id: 1,
        customer_id: 1,
        customer_name: 'John Doe',
        customer_phone: '(555) 123-4567',
        unit_id: 1,
        contract_number: 'CNT-2024-001',
        unit_number: 'A-101',
        contract_type: 'rental',
        start_date: '2024-01-15',
        end_date: '2024-07-15',
        monthly_rate: 250,
        security_deposit: 250,
        status: 'active',
        terms: 'Standard rental agreement for storage unit A-101',
        notes: 'Customer paid security deposit upfront',
        auto_renew: true,
        files: [
          { id: 1, name: 'rental-agreement-signed.pdf', size: '2.3 MB', type: 'application/pdf', uploadDate: '2024-01-15' },
          { id: 2, name: 'insurance-certificate.pdf', size: '1.1 MB', type: 'application/pdf', uploadDate: '2024-01-15' }
        ],
        created_date: '2024-01-10',
        signed_date: '2024-01-15'
      },
      {
        id: 2,
        customer_id: 2,
        customer_name: 'Jane Smith',
        customer_phone: '(555) 234-5678',
        unit_id: 3,
        contract_number: 'CNT-2024-002',
        unit_number: 'A-103',
        contract_type: 'rental',
        start_date: '2024-02-01',
        end_date: '2024-08-01',
        monthly_rate: 300,
        security_deposit: 300,
        status: 'pending',
        terms: 'Standard rental agreement for storage unit A-103',
        notes: 'Waiting for signature',
        auto_renew: false,
        files: [
          { id: 3, name: 'draft-agreement.pdf', size: '2.1 MB', type: 'application/pdf', uploadDate: '2024-01-28' }
        ],
        created_date: '2024-01-28',
        signed_date: null
      }
    ];

    // Sample payments with unit and customer relationships
    const samplePayments = [
      {
        id: 'PAY-001',
        customer_id: 1,
        customer: 'John Doe',
        customerPhone: '(555) 123-4567',
        unit_id: 1,
        unit: 'A-101',
        contract_id: 1,
        amount: 250,
        status: 'paid',
        paymentDate: '2024-01-05',
        dueDate: '2024-01-01',
        rentalEnd: '2024-07-15',
        method: 'Credit Card',
        notes: 'Monthly rental payment'
      },
      {
        id: 'PAY-002',
        customer_id: 2,
        customer: 'Jane Smith',
        customerPhone: '(555) 234-5678',
        unit_id: 3,
        unit: 'A-103',
        contract_id: 2,
        amount: 300,
        status: 'pending',
        dueDate: '2024-01-15',
        rentalEnd: '2024-06-20',
        notes: 'Payment due soon'
      },
      {
        id: 'PAY-003',
        customer_id: 3,
        customer: 'Mike Johnson',
        customerPhone: '(555) 345-6789',
        unit_id: 6,
        unit: 'A-104',
        contract_id: null,
        amount: 450,
        status: 'overdue',
        dueDate: '2024-01-01',
        rentalEnd: '2024-03-15',
        daysOverdue: 15,
        notes: 'Multiple reminders sent'
      }
    ];

    setCustomers(sampleCustomers);
    setUnits(sampleUnits);
    setContracts(sampleContracts);
    setPayments(samplePayments);
  }, []);

  // Helper functions
  const getCustomerById = (id) => {
    return customers.find(customer => customer.id === id);
  };

  const getUnitById = (id) => {
    return units.find(unit => unit.id === id);
  };

  const getUnitByNumber = (unitNumber) => {
    return units.find(unit => unit.unit_number === unitNumber);
  };

  const getCustomerUnits = (customerId) => {
    return units.filter(unit => unit.customer_id === customerId);
  };

  const getAvailableUnits = () => {
    return units.filter(unit => unit.status === 'available');
  };

  const getCustomerContracts = (customerId) => {
    return contracts.filter(contract => contract.customer_id === customerId);
  };

  const getUnitContract = (unitId) => {
    return contracts.find(contract => contract.unit_id === unitId && contract.status === 'active');
  };

  const getCustomerPayments = (customerId) => {
    return payments.filter(payment => payment.customer_id === customerId);
  };

  const getUnitPayments = (unitId) => {
    return payments.filter(payment => payment.unit_id === unitId);
  };

  // Update functions
  const updateUnit = (unitId, updatedData) => {
    setUnits(prev => prev.map(unit => 
      unit.id === unitId ? { ...unit, ...updatedData } : unit
    ));
  };

  const updateCustomer = (customerId, updatedData) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, ...updatedData } : customer
    ));

    // Update related units
    setUnits(prev => prev.map(unit => 
      unit.customer_id === customerId 
        ? { 
            ...unit, 
            customer_name: updatedData.name || unit.customer_name,
            customer_phone: updatedData.phone || unit.customer_phone,
            customer_email: updatedData.email || unit.customer_email
          } 
        : unit
    ));

    // Update related contracts
    setContracts(prev => prev.map(contract => 
      contract.customer_id === customerId 
        ? { 
            ...contract, 
            customer_name: updatedData.name || contract.customer_name,
            customer_phone: updatedData.phone || contract.customer_phone
          } 
        : contract
    ));

    // Update related payments
    setPayments(prev => prev.map(payment => 
      payment.customer_id === customerId 
        ? { 
            ...payment, 
            customer: updatedData.name || payment.customer,
            customerPhone: updatedData.phone || payment.customerPhone
          } 
        : payment
    ));
  };

  const addUnit = (newUnit) => {
    const unitWithId = { ...newUnit, id: Date.now() };
    setUnits(prev => [...prev, unitWithId]);
    return unitWithId;
  };

  const addCustomer = (newCustomer) => {
    const customerWithId = { ...newCustomer, id: Date.now() };
    setCustomers(prev => [...prev, customerWithId]);
    return customerWithId;
  };

  const addContract = (newContract) => {
    const contractWithId = { ...newContract, id: Date.now() };
    setContracts(prev => [...prev, contractWithId]);
    
    // Update unit status if contract is active
    if (newContract.status === 'active' && newContract.unit_id) {
      updateUnit(newContract.unit_id, { 
        status: 'occupied',
        customer_id: newContract.customer_id,
        customer_name: newContract.customer_name,
        customer_phone: newContract.customer_phone,
        rental_start: newContract.start_date,
        rental_end: newContract.end_date
      });
    }
    
    return contractWithId;
  };

  const addPayment = (newPayment) => {
    const paymentWithId = { ...newPayment, id: Date.now() };
    setPayments(prev => [...prev, paymentWithId]);
    return paymentWithId;
  };

  const updatePayment = (paymentId, updatedData) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId ? { ...payment, ...updatedData } : payment
    ));
  };

  const addDocument = (newDocument) => {
    const documentWithId = { ...newDocument, id: newDocument.id || Date.now() };
    setDocuments(prev => [...prev, documentWithId]);
    return documentWithId;
  };

  const updateDocument = (documentId, updatedData) => {
    setDocuments(prev => prev.map(document => 
      document.id === documentId ? { ...document, ...updatedData } : document
    ));
  };

  const getCustomerDocuments = (customerId) => {
    return documents.filter(document => document.customer_id === customerId);
  };

  const getContractDocuments = (contractId) => {
    return documents.filter(document => document.contract_id === contractId);
  };

  const value = {
    // Data
    customers,
    units,
    contracts,
    payments,
    documents,
    
    // Setters
    setCustomers,
    setUnits,
    setContracts,
    setPayments,
    setDocuments,
    
    // Helper functions
    getCustomerById,
    getUnitById,
    getUnitByNumber,
    getCustomerUnits,
    getAvailableUnits,
    getCustomerContracts,
    getUnitContract,
    getCustomerPayments,
    getUnitPayments,
    getCustomerDocuments,
    getContractDocuments,
    
    // Update functions
    updateUnit,
    updateCustomer,
    addUnit,
    addCustomer,
    addContract,
    addPayment,
    updatePayment,
    addDocument,
    updateDocument
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;