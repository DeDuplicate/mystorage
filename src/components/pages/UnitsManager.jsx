import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Grid3x3,
  Layers,
  MapPin,
  Package,
  DollarSign,
  Ruler,
  Info,
  Check,
  AlertCircle,
  Square,
  Move,
  Copy,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Settings,
  Palette,
  Home
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const UnitsManager = () => {
  const [units, setUnits] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [viewMode, setViewMode] = useState('map'); // map, grid, list
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [gridSize, setGridSize] = useState({ rows: 20, cols: 40 }); // More realistic facility size
  const [zoom, setZoom] = useState(0.8); // Start zoomed out for overview
  const mapContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedUnit, setDraggedUnit] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });
  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showAisles, setShowAisles] = useState(true);

  // Unit form data
  const [formData, setFormData] = useState({
    unit_number: '',
    size_type: 'small', // small, medium, large, xl
    width: 2,
    height: 2,
    realWidth: 5,
    realHeight: 5,
    floor: 1,
    monthly_rate: '',
    status: 'available',
    features: [],
    notes: '',
    position: { x: 0, y: 0 },
    color: '#10b981', // default green for available
    locked: false
  });

  // Realistic unit sizes (in grid units, 1 grid = 2.5 feet for proper scale)
  const unitSizes = {
    small: { width: 2, height: 2, label: 'Small (5x5)', realWidth: 5, realHeight: 5, defaultRate: 50 },
    medium: { width: 2, height: 4, label: 'Medium (5x10)', realWidth: 5, realHeight: 10, defaultRate: 75 },
    large: { width: 4, height: 4, label: 'Large (10x10)', realWidth: 10, realHeight: 10, defaultRate: 100 },
    xl: { width: 4, height: 6, label: 'XL (10x15)', realWidth: 10, realHeight: 15, defaultRate: 150 },
    xxl: { width: 4, height: 8, label: 'XXL (10x20)', realWidth: 10, realHeight: 20, defaultRate: 200 },
    custom: { width: 0, height: 0, label: 'Custom Size', realWidth: 0, realHeight: 0, defaultRate: 0 }
  };

  // Facility layout configuration
  const facilityLayout = {
    aisleWidth: 3, // Grid units for aisle width (7.5 feet)
    mainAisleWidth: 4, // Grid units for main aisle (10 feet)
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    sectionsPerRow: 4,
    entrances: [
      { x: 0, y: 10, width: 2, height: 3, type: 'main' },
      { x: 38, y: 10, width: 2, height: 3, type: 'secondary' }
    ],
    elevators: [
      { x: 19, y: 0, width: 2, height: 2, floor: 'all' }
    ],
    stairs: [
      { x: 5, y: 0, width: 1, height: 2 },
      { x: 34, y: 0, width: 1, height: 2 }
    ]
  };

  // Status colors with better visibility
  const statusColors = {
    available: '#10b981',
    occupied: '#3b82f6',
    maintenance: '#f59e0b',
    reserved: '#8b5cf6'
  };

  // Unit style configurations
  const unitStyles = {
    available: {
      fill: '#e6f7f1',
      stroke: '#10b981',
      strokeWidth: 2,
      opacity: 0.9
    },
    occupied: {
      fill: '#e6f2ff',
      stroke: '#3b82f6',
      strokeWidth: 2,
      opacity: 0.95
    },
    maintenance: {
      fill: '#fef3e2',
      stroke: '#f59e0b',
      strokeWidth: 2,
      opacity: 0.9,
      pattern: 'stripes'
    },
    reserved: {
      fill: '#f3e8ff',
      stroke: '#8b5cf6',
      strokeWidth: 2,
      opacity: 0.9,
      pattern: 'dots'
    }
  };

  // Generate realistic facility layout with units
  useEffect(() => {
    const generateUnits = () => {
      const generatedUnits = [];
      let unitId = 1;
      
      // Floor 1 - Ground floor with drive-up access
      const floor1Config = [
        // Row A - Left section with small and medium units
        { row: 'A', startX: 2, startY: 2, count: 8, sizeType: 'small', spacing: 0.2 },
        { row: 'A', startX: 2, startY: 7, count: 6, sizeType: 'medium', spacing: 0.2 },
        
        // Row B - Large units
        { row: 'B', startX: 7, startY: 2, count: 4, sizeType: 'large', spacing: 0.2 },
        { row: 'B', startX: 7, startY: 7, count: 3, sizeType: 'xl', spacing: 0.2 },
        
        // Row C - Mixed sizes
        { row: 'C', startX: 14, startY: 2, count: 6, sizeType: 'medium', spacing: 0.2 },
        { row: 'C', startX: 14, startY: 7, count: 2, sizeType: 'xxl', spacing: 0.2 },
        
        // Row D - Right section
        { row: 'D', startX: 22, startY: 2, count: 8, sizeType: 'small', spacing: 0.2 },
        { row: 'D', startX: 27, startY: 2, count: 4, sizeType: 'large', spacing: 0.2 },
      ];
      
      // Floor 2 - Upper floor with elevator access
      const floor2Config = [
        // Row E - Climate controlled section
        { row: 'E', startX: 2, startY: 2, count: 6, sizeType: 'medium', spacing: 0.2, floor: 2 },
        { row: 'E', startX: 2, startY: 7, count: 4, sizeType: 'large', spacing: 0.2, floor: 2 },
        
        // Row F - Premium units
        { row: 'F', startX: 10, startY: 2, count: 3, sizeType: 'xl', spacing: 0.2, floor: 2 },
        { row: 'F', startX: 10, startY: 9, count: 2, sizeType: 'xxl', spacing: 0.2, floor: 2 },
        
        // Row G - Standard units
        { row: 'G', startX: 20, startY: 2, count: 10, sizeType: 'small', spacing: 0.2, floor: 2 },
        
        // Row H - Mixed section
        { row: 'H', startX: 26, startY: 2, count: 5, sizeType: 'medium', spacing: 0.2, floor: 2 },
        { row: 'H', startX: 32, startY: 2, count: 3, sizeType: 'large', spacing: 0.2, floor: 2 },
      ];
      
      const createUnitsFromConfig = (config, floor = 1) => {
        config.forEach(section => {
          let xOffset = 0;
          for (let i = 0; i < section.count; i++) {
            const size = unitSizes[section.sizeType];
            const unitNumber = `${section.row}${floor}${String(i + 1).padStart(2, '0')}`;
            const status = Math.random() > 0.7 ? 'occupied' : 
                          Math.random() > 0.9 ? 'maintenance' : 
                          Math.random() > 0.95 ? 'reserved' : 'available';
            
            generatedUnits.push({
              id: unitId++,
              unit_number: unitNumber,
              size_type: section.sizeType,
              width: size.width,
              height: size.height,
              realWidth: size.realWidth,
              realHeight: size.realHeight,
              floor: section.floor || floor,
              monthly_rate: size.defaultRate + Math.floor(Math.random() * 20),
              status,
              position: { 
                x: section.startX + xOffset, 
                y: section.sizeType === 'medium' || section.sizeType === 'xl' || section.sizeType === 'xxl' 
                   ? section.startY 
                   : section.startY + (i % 2) * (size.height + 0.5)
              },
              color: statusColors[status],
              customer_name: status === 'occupied' ? `Customer ${unitId}` : null,
              features: [
                ...(section.floor === 2 ? ['Elevator Access'] : ['Drive-up Access']),
                ...(Math.random() > 0.5 ? ['Climate Control'] : []),
                ...(Math.random() > 0.7 ? ['24/7 Access'] : [])
              ],
              locked: false,
              row: section.row
            });
            
            xOffset += size.width + section.spacing;
          }
        });
      };
      
      createUnitsFromConfig(floor1Config, 1);
      createUnitsFromConfig(floor2Config, 2);
      
      return generatedUnits;
    };
    
    setUnits(generateUnits());
  }, []);

  // Handle unit drag with collision detection
  const handleUnitDragStart = (unit) => {
    if (!isEditMode || unit.locked) return;
    setIsDragging(true);
    setDraggedUnit(unit);
  };

  const handleUnitDragEnd = (e) => {
    if (!isDragging || !draggedUnit) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const cellSize = 20 * zoom; // Smaller cell size for more precise placement
    const x = (e.clientX - rect.left) / cellSize;
    const y = (e.clientY - rect.top) / cellSize;
    
    const newX = snapToGrid ? Math.round(x * 2) / 2 : x; // Snap to half-grid for smoother placement
    const newY = snapToGrid ? Math.round(y * 2) / 2 : y;
    
    // Check for collisions
    const wouldCollide = units.some(u => {
      if (u.id === draggedUnit.id || u.floor !== draggedUnit.floor) return false;
      
      const x1 = newX;
      const y1 = newY;
      const x2 = newX + draggedUnit.width;
      const y2 = newY + draggedUnit.height;
      
      const ux1 = u.position.x;
      const uy1 = u.position.y;
      const ux2 = u.position.x + u.width;
      const uy2 = u.position.y + u.height;
      
      return !(x2 <= ux1 || x1 >= ux2 || y2 <= uy1 || y1 >= uy2);
    });
    
    if (!wouldCollide) {
      setUnits(prev => prev.map(u => 
        u.id === draggedUnit.id 
          ? { ...u, position: { x: newX, y: newY } }
          : u
      ));
    }
    
    setIsDragging(false);
    setDraggedUnit(null);
  };

  // Calculate viewport for minimap
  const calculateViewport = () => {
    if (!mapContainerRef.current) return { x: 0, y: 0, width: 100, height: 100 };
    
    const container = mapContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    const viewWidth = container.clientWidth;
    const viewHeight = container.clientHeight;
    const cellSize = 20 * zoom;
    
    return {
      x: scrollLeft / cellSize,
      y: scrollTop / cellSize,
      width: viewWidth / cellSize,
      height: viewHeight / cellSize
    };
  };

  // Add new unit
  const handleAddUnit = () => {
    const newUnit = {
      ...formData,
      id: Date.now(),
      color: statusColors[formData.status],
      realWidth: formData.realWidth || unitSizes[formData.size_type]?.realWidth || formData.width * 2.5,
      realHeight: formData.realHeight || unitSizes[formData.size_type]?.realHeight || formData.height * 2.5
    };
    setUnits(prev => [...prev, newUnit]);
    setIsAddingUnit(false);
    resetForm();
  };

  // Update unit
  const handleUpdateUnit = () => {
    setUnits(prev => prev.map(u => 
      u.id === selectedUnit.id 
        ? { 
            ...selectedUnit, 
            ...formData, 
            color: statusColors[formData.status],
            realWidth: formData.realWidth || unitSizes[formData.size_type]?.realWidth || formData.width * 2.5,
            realHeight: formData.realHeight || unitSizes[formData.size_type]?.realHeight || formData.height * 2.5
          }
        : u
    ));
    setSelectedUnit(null);
    resetForm();
  };

  // Delete unit
  const handleDeleteUnit = (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      setUnits(prev => prev.filter(u => u.id !== unitId));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      unit_number: '',
      size_type: 'small',
      width: 2,
      height: 2,
      realWidth: 5,
      realHeight: 5,
      floor: 1,
      monthly_rate: '',
      status: 'available',
      features: [],
      notes: '',
      position: { x: 0, y: 0 },
      color: '#10b981',
      locked: false
    });
  };

  // Handle size type change
  const handleSizeTypeChange = (type) => {
    const size = unitSizes[type];
    setFormData(prev => ({
      ...prev,
      size_type: type,
      width: size.width || prev.width,
      height: size.height || prev.height,
      realWidth: size.realWidth || prev.realWidth,
      realHeight: size.realHeight || prev.realHeight,
      monthly_rate: size.defaultRate || prev.monthly_rate
    }));
  };

  // Export floor plan
  const exportFloorPlan = () => {
    const data = {
      floors: [1, 2],
      gridSize,
      units: units
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `floor-plan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Import floor plan
  const importFloorPlan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setUnits(data.units || []);
        setGridSize(data.gridSize || { rows: 10, cols: 15 });
      } catch (error) {
        alert('Invalid floor plan file');
      }
    };
    reader.readAsText(file);
  };

  // Render professional floor map
  const renderFloorMap = () => {
    const cellSize = 20 * zoom; // Smaller cells for more detail
    const floorUnits = units.filter(u => u.floor === selectedFloor);
    const mapWidth = gridSize.cols * cellSize;
    const mapHeight = gridSize.rows * cellSize;

    return (
      <div className="relative">
        {/* Controls Bar */}
        <div className="mb-4 bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
                  className="p-2 hover:bg-white rounded-md transition-all duration-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-3 text-sm font-medium text-gray-700 min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                  className="p-2 hover:bg-white rounded-md transition-all duration-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <button
                onClick={() => setZoom(0.8)}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Reset Zoom
              </button>
            </div>

            {/* View Options */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  showGrid 
                    ? 'bg-primary-100 text-primary-600 shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle Grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowAisles(!showAisles)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  showAisles 
                    ? 'bg-primary-100 text-primary-600 shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle Aisles"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h18v18H3zM12 3v18M3 12h18" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  showLabels 
                    ? 'bg-primary-100 text-primary-600 shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle Labels"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </button>
              
              <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  snapToGrid 
                    ? 'bg-primary-100 text-primary-600 shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Snap to Grid"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="2" cy="2" r="1.5" />
                  <circle cx="8" cy="2" r="1.5" />
                  <circle cx="14" cy="2" r="1.5" />
                  <circle cx="2" cy="8" r="1.5" />
                  <circle cx="8" cy="8" r="1.5" />
                  <circle cx="14" cy="8" r="1.5" />
                  <circle cx="2" cy="14" r="1.5" />
                  <circle cx="8" cy="14" r="1.5" />
                  <circle cx="14" cy="14" r="1.5" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowMinimap(!showMinimap)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  showMinimap 
                    ? 'bg-primary-100 text-primary-600 shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle Minimap"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {/* Edit Mode */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                isEditMode 
                  ? 'bg-warning-100 text-warning-700 border-2 border-warning-300 shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditMode ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Mode</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">View Only</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Map Container */}
        <div className="relative bg-gray-50 rounded-xl shadow-lg border-2 border-gray-300 overflow-hidden">
          <div
            ref={mapContainerRef}
            className="overflow-auto"
            style={{ maxHeight: '70vh' }}
            onScroll={() => setViewportPosition(calculateViewport())}
          >
            <div
              ref={canvasRef}
              className="relative"
              style={{
                width: mapWidth,
                height: mapHeight,
                background: 'linear-gradient(to bottom, #fafafa, #f5f5f5)',
                backgroundImage: showGrid
                  ? `linear-gradient(rgba(229, 231, 235, 0.5) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(229, 231, 235, 0.5) 1px, transparent 1px)`
                  : 'none',
                backgroundSize: showGrid ? `${cellSize}px ${cellSize}px` : 'auto'
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleUnitDragEnd}
            >
              {/* Facility Infrastructure Layer */}
              {showAisles && (
                <svg
                  className="absolute inset-0 pointer-events-none"
                  width={mapWidth}
                  height={mapHeight}
                  style={{ zIndex: 1 }}
                >
                  {/* Main Aisles */}
                  <rect
                    x={0}
                    y={10 * cellSize}
                    width={mapWidth}
                    height={3 * cellSize}
                    fill="rgba(209, 213, 219, 0.3)"
                    stroke="rgba(156, 163, 175, 0.5)"
                    strokeWidth="1"
                  />
                  
                  {/* Vertical Aisles */}
                  {[6, 12, 18, 24, 30].map(x => (
                    <rect
                      key={`aisle-v-${x}`}
                      x={x * cellSize}
                      y={0}
                      width={cellSize}
                      height={mapHeight}
                      fill="rgba(209, 213, 219, 0.2)"
                      stroke="rgba(156, 163, 175, 0.3)"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                  ))}
                  
                  {/* Entrance Markers */}
                  {facilityLayout.entrances.map((entrance, i) => (
                    <g key={`entrance-${i}`}>
                      <rect
                        x={entrance.x * cellSize}
                        y={entrance.y * cellSize}
                        width={entrance.width * cellSize}
                        height={entrance.height * cellSize}
                        fill="rgba(34, 197, 94, 0.2)"
                        stroke="rgba(34, 197, 94, 0.8)"
                        strokeWidth="2"
                      />
                      <text
                        x={entrance.x * cellSize + (entrance.width * cellSize) / 2}
                        y={entrance.y * cellSize + (entrance.height * cellSize) / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#059669"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {entrance.type === 'main' ? 'MAIN' : 'EXIT'}
                      </text>
                    </g>
                  ))}
                  
                  {/* Elevators */}
                  {selectedFloor === 2 && facilityLayout.elevators.map((elevator, i) => (
                    <g key={`elevator-${i}`}>
                      <rect
                        x={elevator.x * cellSize}
                        y={elevator.y * cellSize}
                        width={elevator.width * cellSize}
                        height={elevator.height * cellSize}
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="rgba(59, 130, 246, 0.8)"
                        strokeWidth="2"
                      />
                      <text
                        x={elevator.x * cellSize + (elevator.width * cellSize) / 2}
                        y={elevator.y * cellSize + (elevator.height * cellSize) / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#2563eb"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        ELEV
                      </text>
                    </g>
                  ))}
                </svg>
              )}

              {/* Row Labels */}
              {showLabels && facilityLayout.rows.map((row, i) => (
                <div
                  key={`row-label-${row}`}
                  className="absolute flex items-center justify-center bg-gray-700 text-white rounded-md shadow-md"
                  style={{
                    left: -35,
                    top: (i * 2.5 + 2) * cellSize,
                    width: 30,
                    height: 30,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}
                >
                  {row}
                </div>
              ))}

              {/* Storage Units Layer */}
              {floorUnits.map(unit => {
                const unitStyle = unitStyles[unit.status];
                const isSelected = selectedUnit?.id === unit.id;
                const isHovered = hoveredUnit?.id === unit.id;
                const isDragged = isDragging && draggedUnit?.id === unit.id;
                
                return (
                  <motion.div
                    key={unit.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: unit.position.x * cellSize,
                      top: unit.position.y * cellSize,
                      width: unit.width * cellSize - 2,
                      height: unit.height * cellSize - 2,
                      zIndex: isSelected ? 100 : isHovered ? 50 : 10,
                      opacity: isDragged ? 0.5 : 1
                    }}
                    draggable={isEditMode && !unit.locked}
                    onDragStart={() => handleUnitDragStart(unit)}
                    onClick={() => !isEditMode && setSelectedUnit(unit)}
                    onMouseEnter={() => setHoveredUnit(unit)}
                    onMouseLeave={() => setHoveredUnit(null)}
                    whileHover={!isEditMode ? { scale: 1.02 } : {}}
                    whileTap={!isEditMode ? { scale: 0.98 } : {}}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, delay: Math.random() * 0.1 }}
                  >
                    <div
                      className="w-full h-full rounded-md shadow-md transition-all duration-200 relative overflow-hidden"
                      style={{
                        backgroundColor: unitStyle.fill,
                        border: `${isSelected ? 3 : unitStyle.strokeWidth}px solid ${
                          isSelected ? '#1f2937' : unitStyle.stroke
                        }`,
                        boxShadow: isSelected 
                          ? '0 0 0 4px rgba(31, 41, 55, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          : isHovered
                          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      {/* Pattern overlay for maintenance/reserved */}
                      {unitStyle.pattern === 'stripes' && (
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 5px,
                              ${unitStyle.stroke} 5px,
                              ${unitStyle.stroke} 10px
                            )`
                          }}
                        />
                      )}
                      {unitStyle.pattern === 'dots' && (
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `radial-gradient(circle, ${unitStyle.stroke} 1px, transparent 1px)`,
                            backgroundSize: '8px 8px'
                          }}
                        />
                      )}
                      
                      {/* Unit Content */}
                      <div className="flex flex-col items-center justify-center h-full p-1">
                        {zoom >= 0.6 && (
                          <>
                            <div 
                              className="font-bold text-gray-800"
                              style={{ 
                                fontSize: `${Math.max(10, 14 * zoom)}px`,
                                lineHeight: 1.2
                              }}
                            >
                              {unit.unit_number}
                            </div>
                            {zoom >= 0.8 && (
                              <>
                                <div 
                                  className="text-gray-600"
                                  style={{ fontSize: `${Math.max(8, 10 * zoom)}px` }}
                                >
                                  {unit.realWidth}×{unit.realHeight} ft
                                </div>
                                <div 
                                  className="text-gray-700 font-medium"
                                  style={{ fontSize: `${Math.max(8, 10 * zoom)}px` }}
                                >
                                  ${unit.monthly_rate}
                                </div>
                              </>
                            )}
                          </>
                        )}
                        
                        {/* Status indicator for small zoom */}
                        {zoom < 0.6 && (
                          <div
                            className="w-full h-full rounded-sm"
                            style={{ backgroundColor: unitStyle.stroke, opacity: 0.3 }}
                          />
                        )}
                        
                        {/* Lock indicator */}
                        {unit.locked && (
                          <Lock className="absolute top-1 right-1 w-3 h-3 text-gray-500" />
                        )}
                        
                        {/* Occupied indicator */}
                        {unit.status === 'occupied' && zoom >= 1 && (
                          <div className="absolute bottom-1 left-1 right-1 bg-gray-800/80 text-white text-xs px-1 py-0.5 rounded text-center truncate">
                            {unit.customer_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Grid Coordinates */}
              {showGrid && zoom >= 0.8 && (
                <>
                  {/* Column markers */}
                  {Array.from({ length: Math.floor(gridSize.cols / 5) }, (_, i) => (
                    <div
                      key={`col-${i}`}
                      className="absolute text-xs text-gray-400 font-mono"
                      style={{
                        left: (i * 5 + 2.5) * cellSize - 8,
                        top: -25
                      }}
                    >
                      {(i * 5) + 1}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Minimap */}
          {showMinimap && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl border-2 border-gray-300 overflow-hidden" style={{ width: 200, height: 100, zIndex: 1000 }}>
              <div className="relative w-full h-full bg-gray-100">
                {/* Minimap units */}
                {floorUnits.map(unit => (
                  <div
                    key={`mini-${unit.id}`}
                    className="absolute"
                    style={{
                      left: `${(unit.position.x / gridSize.cols) * 100}%`,
                      top: `${(unit.position.y / gridSize.rows) * 100}%`,
                      width: `${(unit.width / gridSize.cols) * 100}%`,
                      height: `${(unit.height / gridSize.rows) * 100}%`,
                      backgroundColor: unitStyles[unit.status].stroke,
                      opacity: 0.7
                    }}
                  />
                ))}
                
                {/* Viewport indicator */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/10"
                  style={{
                    left: `${(viewportPosition.x / gridSize.cols) * 100}%`,
                    top: `${(viewportPosition.y / gridSize.rows) * 100}%`,
                    width: `${(viewportPosition.width / gridSize.cols) * 100}%`,
                    height: `${(viewportPosition.height / gridSize.rows) * 100}%`
                  }}
                />
              </div>
              <div className="absolute bottom-1 right-1 text-xs text-gray-500 bg-white/90 px-1 rounded">
                Floor {selectedFloor}
              </div>
            </div>
          )}

          {/* Hover Info */}
          {hoveredUnit && !isDragging && (
            <div 
              className="absolute z-50 bg-gray-900 text-white p-2 rounded-lg shadow-xl text-xs pointer-events-none"
              style={{
                left: Math.min(hoveredUnit.position.x * cellSize + hoveredUnit.width * cellSize + 10, mapWidth - 150),
                top: hoveredUnit.position.y * cellSize
              }}
            >
              <div className="font-bold mb-1">{hoveredUnit.unit_number}</div>
              <div>Size: {hoveredUnit.realWidth}×{hoveredUnit.realHeight} ft</div>
              <div>Rate: ${hoveredUnit.monthly_rate}/mo</div>
              <div className="capitalize">Status: {hoveredUnit.status}</div>
              {hoveredUnit.features.length > 0 && (
                <div className="mt-1 pt-1 border-t border-gray-700">
                  {hoveredUnit.features.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend and Stats */}
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Legend */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Legend:</span>
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border-2"
                    style={{ 
                      backgroundColor: unitStyles[status].fill,
                      borderColor: color 
                    }}
                  />
                  <span className="text-sm text-gray-600 capitalize">{status}</span>
                </div>
              ))}
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-gray-600">
                <span className="font-medium">Total:</span> {floorUnits.length} units
              </div>
              <div className="text-green-600">
                <span className="font-medium">Available:</span> {floorUnits.filter(u => u.status === 'available').length}
              </div>
              <div className="text-blue-600">
                <span className="font-medium">Occupancy:</span> {Math.round((floorUnits.filter(u => u.status === 'occupied').length / floorUnits.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold gradient-text mb-2"
        >
          Storage Units Manager
        </motion.h1>
        <p className="text-gray-600">Design and manage your storage facility layout</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Units</p>
              <p className="text-2xl font-bold">{units.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary-500 opacity-20" />
          </div>
        </Card>
        
        <Card className="border-l-4 border-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Available</p>
              <p className="text-2xl font-bold">
                {units.filter(u => u.status === 'available').length}
              </p>
            </div>
            <Check className="w-8 h-8 text-success-500 opacity-20" />
          </div>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Occupied</p>
              <p className="text-2xl font-bold">
                {units.filter(u => u.status === 'occupied').length}
              </p>
            </div>
            <Home className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="border-l-4 border-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Floor 1</p>
              <p className="text-2xl font-bold">
                {units.filter(u => u.floor === 1).length}
              </p>
            </div>
            <Layers className="w-8 h-8 text-warning-500 opacity-20" />
          </div>
        </Card>

        <Card className="border-l-4 border-accent-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Floor 2</p>
              <p className="text-2xl font-bold">
                {units.filter(u => u.floor === 2).length}
              </p>
            </div>
            <Layers className="w-8 h-8 text-accent-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Floor selector */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow">
            <button
              onClick={() => setSelectedFloor(1)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFloor === 1
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Floor 1
            </button>
            <button
              onClick={() => setSelectedFloor(2)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFloor === 2
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Floor 2
            </button>
          </div>

          {/* View mode */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Map View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3x3 className="w-4 h-4 inline mr-2" />
              Grid View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importFloorPlan}
              className="hidden"
            />
            <Button variant="secondary">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </label>
          
          <Button variant="secondary" onClick={exportFloorPlan}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="gradient" onClick={() => setIsAddingUnit(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'map' ? (
        <Card className="p-6">
          {renderFloorMap()}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {units
            .filter(u => u.floor === selectedFloor)
            .map(unit => (
              <Card
                key={unit.id}
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedUnit(unit)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{unit.unit_number}</h3>
                    <p className="text-sm text-gray-500">
                      {unit.realWidth || unit.width * 2.5}x{unit.realHeight || unit.height * 2.5} ft
                    </p>
                  </div>
                  <Badge
                    variant={
                      unit.status === 'available' ? 'success' :
                      unit.status === 'occupied' ? 'info' :
                      unit.status === 'maintenance' ? 'warning' : 'default'
                    }
                  >
                    {unit.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Monthly Rate:</span>
                    <span className="font-semibold">${unit.monthly_rate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Floor:</span>
                    <span className="font-semibold">{unit.floor}</span>
                  </div>
                  {unit.customer_name && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">Customer:</p>
                      <p className="text-sm font-medium">{unit.customer_name}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(unit);
                      setSelectedUnit(unit);
                      setIsAddingUnit(true);
                    }}
                    className="flex-1 p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUnit(unit.id);
                    }}
                    className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Add/Edit Unit Modal */}
      <AnimatePresence>
        {isAddingUnit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddingUnit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedUnit ? 'Edit Unit' : 'Add New Unit'}
                </h2>
                <button
                  onClick={() => {
                    setIsAddingUnit(false);
                    setSelectedUnit(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Unit Number and Floor */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Number
                    </label>
                    <input
                      type="text"
                      value={formData.unit_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit_number: e.target.value }))}
                      placeholder="e.g., A101"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor
                    </label>
                    <select
                      value={formData.floor}
                      onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={1}>Floor 1</option>
                      <option value={2}>Floor 2</option>
                    </select>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Size
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {Object.entries(unitSizes).map(([key, size]) => (
                      <button
                        key={key}
                        onClick={() => handleSizeTypeChange(key)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.size_type === key
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{size.label}</div>
                        {size.defaultRate > 0 && (
                          <div className="text-sm text-gray-500">${size.defaultRate}/mo</div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom dimensions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width (ft)
                      </label>
                      <input
                        type="number"
                        value={formData.realWidth}
                        onChange={(e) => {
                          const realWidth = parseInt(e.target.value) || 0;
                          const gridWidth = Math.ceil(realWidth / 2.5);
                          setFormData(prev => ({ 
                            ...prev, 
                            realWidth,
                            width: gridWidth,
                            size_type: 'custom'
                          }));
                        }}
                        min="5"
                        step="5"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (ft)
                      </label>
                      <input
                        type="number"
                        value={formData.realHeight}
                        onChange={(e) => {
                          const realHeight = parseInt(e.target.value) || 0;
                          const gridHeight = Math.ceil(realHeight / 2.5);
                          setFormData(prev => ({ 
                            ...prev, 
                            realHeight,
                            height: gridHeight,
                            size_type: 'custom'
                          }));
                        }}
                        min="5"
                        step="5"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Position on Map */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position on Map (Grid Coordinates)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Column (X)
                      </label>
                      <input
                        type="number"
                        value={formData.position.x}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          position: { ...prev.position, x: parseInt(e.target.value) || 0 }
                        }))}
                        min="0"
                        max={gridSize.cols - 1}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Row (Y)
                      </label>
                      <input
                        type="number"
                        value={formData.position.y}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          position: { ...prev.position, y: parseInt(e.target.value) || 0 }
                        }))}
                        min="0"
                        max={gridSize.rows - 1}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Rate and Status */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={formData.monthly_rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthly_rate: e.target.value }))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Climate Control', '24/7 Access', 'Drive-up Access', 'Security Camera', 'Ground Floor', 'Elevator Access'].map(feature => (
                      <label key={feature} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, features: [...prev.features, feature] }));
                            } else {
                              setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }));
                            }
                          }}
                          className="rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Lock unit position */}
                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.locked}
                      onChange={(e) => setFormData(prev => ({ ...prev, locked: e.target.checked }))}
                      className="rounded text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm">Lock unit position (prevent dragging)</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsAddingUnit(false);
                      setSelectedUnit(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={selectedUnit ? handleUpdateUnit : handleAddUnit}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {selectedUnit ? 'Update Unit' : 'Add Unit'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unit Details Modal */}
      <AnimatePresence>
        {selectedUnit && !isAddingUnit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUnit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUnit.unit_number}</h2>
                    <p className="text-gray-500">
                      {selectedUnit.realWidth || selectedUnit.width * 2.5}x{selectedUnit.realHeight || selectedUnit.height * 2.5} ft - Floor {selectedUnit.floor}
                    </p>
                  </div>
                  <Badge
                    variant={
                      selectedUnit.status === 'available' ? 'success' :
                      selectedUnit.status === 'occupied' ? 'info' :
                      selectedUnit.status === 'maintenance' ? 'warning' : 'default'
                    }
                  >
                    {selectedUnit.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Rate</p>
                    <p className="text-2xl font-bold text-primary-600">${selectedUnit.monthly_rate}</p>
                  </div>

                  {selectedUnit.customer_name && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Tenant</p>
                      <p className="font-medium">{selectedUnit.customer_name}</p>
                    </div>
                  )}

                  {selectedUnit.features && selectedUnit.features.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedUnit.features.map(feature => (
                          <Badge key={feature} variant="default">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedUnit.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Notes</p>
                      <p className="text-sm">{selectedUnit.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setFormData(selectedUnit);
                      setIsAddingUnit(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Unit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedUnit(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnitsManager;