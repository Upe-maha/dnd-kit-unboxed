import { DndContext, DragEndEvent, useDraggable, useDroppable, pointerWithin } from '@dnd-kit/core'
import { useState } from 'react'

//Add this new component
function Draggable() {
  const { attributes, listeners, setNodeRef, transform,  } = useDraggable({
    id: 'draggable',
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px,  0)`,
  } : undefined

  return (
    <div
      className="h-24 w-24 rounded-md bg-blue-500 p-4 text-white"
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      Drag me
    </div>
  )
}

function Droppable({children}: {children: React.ReactNode}) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  })
  return (
    <div
      ref={setNodeRef}
      className={`flex h-40 w-40 items-center justify-center rounded-md border-2 border-dashed 
   ${isOver ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-600'
        }
  `}>
    {children ||
      <span className="text-gray-500 dark:text-gray-400">Drop here</span>
    }
    </div>
  )
}

export default function BasicDragDrop() {
 const [isDropped, setIsDropped] = useState(false)

  function handleDragEnd(event: DragEndEvent) {
   if (event.over && event.over.id === 'droppable') {
     setIsDropped(true)
   } else {
     setIsDropped(false)
   }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}
    collisionDetection={pointerWithin}
    >
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        {!isDropped && <Draggable />} 
        <Droppable>
          {isDropped && <Draggable />}
        </Droppable>
      </div>
    </DndContext>
  )
}
