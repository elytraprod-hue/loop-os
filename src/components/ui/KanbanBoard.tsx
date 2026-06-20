import { useState, useCallback } from 'react';
import { DndContext, DragOverlay, closestCorners, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

interface KanbanItem {
  id: string;
  columnId: string;
  title: string;
  subtitle?: string;
  metadata?: Record<string, string>;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  items: KanbanItem[];
  onItemMove: (itemId: string, newColumnId: string) => void;
  onItemClick?: (item: KanbanItem) => void;
}

function SortableCard({ item, onClick }: { item: KanbanItem; onClick?: (item: KanbanItem) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: `${transition}, box-shadow .15s, opacity .15s`,
        opacity: isDragging ? 0.4 : 1,
        padding: '14px 16px',
        borderRadius: 12,
        cursor: 'grab',
        userSelect: 'none',
        fontSize: 13,
        borderLeft: '3px solid var(--accent-border)',
      }}
      {...attributes}
      {...listeners}
      className="glass-soft"
      onClick={() => onClick?.(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(item); }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <GripVertical size={12} className="text-muted" style={{ flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</span>
      </div>
      {item.subtitle && (
        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 20 }}>{item.subtitle}</div>
      )}
      {item.metadata && Object.entries(item.metadata).length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, marginLeft: 20 }}>
          {Object.entries(item.metadata).map(([key, val]) => (
            <span key={key} className="badge badge-neutral" style={{ fontSize: 10 }}>
              {val}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function KanbanBoard({ columns, items, onItemMove, onItemClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeItem = activeId ? items.find((i) => i.id === activeId) ?? null : null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find((i) => i.id === active.id);
    if (!activeItem) return;

    // Find target column from the droppable's id or from the item being hovered
    const overItem = items.find((i) => i.id === over.id);
    const targetColumnId = overItem?.columnId ?? (over.id as string);

    if (activeItem.columnId !== targetColumnId) {
      onItemMove(active.id as string, targetColumnId);
    }
  }, [items, onItemMove]);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 16, alignItems: 'start' }}>
        {columns.map((col) => {
          const colItems = items.filter((i) => i.columnId === col.id);
          return (
            <div key={col.id} className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                <span style={{ fontWeight: 600, fontSize: 13 }}>{col.title}</span>
                <span className="badge badge-neutral" style={{ marginLeft: 'auto', fontSize: 10 }}>
                  {colItems.length}
                </span>
              </div>
              <SortableContext items={colItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
                  {colItems.map((item) => (
                    <SortableCard key={item.id} item={item} onClick={onItemClick} />
                  ))}
                  {colItems.length === 0 && (
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: 20 }}>
                      Arraste itens para cá
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="glass" style={{ padding: '14px 16px', borderRadius: 12, borderLeft: '3px solid var(--accent)', fontSize: 13, opacity: 0.9, transform: 'rotate(3deg)' }}>
            {activeItem.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export type { KanbanColumn, KanbanItem, KanbanBoardProps };
