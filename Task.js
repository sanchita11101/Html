const { useState, useRef } = React;

// Unique ID generator
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const DRAGGABLE_ELEMENTS = [
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'button', label: 'Button' },
];

const DEFAULT_PROPERTIES = {
  text: { content: 'Sample Text', color: '#222222', fontSize: 16 },
  image: { src: 'https://via.placeholder.com/150', alt: 'Placeholder Image', width: 150 },
  button: { label: 'Click Me', url: '#', color: '#3b82f6', fontSize: 16 },
};

function Draggable({ type, label }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/x-builder-element', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div>
      className="draggable"
      draggable
      onDragStart={handleDragStart}
      tabIndex={0}
      role="button"
      aria-label={`Drag to add a ${label} element`}
    
      {label}
    </div>
  );
}

function CanvasElement({ element, selected, onSelect, onDrag, onDragEnd }) {
  const elementRef = useRef(null);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(element.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = element.x;
    const origY = element.y;

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      onDrag(element.id, Math.max(0, origX + deltaX), Math.max(0, origY + deltaY));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      onDragEnd(element.id);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const style = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    fontSize: element.props.fontSize ? `${element.props.fontSize}px` : 'inherit',
    color: element.props.color || '#000',
    maxWidth: '280px',
  };

  if (element.type === 'text') {
    return (
      <div
        ref={elementRef}
        className={`canvas-element${selected ? ' selected' : ''}`}
        style={style}
        onMouseDown={handleMouseDown}
        tabIndex={0}
        aria-label="Text element"
      >
        {element.props.content}
      </div>
    );
  } else if (element.type === 'image') {
    return (
      <img
        ref={elementRef}
        src={element.props.src}
        alt={element.props.alt || 'Image'}
        className={`canvas-element${selected ? ' selected' : ''}`}
        style={{
          ...style,
          width: element.props.width ? `${element.props.width}px` : '150px',
          height: 'auto',
        }}
        draggable={false}
        onMouseDown={handleMouseDown}
        tabIndex={0}
        aria-label="Image element"
      />
    );
  } else if (element.type === 'button') {
    return (
      <button
        ref={elementRef}
        className={`canvas-element${selected ? ' selected' : ''}`}
        style={style}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.preventDefault()}
        tabIndex={0}
        aria-label="Button element"
      >
        {element.props.label}
      </button>
    );
  }

  return null;
}

function PropertiesPanel({ element, onChange, onDelete }) {
  if (!element) {
    return (
      <div className="properties-panel">
        <h3>No element selected</h3>
        <p>Select an element to configure its properties</p>
      </div>
    );
  }

  const updateProp = (prop, value) => {
    onChange({ ...element, props: { ...element.props, [prop]: value } });
  };

  const handleInputChange = (e, prop, type = 'text') => {
    let val = e.target.value;
    if (type === 'number') val = parseInt(val) || 0;
    updateProp(prop, val);
  };

  return (
    <div className="properties-panel">
      <h3>Properties - {element.type.charAt(0).toUpperCase() + element.type.slice(1)}</h3>

      {element.type === 'text' && (
        <>
          <label>Text Content</label>
          <textarea value={element.props.content} rows={3} onChange={(e) => updateProp('content', e.target.value)} />

          <label>Text Color</label>
          <input type="color" value={element.props.color} onChange={(e) => updateProp('color', e.target.value)} />

          <label>Font Size</label>
          <input type="number" value={element.props.fontSize} min={8} max={72} onChange={(e) => handleInputChange(e, 'fontSize', 'number')} />
        </>
      )}

      {element.type === 'image' && (
        <>
          <label>Image URL</label>
          <input type="url" value={element.props.src} onChange={(e) => updateProp('src', e.target.value)} />

          <label>Alt Text</label>
          <input type="text" value={element.props.alt} onChange={(e) => updateProp('alt', e.target.value)} />

          <label>Width</label>
          <input type="number" value={element.props.width} min={50} max={800} onChange={(e) => handleInputChange(e, 'width', 'number')} />
        </>
      )}

      {element.type === 'button' && (
        <>
          <label>Button Label</label>
          <input type="text" value={element.props.label} onChange={(e) => updateProp('label', e.target.value)} />

          <label>Link URL</label>
          <input type="url" value={element.props.url} onChange={(e) => updateProp('url', e.target.value)} />

          <label>Button Color</label>
          <input type="color" value={element.props.color} onChange={(e) => updateProp('color', e.target.value)} />

          <label>Font Size</label>
          <input type="number" value={element.props.fontSize} min={8} max={48} onChange={(e) => handleInputChange(e, 'fontSize', 'number')} />
        </>
      )}

      <button onClick={() => window.confirm('Delete this element?') && onDelete(element)} style={{ backgroundColor: '#ef4444' }}>
        Delete Element
      </button>
    </div>
  );
}

function App() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const canvasRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/x-builder-element');
    if (!type) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - canvasRect.left;
    let y = e.clientY - canvasRect.top;

    x = Math.max(0, Math.min(x, canvasRect.width));
    y = Math.max(0, Math.min(y, canvasRect.height));

    const newElement = {
      id: generateId(),
      type,
      x,
      y,
      props: { ...DEFAULT_PROPERTIES[type] },
    };

    setElements((els) => [...els, newElement]);
    setSelectedId(newElement.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleSelect = (id) => setSelectedId(id);
  const handleElementDrag = (id, x, y) => setElements((els) => els.map((el) => el.id === id ? { ...el, x, y } : el));
  const handleElementDragEnd = () => {};
  const handleElementChange = (updatedElement) => setElements((els) => els.map((el) => el.id === updatedElement.id ? updatedElement : el));
  const handleElementDelete = (element) => {
    setElements((els) => els.filter((el) => el.id !== element.id));
    setSelectedId(null);
  };
  const selectedElement = elements.find((el) => el.id === selectedId);
  const handleCanvasClick = () => setSelectedId(null);

  return (
    <div id="root" style={{ display: 'flex', height: '100vh' }}>
      <nav className="sidebar">
        <h2>Elements</h2>
        {DRAGGABLE_ELEMENTS.map((el) => (
          <Draggable key={el.type} type={el.type} label={el.label} />
        ))}
      </nav>

      <section className="canvas-container">
        <header className="canvas-header">Template Canvas</header>
        <div
          ref={canvasRef}
          className="canvas"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
        >
          {elements.map((el) => (
            <CanvasElement
              key={el.id}
              element={el}
              selected={selectedId === el.id}
              onSelect={handleSelect}
              onDrag={handleElementDrag}
              onDragEnd={handleElementDragEnd}
            />
          ))}
        </div>
      </section>

      <aside className="properties-panel">
        <PropertiesPanel
          element={selectedElement}
          onChange={handleElementChange}
          onDelete={handleElementDelete}
        />
      </aside>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


