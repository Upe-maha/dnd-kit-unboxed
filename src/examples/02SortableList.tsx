import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core'

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

interface Item {
  id: UniqueIdentifier
  content: string
}

export default function SortableList() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
    { id: '4', content: 'Item 4' },
    { id: '5', content: 'Item 5' },
  ])

  // state to track which item is being dragged
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // the distance fo pointer must be 8 px before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null) // reset the activeId to null when the drag ends

    const { active, over } = event

    if (!over) {
      return
    }

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function SortableItem({ id, content }: Item) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        key={id}
        className={`cursor-grab rounded-md border p-3 active:cursor-grabbing ${isDragging ? 'z-10 opacity-50 shadow-md dark:bg-blue-900' : 'border-gray-500 dark:bg-gray-800'} `}
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400">⋮⋮</span>
          <span className="dark:text-gray-200">{content}</span>
        </div>
      </li>
    )
  }
  const getActiveItem = () => {
    return items.find((item) => item.id === activeId)?.content
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold dark:text-white">Sortable List</h2>

      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} content={item.content} />
            ))}
          </ul>
        </SortableContext>
        <DragOverlay
          adjustScale
          dropAnimation={{
            duration: 180,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeId ? (
            <div className="w-full cursor-grabbing rounded-md p-3 shadow-2xl dark:bg-blue-900/50">
              <div className="flex items-center gap-3">
                <span className="text-blue-500">⋮⋮</span>
                <span className="font-medium dark:text-gray-400">
                  {getActiveItem()}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
