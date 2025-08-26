import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit2,
  Trash2,
  Search,
  Filter,
  Plus,
  X,
  Save,
  User,
  Calendar,
  Folder,
  FolderOpen,
  Paperclip,
  ExternalLink,
  Image,
  File,
  FileSpreadsheet,
  FileCode,
  Archive,
  Share2,
  Lock,
  Unlock,
  History,
  Tag
} from 'lucide-react';

const Documents = () => {
  const {
    customers,
    contracts,
    getCustomerById,
    addDocument,
    updateDocument,
    documents = [],
    setDocuments
  } = useAppContext();

  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContract, setSelectedContract] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'contract',
    customer_id: '',
    contract_id: '',
    tags: '',
    access_level: 'private',
    version: '1.0'
  });

  // Document categories
  const documentCategories = {
    contract: { label: 'Contracts', color: 'blue', icon: FileText },
    insurance: { label: 'Insurance', color: 'green', icon: File },
    identification: { label: 'ID Documents', color: 'purple', icon: User },
    payment: { label: 'Payments', color: 'yellow', icon: FileSpreadsheet },
    invoice: { label: 'Invoices', color: 'orange', icon: FileText },
    correspondence: { label: 'Correspondence', color: 'pink', icon: FileCode },
    legal: { label: 'Legal Documents', color: 'red', icon: Archive },
    other: { label: 'Other', color: 'gray', icon: Folder }
  };

  // Initialize with sample documents
  useEffect(() => {
    const sampleDocuments = [
      {
        id: 'DOC-001',
        name: 'Rental Agreement - John Doe',
        description: 'Signed rental agreement for unit A-101',
        file_name: 'rental-agreement-john-doe.pdf',
        file_size: '2.3 MB',
        file_type: 'application/pdf',
        category: 'contract',
        customer_id: 1,
        customer_name: 'John Doe',
        contract_id: 1,
        contract_number: 'CNT-2024-001',
        tags: 'rental, signed, active',
        access_level: 'private',
        version: '1.0',
        upload_date: '2024-01-15',
        uploaded_by: 'Admin',
        last_accessed: '2024-01-20',
        download_count: 3,
        is_signed: true,
        expiry_date: '2024-07-15'
      },
      {
        id: 'DOC-002',
        name: 'Insurance Certificate - Jane Smith',
        description: 'Current insurance certificate for unit A-103',
        file_name: 'insurance-jane-smith.pdf',
        file_size: '1.1 MB',
        file_type: 'application/pdf',
        category: 'insurance',
        customer_id: 2,
        customer_name: 'Jane Smith',
        contract_id: 2,
        contract_number: 'CNT-2024-002',
        tags: 'insurance, certificate, current',
        access_level: 'private',
        version: '2.0',
        upload_date: '2024-01-28',
        uploaded_by: 'Admin',
        last_accessed: '2024-02-01',
        download_count: 1,
        is_signed: false,
        expiry_date: '2025-01-28'
      },
      {
        id: 'DOC-003',
        name: 'Driver License - Mike Johnson',
        description: 'Copy of driver license for verification',
        file_name: 'license-mike-johnson.jpg',
        file_size: '850 KB',
        file_type: 'image/jpeg',
        category: 'identification',
        customer_id: 3,
        customer_name: 'Mike Johnson',
        contract_id: null,
        contract_number: null,
        tags: 'id, verification, license',
        access_level: 'restricted',
        version: '1.0',
        upload_date: '2024-01-10',
        uploaded_by: 'Admin',
        last_accessed: '2024-01-15',
        download_count: 2,
        is_signed: false,
        expiry_date: '2026-08-15'
      },
      {
        id: 'DOC-004',
        name: 'Payment Receipt - January 2024',
        description: 'Payment receipt for monthly rental',
        file_name: 'receipt-jan-2024.pdf',
        file_size: '420 KB',
        file_type: 'application/pdf',
        category: 'payment',
        customer_id: 1,
        customer_name: 'John Doe',
        contract_id: 1,
        contract_number: 'CNT-2024-001',
        tags: 'payment, receipt, january',
        access_level: 'shared',
        version: '1.0',
        upload_date: '2024-01-05',
        uploaded_by: 'System',
        last_accessed: '2024-01-06',
        download_count: 0,
        is_signed: false,
        expiry_date: null
      }
    ];

    if (documents.length === 0) {
      setDocuments(sampleDocuments);
      setFilteredDocuments(sampleDocuments);
    } else {
      setFilteredDocuments(documents);
    }
  }, [documents, setDocuments]);

  // Filter documents
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCustomer !== 'all') {
      filtered = filtered.filter(doc => doc.customer_id === parseInt(selectedCustomer));
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    if (selectedContract !== 'all') {
      filtered = filtered.filter(doc => doc.contract_id === parseInt(selectedContract));
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, selectedCustomer, selectedCategory, selectedContract, documents]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill customer name when customer is selected
    if (name === 'customer_id' && value) {
      const customer = getCustomerById(parseInt(value));
      if (customer) {
        const customerContracts = contracts.filter(c => c.customer_id === parseInt(value));
        setFormData(prev => ({
          ...prev,
          customer_name: customer.name
        }));
      }
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      file: file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setSelectedFiles(fileData);
  };

  // Upload documents
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const customer = getCustomerById(parseInt(formData.customer_id));
    const contract = contracts.find(c => c.id === parseInt(formData.contract_id));
    
    selectedFiles.forEach((fileData, index) => {
      const newDocument = {
        id: `DOC-${String(documents.length + index + 1).padStart(3, '0')}`,
        name: formData.name || fileData.name.replace(/\.[^/.]+$/, ''),
        description: formData.description,
        file_name: fileData.name,
        file_size: fileData.size,
        file_type: fileData.type,
        category: formData.category,
        customer_id: parseInt(formData.customer_id),
        customer_name: customer?.name || '',
        contract_id: formData.contract_id ? parseInt(formData.contract_id) : null,
        contract_number: contract?.contract_number || null,
        tags: formData.tags,
        access_level: formData.access_level,
        version: formData.version,
        upload_date: new Date().toISOString().split('T')[0],
        uploaded_by: 'Admin',
        last_accessed: null,
        download_count: 0,
        is_signed: false,
        expiry_date: null,
        file_url: URL.createObjectURL(fileData.file) // For demo purposes
      };
      
      if (editingDocument) {
        updateDocument(editingDocument.id, newDocument);
      } else {
        addDocument(newDocument);
      }
    });

    // Reset form
    setShowUploadModal(false);
    setEditingDocument(null);
    setSelectedFiles([]);
    setFormData({
      name: '',
      description: '',
      category: 'contract',
      customer_id: '',
      contract_id: '',
      tags: '',
      access_level: 'private',
      version: '1.0'
    });
  };

  // Edit document
  const handleEdit = (document) => {
    setEditingDocument(document);
    setFormData({
      name: document.name,
      description: document.description,
      category: document.category,
      customer_id: document.customer_id?.toString() || '',
      contract_id: document.contract_id?.toString() || '',
      tags: document.tags,
      access_level: document.access_level,
      version: document.version
    });
    setShowUploadModal(true);
  };

  // Delete document
  const handleDelete = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  // Download document
  const handleDownload = (document) => {
    // In a real app, this would download the actual file
    console.log('Downloading:', document.file_name);
    // Update download count
    const updatedDoc = { ...document, download_count: document.download_count + 1 };
    updateDocument(document.id, updatedDoc);
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType === 'application/pdf') return FileText;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileSpreadsheet;
    if (fileType.includes('document') || fileType.includes('word')) return FileText;
    return File;
  };

  // Calculate statistics
  const stats = {
    total: documents.length,
    contracts: documents.filter(d => d.category === 'contract').length,
    insurance: documents.filter(d => d.category === 'insurance').length,
    identification: documents.filter(d => d.category === 'identification').length,
    payments: documents.filter(d => d.category === 'payment').length,
    totalSize: documents.reduce((sum, doc) => {
      const size = parseFloat(doc.file_size.replace(/[^\d.]/g, ''));
      return sum + (isNaN(size) ? 0 : size);
    }, 0).toFixed(2) + ' MB',
    recentUploads: documents.filter(doc => {
      const uploadDate = new Date(doc.upload_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate >= weekAgo;
    }).length
  };

  // Get available contracts for selected customer
  const getCustomerContracts = (customerId) => {
    return contracts.filter(c => c.customer_id === parseInt(customerId));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Documents</h1>
        <p className="text-gray-600">Manage customer documents, contracts, and files</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="text-center">
          <Folder className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-600">Total Documents</p>
        </Card>

        <Card className="text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{stats.contracts}</p>
          <p className="text-xs text-gray-600">Contracts</p>
        </Card>

        <Card className="text-center">
          <File className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">{stats.insurance}</p>
          <p className="text-xs text-gray-600">Insurance</p>
        </Card>

        <Card className="text-center">
          <User className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold">{stats.identification}</p>
          <p className="text-xs text-gray-600">ID Documents</p>
        </Card>

        <Card className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold">{stats.recentUploads}</p>
          <p className="text-xs text-gray-600">Recent Uploads</p>
        </Card>

        <Card className="text-center">
          <Archive className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <p className="text-2xl font-bold">{stats.totalSize}</p>
          <p className="text-xs text-gray-600">Total Size</p>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Customer Filter */}
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Customers</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(documentCategories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Contract Filter */}
          <select
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Contracts</option>
            {contracts.map(contract => (
              <option key={contract.id} value={contract.id}>
                {contract.contract_number} - {contract.customer_name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Folder className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Button */}
        <Button
          variant="gradient"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map(document => {
            const FileIconComponent = getFileIcon(document.file_type);
            const categoryInfo = documentCategories[document.category];
            
            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-xl transition-shadow relative">
                  {/* Access Level Badge */}
                  <div className="absolute top-3 right-3">
                    {document.access_level === 'private' && (
                      <Lock className="w-4 h-4 text-red-500" title="Private" />
                    )}
                    {document.access_level === 'shared' && (
                      <Share2 className="w-4 h-4 text-blue-500" title="Shared" />
                    )}
                    {document.access_level === 'restricted' && (
                      <Unlock className="w-4 h-4 text-yellow-500" title="Restricted" />
                    )}
                  </div>

                  <div className="p-4">
                    {/* File Icon and Category */}
                    <div className="flex items-center mb-3">
                      <FileIconComponent className="w-8 h-8 text-gray-600 mr-3" />
                      <Badge variant={categoryInfo.color}>
                        {categoryInfo.label}
                      </Badge>
                    </div>

                    {/* Document Info */}
                    <h3 className="font-bold text-sm mb-2 line-clamp-2">{document.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{document.description}</p>
                    
                    {/* Customer & Contract */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700">{document.customer_name}</p>
                      {document.contract_number && (
                        <p className="text-xs text-gray-500">{document.contract_number}</p>
                      )}
                    </div>

                    {/* File Details */}
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                      <span>{document.file_size}</span>
                      <span>v{document.version}</span>
                    </div>

                    {/* Tags */}
                    {document.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.split(',').slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Upload Info */}
                    <div className="text-xs text-gray-500 mb-4">
                      <p>Uploaded: {new Date(document.upload_date).toLocaleDateString()}</p>
                      <p>Downloads: {document.download_count}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(document)}
                        className="flex-1 p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-xs"
                        title="Download"
                      >
                        <Download className="w-4 h-4 inline mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => handleEdit(document)}
                        className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4">Document</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Contract</th>
                    <th className="text-left py-3 px-4">Size</th>
                    <th className="text-left py-3 px-4">Upload Date</th>
                    <th className="text-left py-3 px-4">Access</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map(document => {
                    const FileIconComponent = getFileIcon(document.file_type);
                    const categoryInfo = documentCategories[document.category];
                    
                    return (
                      <tr key={document.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileIconComponent className="w-5 h-5 text-gray-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium">{document.name}</p>
                              <p className="text-xs text-gray-500">{document.file_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={categoryInfo.color}>
                            {categoryInfo.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{document.customer_name}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{document.contract_number || '-'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{document.file_size}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{new Date(document.upload_date).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {document.access_level === 'private' && (
                              <Lock className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            {document.access_level === 'shared' && (
                              <Share2 className="w-4 h-4 text-blue-500 mr-1" />
                            )}
                            {document.access_level === 'restricted' && (
                              <Unlock className="w-4 h-4 text-yellow-500 mr-1" />
                            )}
                            <span className="text-xs capitalize">{document.access_level}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleDownload(document)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(document)}
                              className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(document.id)}
                              className="p-1.5 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingDocument ? 'Edit Document' : 'Upload Documents'}
                </h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setEditingDocument(null);
                    setSelectedFiles([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Document Info */}
                  <div>
                    <h3 className="font-semibold mb-4">Document Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter document name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Enter document description"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {Object.entries(documentCategories).map(([key, category]) => (
                            <option key={key} value={key}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Customer *
                        </label>
                        <select
                          name="customer_id"
                          value={formData.customer_id}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select Customer</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} - {customer.phone}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contract (Optional)
                        </label>
                        <select
                          name="contract_id"
                          value={formData.contract_id}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">No Contract</option>
                          {formData.customer_id && getCustomerContracts(formData.customer_id).map(contract => (
                            <option key={contract.id} value={contract.id}>
                              {contract.contract_number} - {contract.unit_number}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          placeholder="Enter tags separated by commas"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Access Level
                          </label>
                          <select
                            name="access_level"
                            value={formData.access_level}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="private">Private</option>
                            <option value="shared">Shared</option>
                            <option value="restricted">Restricted</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Version
                          </label>
                          <input
                            type="text"
                            name="version"
                            value={formData.version}
                            onChange={handleInputChange}
                            placeholder="1.0"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - File Upload */}
                  <div>
                    <h3 className="font-semibold mb-4">File Upload</h3>
                    
                    {/* File Upload Area */}
                    <div className="mb-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drop files here or click to upload
                        </p>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg,.xls,.xlsx"
                          className="hidden"
                          id="document-upload"
                        />
                        <label
                          htmlFor="document-upload"
                          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer transition-colors"
                        >
                          Choose Files
                        </label>
                        <p className="text-sm text-gray-500 mt-3">
                          Supported: PDF, DOC, DOCX, TXT, JPG, PNG, XLS, XLSX
                          <br />
                          Maximum size: 10MB per file
                        </p>
                      </div>

                      {/* Selected Files Preview */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="font-medium text-gray-700">Selected Files:</h4>
                          {selectedFiles.map((file, index) => {
                            const FileIconComponent = getFileIcon(file.type);
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <FileIconComponent className="w-6 h-6 text-primary-500" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                                  className="p-1 text-danger-500 hover:bg-danger-50 rounded"
                                  title="Remove"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Upload Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Upload Guidelines:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Ensure documents are clearly readable</li>
                        <li>• Use descriptive filenames</li>
                        <li>• Select appropriate category and customer</li>
                        <li>• Add relevant tags for easier searching</li>
                        <li>• Check access level permissions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowUploadModal(false);
                      setEditingDocument(null);
                      setSelectedFiles([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="gradient"
                    disabled={!editingDocument && selectedFiles.length === 0}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingDocument ? 'Update Document' : 'Upload Documents'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;