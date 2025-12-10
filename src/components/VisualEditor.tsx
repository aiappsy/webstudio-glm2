'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Trash2, 
  Settings, 
  Type, 
  Image, 
  Layout,
  Palette,
  Save,
  Eye
} from 'lucide-react'

interface VisualElement {
  id: string
  type: 'heading' | 'text' | 'button' | 'image' | 'container' | 'divider'
  content: string
  styles: Record<string, unknown>
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  children?: VisualElement[]
}

interface VisualEditorProps {
  elements: VisualElement[]
  onElementsChange: (elements: VisualElement[]) => void
  onPreview?: () => void
  onSave?: () => void
}

const SimpleElement: React.FC<{
  element: VisualElement
  index: number
  onSelect: (element: VisualElement) => void
  onUpdate: (element: VisualElement) => void
  onDelete: (elementId: string) => void
}> = ({ element, index, onSelect, onUpdate, onDelete }) => {
  const renderElement = () => {
    const baseClasses = "p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-all"
    
    switch (element.type) {
      case 'heading':
        return (
          <h1 className={`${baseClasses} text-3xl font-bold text-center`}>
            {element.content}
          </h1>
        )
      case 'text':
        return (
          <p className={`${baseClasses} text-sm`}>
            {element.content}
          </p>
        )
      case 'button':
        return (
          <button className={`${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`}>
            {element.content}
          </button>
        )
      case 'image':
        return (
          <img 
            src={element.content} 
            alt="Visual element"
            className={`${baseClasses} p-0`}
          />
        )
      case 'container':
        return (
          <div className={`${baseClasses} border-2 border-dashed border-muted-foreground min-h-24`}>
            {element.content}
          </div>
        )
      case 'divider':
        return (
          <hr className="border-t border-border my-4" />
        )
      default:
        return (
          <div className={baseClasses}>
            {element.content}
          </div>
        )
    }
  }

  return (
    <div
      onClick={() => onSelect(element)}
      className="hover:outline-2 hover:outline-ring transition-all mb-2"
    >
      {renderElement()}
    </div>
  )
}

const ComponentLibrary: React.FC<{
  onAddElement: (type: VisualElement['type']) => void
}> = ({ onAddElement }) => {
  const components = [
    { type: 'heading' as const, icon: Type, label: 'Heading', description: 'Add a heading element' },
    { type: 'text' as const, icon: Type, label: 'Text', description: 'Add a text paragraph' },
    { type: 'button' as const, icon: Plus, label: 'Button', description: 'Add a clickable button' },
    { type: 'image' as const, icon: Image, label: 'Image', description: 'Add an image' },
    { type: 'container' as const, icon: Layout, label: 'Container', description: 'Add a container for layout' },
    { type: 'divider' as const, icon: Layout, label: 'Divider', description: 'Add a divider line' }
  ]

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Components
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {components.map((component) => (
          <Button
            key={component.type}
            variant="outline"
            className="w-full justify-start h-auto p-3"
            onClick={() => onAddElement(component.type)}
          >
            <component.icon className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div className="font-medium">{component.label}</div>
              <div className="text-xs text-muted-foreground">{component.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

const PropertyPanel: React.FC<{
  selectedElement: VisualElement | null
  onUpdateElement: (element: VisualElement) => void
}> = ({ selectedElement, onUpdateElement }) => {
  if (!selectedElement) {
    return (
      <Card className="w-64">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-center">Select an element to edit properties</p>
        </CardContent>
      </Card>
    )
  }

  const updateStyle = (property: string, value: unknown) => {
    onUpdateElement({
      ...selectedElement,
      styles: {
        ...selectedElement.styles,
        [property]: value
      }
    })
  }

  const updateContent = (content: string) => {
    onUpdateElement({
      ...selectedElement,
      content
    })
  }

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="content">Content</Label>
          <Input
            id="content"
            value={selectedElement.content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Element content"
          />
        </div>

        <div>
          <Label htmlFor="fontSize">Font Size</Label>
          <Select value={(selectedElement.styles.fontSize as string) || '16px'} onValueChange={(value) => updateStyle('fontSize', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="18px">18px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
              <SelectItem value="24px">24px</SelectItem>
              <SelectItem value="32px">32px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="color">Text Color</Label>
          <Input
            id="color"
            type="color"
            value={(selectedElement.styles.color as string) || '#000000'}
            onChange={(e) => updateStyle('color', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={(selectedElement.styles.backgroundColor as string) || '#ffffff'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default function VisualEditor({ elements, onElementsChange, onPreview, onSave }: VisualEditorProps) {
  const [selectedElement, setSelectedElement] = useState<VisualElement | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleAddElement = useCallback((type: VisualElement['type']) => {
    const newElement: VisualElement = {
      id: `element_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: {
        x: 50,
        y: 50,
        width: 200,
        height: 100
      }
    }

    onElementsChange([...elements, newElement])
    setSelectedElement(newElement)
  }, [elements, onElementsChange])

  const handleUpdateElement = useCallback((updatedElement: VisualElement) => {
    onElementsChange(elements.map(el => el.id === updatedElement.id ? updatedElement : el))
  }, [elements, onElementsChange])

  const handleDeleteElement = useCallback((elementId: string) => {
    onElementsChange(elements.filter(el => el.id !== elementId))
    if (selectedElement?.id === elementId) {
      setSelectedElement(null)
    }
  }, [elements, onElementsChange, selectedElement])

  const getDefaultContent = (type: VisualElement['type']): string => {
    switch (type) {
      case 'heading': return 'Your Heading'
      case 'text': return 'Your text content goes here. This is a paragraph that can contain multiple sentences and provide detailed information about your topic.'
      case 'button': return 'Click Me'
      case 'image': return 'https://via.placeholder.com/300x200'
      case 'container': return 'Container'
      case 'divider': return ''
      default: return 'Element'
    }
  }

  const getDefaultStyles = (type: VisualElement['type']) => {
    const baseStyles = {
      fontSize: '16px',
      color: '#000000',
      backgroundColor: 'transparent',
      padding: '8px 16px',
      margin: '0',
      borderRadius: '4px',
      textAlign: 'left' as const,
      fontWeight: 'normal'
    }

    switch (type) {
      case 'heading':
        return {
          ...baseStyles,
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center' as const
        }
      case 'button':
        return {
          ...baseStyles,
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px'
        }
      case 'image':
        return {
          ...baseStyles,
          padding: '0',
          maxWidth: '100%'
        }
      case 'container':
        return {
          ...baseStyles,
          border: '2px dashed #d1d5db',
          minHeight: '100px'
        }
      default:
        return baseStyles
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Component Library */}
      <div className="w-64 p-4 border-r bg-white">
        <ComponentLibrary onAddElement={handleAddElement} />
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 space-x-2">
          <Button onClick={onPreview} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={onSave} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        <div 
          ref={canvasRef}
          className="absolute inset-0 m-4 bg-white shadow-lg overflow-auto p-4"
          style={{ minHeight: '600px' }}
        >
          {elements.map((element, index) => (
            <SimpleElement
              key={element.id}
              element={element}
              index={index}
              onSelect={setSelectedElement}
              onUpdate={handleUpdateElement}
              onDelete={handleDeleteElement}
            />
          ))}
        </div>
      </div>

      {/* Property Panel */}
      <div className="w-64 p-4 border-l bg-white">
        <PropertyPanel
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
        />
      </div>
    </div>
  )
}